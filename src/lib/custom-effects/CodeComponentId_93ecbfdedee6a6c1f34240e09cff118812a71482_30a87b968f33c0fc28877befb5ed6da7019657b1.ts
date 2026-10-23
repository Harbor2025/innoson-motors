// lib/custom-effects/CodeComponentId_93ecbfdedee6a6c1f34240e09cff118812a71482_30a87b968f33c0fc28877befb5ed6da7019657b1.ts
// @ts-nocheck

// Property metadata is only used in Figma Design, so this is a no-op.
function defineProperties(
  _component: unknown,
  _properties: unknown,
): void {}

export default function Effect() { }
export function setup(device, frame) {
    var wgsl = `diagnostic(off,derivative_uniformity);
struct Uniforms {
  baseColor: vec4f,
  midColor: vec4f,
  glowColor: vec4f,
  p0: vec4f,
  p1: vec4f,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VsIn {
  @location(0) pos: vec2f,
  @location(1) uv: vec2f,
};
struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  out.position = vec4f(in.pos, 0.0, 1.0);
  out.uv = in.uv;
  return out;
}

fn hash2(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let w = f * f * (3.0 - 2.0 * f);
  let a = hash2(i);
  let b = hash2(i + vec2f(1.0, 0.0));
  let c = hash2(i + vec2f(0.0, 1.0));
  let d = hash2(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

fn fbm(p0: vec2f) -> f32 {
  var p = p0;
  var v = 0.0;
  var amp = 0.5;
  for (var i = 0; i < 5; i = i + 1) {
    v = v + amp * vnoise(p);
    p = vec2f(p.x * 1.6 - p.y * 1.2, p.x * 1.2 + p.y * 1.6) + vec2f(1.7, 9.2);
    amp = amp * 0.5;
  }
  return v;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let t = u.p0.x * u.p0.y;
  let aspect = u.p1.x / max(u.p1.y, 1.0);
  let scale = u.p0.w;
  let p = vec2f(uv.x * aspect, uv.y) * scale;

  let q = vec2f(fbm(p + vec2f(0.0, t * 0.12)), fbm(p + vec2f(5.2, 1.3) - vec2f(t * 0.08, 0.0)));
  let r = vec2f(fbm(p + 3.0 * q + vec2f(1.7, 9.2) + t * 0.05), fbm(p + 3.0 * q + vec2f(8.3, 2.8) - t * 0.04));
  let n = fbm(p + 2.5 * r);

  var col = mix(u.baseColor.rgb, u.midColor.rgb, smoothstep(0.25, 0.75, n));

  let band = 0.5 + 0.5 * sin((uv.y * 3.2 + n * 2.8 - uv.x * 1.4) * 3.14159 + t * 0.6);
  let ribbon = pow(band, 12.0) * smoothstep(0.35, 0.8, q.x + r.y * 0.5);
  col = col + u.glowColor.rgb * ribbon * u.p1.z;
  col = col + u.glowColor.rgb * pow(clamp(r.x, 0.0, 1.0), 4.0) * 0.35 * u.p1.z;

  let vig = smoothstep(1.25, 0.35, length((uv - vec2f(0.5, 0.5)) * vec2f(1.2, 1.0)));
  col = col * (0.7 + 0.3 * vig);

  let g = hash2(uv * u.p1.xy + vec2f(fract(t) * 37.0, 0.0)) - 0.5;
  col = col + g * u.p0.z;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;
    frame.state.module = device.createShaderModule({ code: wgsl });
    frame.state.pipeline = null;
    frame.state.pipelineFormat = null;
    frame.state.quad = device.createBuffer({
        size: 6 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(frame.state.quad.getMappedRange()).set([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        -1, 1, 0, 0,
        1, -1, 1, 1,
        1, 1, 1, 0,
    ]);
    frame.state.quad.unmap();
    frame.state.uniforms = device.createBuffer({
        size: 80,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
export function render(device, frame) {
    var params = frame.params || {};
    function ch(color, channel, fallback) {
        var c = color || {};
        var value = Number(c[channel]);
        return Number.isFinite(value) ? value : fallback;
    }
    function num(v, fallback) {
        var n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }
    var seconds = Number(frame.time) * 0.001;
    if (!Number.isFinite(seconds))
        seconds = 0;
    var w = frame.output.width;
    var h = frame.output.height;
    device.queue.writeBuffer(frame.state.uniforms, 0, new Float32Array([
        ch(params.baseColor, 'r', 0.02), ch(params.baseColor, 'g', 0.07), ch(params.baseColor, 'b', 0.18), 1,
        ch(params.midColor, 'r', 0.0), ch(params.midColor, 'g', 0.37), ch(params.midColor, 'b', 0.72), 1,
        ch(params.glowColor, 'r', 0.55), ch(params.glowColor, 'g', 0.82), ch(params.glowColor, 'b', 1.0), 1,
        seconds, num(params.speed, 0.4), num(params.grain, 0.03), num(params.scale, 2.2),
        w, h, num(params.glow, 0.8), 0,
    ]));
    var outputFormat = frame.output.format;
    if (frame.state.pipeline == null || frame.state.pipelineFormat !== outputFormat) {
        frame.state.pipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: frame.state.module,
                entryPoint: 'vs_main',
                buffers: [{
                        arrayStride: 16,
                        attributes: [
                            { shaderLocation: 0, format: 'float32x2', offset: 0 },
                            { shaderLocation: 1, format: 'float32x2', offset: 8 },
                        ],
                    }],
            },
            fragment: {
                module: frame.state.module,
                entryPoint: 'fs_main',
                targets: [{ format: outputFormat }],
            },
            primitive: { topology: 'triangle-list' },
        });
        frame.state.pipelineFormat = outputFormat;
    }
    var encoder = device.createCommandEncoder();
    var pass = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.output.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    pass.setPipeline(frame.state.pipeline);
    var bindGroup = device.createBindGroup({
        layout: frame.state.pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: frame.state.uniforms } }],
    });
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, frame.state.quad);
    pass.draw(6);
    pass.end();
    device.queue.submit([encoder.finish()]);
}
defineProperties(Effect, {
    baseColor: { type: 'color', label: 'Base', defaultValue: { r: 0.02, g: 0.07, b: 0.18, a: 1 } },
    midColor: { type: 'color', label: 'Brand blue', defaultValue: { r: 0.0, g: 0.37, b: 0.72, a: 1 } },
    glowColor: { type: 'color', label: 'Glow', defaultValue: { r: 0.55, g: 0.82, b: 1.0, a: 1 } },
    speed: { type: 'number', label: 'Speed', defaultValue: 0.4, min: 0, max: 2, step: 0.05, control: 'slider' },
    scale: { type: 'number', label: 'Scale', defaultValue: 2.2, min: 0.5, max: 6, step: 0.1, control: 'slider' },
    glow: { type: 'number', label: 'Glow strength', defaultValue: 0.8, min: 0, max: 2, step: 0.05, control: 'slider' },
    grain: { type: 'number', label: 'Grain', defaultValue: 0.03, min: 0, max: 0.15, step: 0.005, control: 'slider' },
});

export const manifest = {
  "isAnimated": true,
  "name": "IVM Aurora",
  "usesMouse": false,
  "version": 2
}