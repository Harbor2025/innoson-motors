/* Temporary CDP visual check for /book-a-test-drive. */
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const OUT = "C:/Users/HP/AppData/Local/Temp/opencode/td-shots";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) {
    try {
      targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
      if (targets.length) break;
    } catch {}
    await sleep(200);
  }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.on("open", r));

  let id = 0;
  const pending = new Map();
  let fulfillApi = false;

  ws.on("message", async (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === "Fetch.requestPaused") {
      const { requestId, request } = msg.params;
      if (fulfillApi && request.url.includes("/api/test-drives")) {
        const body = Buffer.from(JSON.stringify({ id: "test", message: "ok" })).toString("base64");
        await send("Fetch.fulfillRequest", {
          requestId,
          responseCode: 200,
          responseHeaders: [
            { name: "Content-Type", value: "application/json" },
            { name: "Access-Control-Allow-Origin", value: "*" },
          ],
          body,
        });
      } else {
        await send("Fetch.continueRequest", { requestId });
      }
    }
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const i = ++id;
      pending.set(i, resolve);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.result?.exceptionDetails) {
      throw new Error(JSON.stringify(res.result.exceptionDetails));
    }
    return res.result?.result?.value;
  }

  async function waitFor(expr, timeout = 30000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      if (await evaluate(expr)) return true;
      await sleep(200);
    }
    throw new Error(`Timeout waiting for ${expr}`);
  }

  let shot = 0;
  async function screenshot(name) {
    const res = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
    });
    const file = path.join(OUT, `${String(++shot).padStart(2, "0")}-${name}.png`);
    fs.writeFileSync(file, Buffer.from(res.result.data, "base64"));
    console.log("saved", file);
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1300,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send("Page.navigate", { url: "http://127.0.0.1:3000/book-a-test-drive" });
  await waitFor(`document.body.innerText.includes("Which vehicle would you like to drive?")`);
  await sleep(800);
  await screenshot("step1");

  // Continue with nothing selected -> error state.
  await evaluate(`[...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Continue")?.click()`);
  await waitFor(`document.body.innerText.includes("Please select a vehicle")`);
  await sleep(400);
  await screenshot("step1-error");

  // Choose the first vehicle.
  await evaluate(`document.querySelector(".grid > button[aria-pressed]")?.click()`);
  await sleep(500);
  await screenshot("step1-selected");

  // Continue to showrooms.
  await evaluate(`[...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Continue")?.click()`);
  await waitFor(`document.body.innerText.includes("Where would you like to drive it?")`);
  await sleep(600);
  await screenshot("step2");

  // Continue to details.
  await evaluate(`[...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Continue")?.click()`);
  await waitFor(`document.body.innerText.includes("Tell us about you")`);
  await sleep(600);
  await screenshot("step3");

  // Fill the form.
  await evaluate(`
    (() => {
      const set = (id, value) => {
        const el = document.getElementById(id);
        const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set("td-name", "Test Driver");
      set("td-email", "test@example.com");
      set("td-phone", "08012345678");
      set("td-message", "Please call before noon.");
    })()
  `);
  await sleep(300);
  await screenshot("step3-filled");

  // Intercept the API so no real booking is created.
  fulfillApi = true;
  await evaluate(`document.querySelector('button[form="test-drive-details"]')?.click()`);
  await waitFor(`document.body.innerText.includes("Test drive requested")`);
  await sleep(800);
  await screenshot("success");

  const summary = await evaluate(`document.body.innerText`);
  fs.writeFileSync(path.join(OUT, "success.txt"), summary);
  console.log(summary);

  ws.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
