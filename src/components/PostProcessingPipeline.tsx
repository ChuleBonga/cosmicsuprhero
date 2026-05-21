import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type PostProcessingOptions = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  width: number;
  height: number;
  isMobile: boolean;
};

export type PostProcessingPipeline = {
  render: (elapsed: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

const vignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.08 },
    darkness: { value: 0.52 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
      color.rgb = mix(color.rgb, vec3(0.0), dot(uv, uv) * darkness);
      gl_FragColor = color;
    }
  `,
};

const filmNoiseShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.012 },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    varying vec2 vUv;

    float random(vec2 coord) {
      return fract(sin(dot(coord.xy, vec2(12.9898, 78.233)) + time * 0.04) * 43758.5453);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float grain = (random(vUv * 1180.0) - 0.5) * amount;
      color.rgb += grain;
      gl_FragColor = color;
    }
  `,
};

const chromaticShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.00055 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;

    void main() {
      vec2 offset = vec2(amount, amount * 0.55);
      vec4 color = texture2D(tDiffuse, vUv);
      color.r = texture2D(tDiffuse, vUv + offset).r;
      color.b = texture2D(tDiffuse, vUv - offset).b;
      gl_FragColor = color;
    }
  `,
};

export function createPostProcessingPipeline({
  renderer,
  scene,
  camera,
  width,
  height,
  isMobile,
}: PostProcessingOptions): PostProcessingPipeline {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(width, height);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new Vector2(width, height),
    isMobile ? 0.1 : 0.16,
    isMobile ? 0.12 : 0.18,
    0.62,
  );
  composer.addPass(bloomPass);

  const vignettePass = new ShaderPass(vignetteShader);
  vignettePass.uniforms.darkness.value = isMobile ? 0.38 : 0.5;
  vignettePass.uniforms.offset.value = isMobile ? 0.98 : 1.08;
  composer.addPass(vignettePass);

  const noisePass = new ShaderPass(filmNoiseShader);
  noisePass.uniforms.amount.value = isMobile ? 0.006 : 0.01;
  composer.addPass(noisePass);

  const chromaticPass = new ShaderPass(chromaticShader);
  chromaticPass.uniforms.amount.value = isMobile ? 0.00022 : 0.00045;
  composer.addPass(chromaticPass);

  return {
    render(elapsed) {
      noisePass.uniforms.time.value = elapsed;
      composer.render();
    },
    resize(nextWidth, nextHeight) {
      composer.setSize(nextWidth, nextHeight);
      bloomPass.setSize(nextWidth, nextHeight);
    },
    dispose() {
      composer.dispose();
    },
  };
}
