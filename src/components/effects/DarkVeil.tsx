"use client";

import { useEffect, useRef } from "react";

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
  className?: string;
}

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time,u_hue,u_noise,u_scan,u_scanFreq,u_warp;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
vec3 palette(float t){return .5+.5*cos(6.2831*(t+vec3(0.,.33,.67)));}
void main(){
vec2 uv=gl_FragCoord.xy/u_res;
vec2 p=uv;p.x*=u_res.x/u_res.y;
float t=u_time;
vec2 w=vec2(fbm(p*1.6+t*.12),fbm(p*1.6+vec2(5.2,1.3)-t*.1));
vec2 q=p+(w-.5)*u_warp*2.;
float n=fbm(q*2.2-t*.05);
vec3 base=mix(vec3(.043,.055,.09),vec3(.10,.12,.18),n);
base+=palette(n*.6+u_hue)*u_noise*n;
float scan=sin(uv.y*u_res.y*u_scanFreq*.02+t*2.)*.5+.5;
base*=1.-u_scan*scan*.35;
float vig=smoothstep(1.15,.35,length(uv-.5)*1.4);
base*=mix(.55,1.,vig);
gl_FragColor=vec4(base,1.);}`;

/**
 * DarkVeil — full-bleed WebGL atmosphere: warped fbm fog, faint scanlines,
 * vignette. Pauses off-screen (IntersectionObserver), caps DPR, honours
 * prefers-reduced-motion with a single static frame.
 */
export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0.05,
  scanlineIntensity = 0.1,
  speed = 0.3,
  scanlineFrequency = 0.5,
  warpAmount = 0.1,
  resolutionScale = 0.75,
  className = "",
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      canvas.style.background =
        "radial-gradient(120% 90% at 50% 10%, #141b2e 0%, #0a0f1e 55%, #060a14 100%)";
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("shader alloc failed");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(`shader: ${gl.getShaderInfoLog(s)}`);
      }
      return s;
    };

    let prog: WebGLProgram | null = null;
    try {
      prog = gl.createProgram();
      if (!prog) return;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl!.getUniformLocation(prog!, n);
    const uRes = u("u_res"),
      uTime = u("u_time"),
      uHue = u("u_hue"),
      uNoise = u("u_noise"),
      uScan = u("u_scan"),
      uScanFreq = u("u_scanFreq"),
      uWarp = u("u_warp");

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Mobi|Android/i.test(window.navigator.userAgent));
    const dprCap = isMobile ? 1.5 : 2;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.max(2, Math.floor(r.width * dpr * resolutionScale));
      canvas.height = Math.max(2, Math.floor(r.height * dpr * resolutionScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const frame = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ((now - start) / 1000) * speed * 3);
      gl.uniform1f(uHue, hueShift);
      gl.uniform1f(uNoise, noiseIntensity * 4);
      gl.uniform1f(uScan, scanlineIntensity);
      gl.uniform1f(uScanFreq, scanlineFrequency * 2);
      gl.uniform1f(uWarp, warpAmount);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting ?? true;
        if (v && !visible) {
          visible = true;
          if (!reduced) raf = requestAnimationFrame(frame);
        } else if (!v) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (!document.hidden && visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame); // paints first frame even in reduced-motion

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    hueShift,
    noiseIntensity,
    scanlineIntensity,
    speed,
    scanlineFrequency,
    warpAmount,
    resolutionScale,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
