"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

/**
 * Minimal WebGPU runtime for Figma "ShaderFill" effects.
 *
 * Same call shape as the Figma-exported code:
 *   <ShaderFill className="absolute" shader={{ setup, render, params, manifest }} />
 *
 * Figma's own runtime lives in an MCP resource that couldn't be read in this session, so this is a
 * small stand-in that implements the contract the generated shader uses:
 *   frame = { state, params, time (ms), output: { width, height, format, createView() } }
 * If you later pull Figma's official runtime, it can replace this folder without touching callers.
 *
 * Behaviour: renders at 1x CSS pixels, pauses while off-screen / tab hidden, draws a single still
 * frame for prefers-reduced-motion, and does nothing when WebGPU isn't available (whatever sits
 * behind the canvas, i.e. the section's background photo, shows through instead).
 */

export interface ShaderModule {
  setup: (device: any, frame: any) => void;
  render: (device: any, frame: any) => void;
  params?: Record<string, unknown>;
  manifest?: { isAnimated?: boolean; name?: string; version?: number };
}

export default function ShaderFill({ shader, className }: { shader: ShaderModule; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gpu = (navigator as any).gpu;
    if (!canvas || !gpu) return;

    let disposed = false;
    let raf = 0;
    let onScreen = true;
    let device: any;
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    (async () => {
      const adapter = await gpu.requestAdapter();
      if (!adapter || disposed) return;
      device = await adapter.requestDevice();
      if (disposed) {
        device.destroy?.();
        return;
      }
      const ctx = canvas.getContext("webgpu") as any;
      if (!ctx) return;
      const format = gpu.getPreferredCanvasFormat();
      ctx.configure({ device, format, alphaMode: "premultiplied" });

      const frame: any = {
        state: {},
        params: shader.params ?? {},
        time: 0,
        output: {
          width: 1,
          height: 1,
          format,
          createView: () => ctx.getCurrentTexture().createView(),
        },
      };
      shader.setup(device, frame);

      const resize = () => {
        const w = Math.max(1, Math.round(canvas.clientWidth));
        const h = Math.max(1, Math.round(canvas.clientHeight));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        frame.output.width = w;
        frame.output.height = h;
      };
      resize();
      ro = new ResizeObserver(() => {
        resize();
        if (reduce) draw(performance.now());
      });
      ro.observe(canvas);

      const t0 = performance.now();
      const STILL_MS = 2500; // pleasant frame for reduced-motion users
      let shown = false;

      function draw(now: number) {
        raf = 0;
        if (disposed || !onScreen || document.hidden) return;
        frame.time = reduce ? STILL_MS : now - t0;
        shader.render(device, frame);
        if (!shown) {
          shown = true;
          canvas!.style.opacity = "1";
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      }

      io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !raf) raf = requestAnimationFrame(draw);
      });
      io.observe(canvas);

      const onVis = () => {
        if (!document.hidden && onScreen && !raf) raf = requestAnimationFrame(draw);
      };
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => document.removeEventListener("visibilitychange", onVis));

      raf = requestAnimationFrame(draw);
    })().catch(() => {
      /* WebGPU init failed: leave the fallback background visible */
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      cleanups.forEach((fn) => fn());
      device?.destroy?.();
    };
  }, [shader]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ opacity: 0, transition: "opacity 1s ease" }}
    />
  );
}