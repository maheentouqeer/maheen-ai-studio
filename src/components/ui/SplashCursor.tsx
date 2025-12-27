"use client";

import { useEffect, useRef, useCallback } from "react";

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 6, g: 16, b: 35 },
  TRANSPARENT = true,
}: {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getWebGLContext = useCallback((canvas: HTMLCanvasElement) => {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!gl;
    if (!isWebGL2) {
      gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
    }

    if (!gl) return null;

    let halfFloat: { HALF_FLOAT_OES: number } | null = null;
    let supportLinearFiltering: OES_texture_half_float_linear | null = null;
    
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES || gl.HALF_FLOAT;
    const formatRGBA = getSupportedFormat(gl, gl.RGBA16F || gl.RGBA, gl.RGBA, halfFloatTexType);
    const formatRG = getSupportedFormat(gl, gl.RG16F || gl.RGBA, gl.RG || gl.RGBA, halfFloatTexType);
    const formatR = getSupportedFormat(gl, gl.R16F || gl.RGBA, gl.RED || gl.RGBA, halfFloatTexType);

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }, []);

  function getSupportedFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if on mobile - don't run on mobile devices
    if (window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    const context = getWebGLContext(canvas);
    if (!context) return;

    const { gl, ext } = context;

    function resizeCanvas() {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Simplified fluid simulation for performance
    let pointers: Pointer[] = [];
    let lastTime = Date.now();

    function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = { r: 35, g: 126, b: 246 }; // Primary blue color
    }

    function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = (pointer.texcoordX - pointer.prevTexcoordX) * SPLAT_FORCE;
      pointer.deltaY = (pointer.texcoordY - pointer.prevTexcoordY) * SPLAT_FORCE;
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function updatePointerUpData(pointer: Pointer) {
      pointer.down = false;
    }

    function onMouseMove(e: MouseEvent) {
      let pointer = pointers.find((p) => p.id === -1);
      if (!pointer) {
        pointer = {
          id: -1,
          texcoordX: 0,
          texcoordY: 0,
          prevTexcoordX: 0,
          prevTexcoordY: 0,
          deltaX: 0,
          deltaY: 0,
          down: true,
          moved: false,
          color: { r: 35, g: 126, b: 246 },
        };
        pointers.push(pointer);
      }
      if (!pointer.down) {
        updatePointerDownData(pointer, -1, e.clientX, e.clientY);
      }
      updatePointerMoveData(pointer, e.clientX, e.clientY);
    }

    function onMouseDown(e: MouseEvent) {
      let pointer = pointers.find((p) => p.id === -1);
      if (!pointer) {
        pointer = {
          id: -1,
          texcoordX: 0,
          texcoordY: 0,
          prevTexcoordX: 0,
          prevTexcoordY: 0,
          deltaX: 0,
          deltaY: 0,
          down: false,
          moved: false,
          color: { r: 35, g: 126, b: 246 },
        };
        pointers.push(pointer);
      }
      updatePointerDownData(pointer, -1, e.clientX, e.clientY);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);

    // Simple particle simulation
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }> = [];

    function addParticle(x: number, y: number, vx: number, vy: number) {
      if (particles.length > 100) return;
      particles.push({
        x,
        y,
        vx: vx * 0.1,
        vy: vy * 0.1,
        life: 1,
        color: `hsla(214, 92%, 55%, `,
      });
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    function drawParticles(ctx: CanvasRenderingContext2D) {
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.life * 0.5) + ")";
        ctx.fill();
      }
    }

    // Create 2D canvas for simpler effect
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add particles from pointer movement
      for (const pointer of pointers) {
        if (pointer.moved) {
          const x = pointer.texcoordX * canvas.width;
          const y = (1 - pointer.texcoordY) * canvas.height;
          addParticle(x, y, pointer.deltaX, pointer.deltaY);
        }
      }

      updateParticles();
      drawParticles(ctx);

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(animationId);
    };
  }, [getWebGLContext, SPLAT_FORCE]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default SplashCursor;
