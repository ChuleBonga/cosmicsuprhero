import { useEffect, useRef, useState } from "react";
import type { PostProcessingPipeline } from "./PostProcessingPipeline";
import type { Vector3 } from "three";

type SceneState = "fallback" | "webgl";
type DisposableSceneObject = {
  geometry?: { dispose: () => void };
  material?: { dispose: () => void } | Array<{ dispose: () => void }>;
};

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ObservatorySceneSpike() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [sceneState, setSceneState] = useState<SceneState>("fallback");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !canUseWebGL()) {
      setSceneState("fallback");
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    Promise.all([import("three"), import("./PostProcessingPipeline")])
      .then(([THREE, { createPostProcessingPipeline }]) => {
        if (disposed || !mountRef.current) return;

        const isMobile = window.matchMedia("(max-width: 760px)").matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(isMobile ? 0.5 : -0.65, isMobile ? 1.15 : 0.7, isMobile ? 8.8 : 7.8);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.65));
        renderer.domElement.className = "oss-webgl-canvas";
        mountRef.current.appendChild(renderer.domElement);

        const root = new THREE.Group();
        root.position.set(isMobile ? 0 : 1.15, isMobile ? -1.15 : -0.05, 0);
        root.rotation.set(isMobile ? -0.58 : -0.16, isMobile ? -0.08 : -0.42, isMobile ? -0.08 : -0.04);
        root.scale.setScalar(isMobile ? 0.76 : 1);
        scene.add(root);

        const warm = new THREE.Color("#f0bf72");
        const ember = new THREE.Color("#c8521a");
        const violet = new THREE.Color("#7c6fd5");

        const ringMaterial = new THREE.MeshBasicMaterial({
          color: warm,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        });
        const violetRingMaterial = new THREE.MeshBasicMaterial({
          color: violet,
          transparent: true,
          opacity: 0.14,
          depthWrite: false,
        });
        const darkMaterial = new THREE.MeshBasicMaterial({
          color: "#030305",
          transparent: true,
          opacity: 0.78,
          depthWrite: false,
        });
        const emberMaterial = new THREE.MeshBasicMaterial({
          color: ember,
          transparent: true,
          opacity: 0.88,
          depthWrite: false,
        });
        const lineMaterial = new THREE.LineBasicMaterial({
          color: warm,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
        });
        const violetLineMaterial = new THREE.LineBasicMaterial({
          color: violet,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        });

        const rings = new THREE.Group();
        root.add(rings);

        [2.2, 3.15, 4.1].forEach((radius, index) => {
          const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.01, 12, 160), index === 1 ? violetRingMaterial : ringMaterial);
          torus.rotation.x = Math.PI / 2.5;
          torus.rotation.y = index * 0.38;
          torus.rotation.z = index * 0.2;
          rings.add(torus);
        });

        const receiver = new THREE.Group();
        root.add(receiver);

        const core = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 20), emberMaterial);
        core.position.y = -0.08;
        receiver.add(core);

        const darkDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.18, 80), darkMaterial);
        darkDisk.rotation.x = Math.PI / 2;
        darkDisk.position.y = -0.26;
        receiver.add(darkDisk);

        const mastMaterial = new THREE.MeshBasicMaterial({
          color: warm,
          transparent: true,
          opacity: 0.58,
          depthWrite: false,
        });
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 12), mastMaterial);
        mast.position.y = 0.82;
        receiver.add(mast);

        [-0.42, 0.42].forEach((x) => {
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 10), mastMaterial);
          arm.position.set(x * 0.48, 1.26, 0);
          arm.rotation.z = x < 0 ? 1.04 : -1.04;
          receiver.add(arm);
        });

        const signalArc = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.018, 12, 80, Math.PI * 1.24), mastMaterial);
        signalArc.position.y = 1.22;
        signalArc.rotation.z = -Math.PI * 0.62;
        receiver.add(signalArc);

        const beamGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-3.6, 0.12, -0.22),
          new THREE.Vector3(-0.2, 0.12, 0),
          new THREE.Vector3(4.1, 0.34, -0.55),
        ]);
        const beam = new THREE.Line(beamGeometry, violetLineMaterial);
        root.add(beam);

        const gridGroup = new THREE.Group();
        gridGroup.position.set(0, -1.75, -1.8);
        gridGroup.rotation.x = -Math.PI / 2.4;
        root.add(gridGroup);
        const gridPoints: Vector3[] = [];
        for (let i = -7; i <= 7; i += 1) {
          gridPoints.push(new THREE.Vector3(i, -4.2, 0), new THREE.Vector3(i, 4.2, 0));
          gridPoints.push(new THREE.Vector3(-7, i * 0.6, 0), new THREE.Vector3(7, i * 0.6, 0));
        }
        gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPoints), lineMaterial));

        const dustCount = isMobile ? 90 : 180;
        const dustPositions = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount; i += 1) {
          dustPositions[i * 3] = (Math.random() - 0.5) * 12;
          dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
          dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1.4;
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
        const dust = new THREE.Points(
          dustGeometry,
          new THREE.PointsMaterial({
            color: warm,
            transparent: true,
            opacity: 0.24,
            size: isMobile ? 0.018 : 0.024,
            depthWrite: false,
          }),
        );
        scene.add(dust);

        let width = 1;
        let height = 1;
        const targetPointer = { x: 0, y: 0 };
        const currentPointer = { x: 0, y: 0 };
        let postProcessing: PostProcessingPipeline | null = createPostProcessingPipeline({
          renderer,
          scene,
          camera,
          width,
          height,
          isMobile,
        });

        const resize = () => {
          if (!mountRef.current) return;
          const rect = mountRef.current.getBoundingClientRect();
          width = Math.max(1, rect.width);
          height = Math.max(1, rect.height);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          postProcessing?.resize(width, height);
        };

        const onPointerMove = (event: PointerEvent) => {
          const rect = mount.getBoundingClientRect();
          targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          targetPointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        mount.addEventListener("pointermove", onPointerMove);
        resize();
        setSceneState("webgl");

        const startedAt = performance.now();
        let animationFrame = 0;
        const animate = () => {
          if (disposed) return;
          const elapsed = (performance.now() - startedAt) / 1000;
          currentPointer.x += (targetPointer.x - currentPointer.x) * 0.04;
          currentPointer.y += (targetPointer.y - currentPointer.y) * 0.04;

          rings.rotation.z = elapsed * 0.035;
          rings.rotation.y = currentPointer.x * 0.07;
          receiver.rotation.y = currentPointer.x * 0.12;
          receiver.rotation.x = currentPointer.y * 0.06;
          core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.035);
          dust.rotation.y = elapsed * 0.012;
          dust.rotation.x = currentPointer.y * 0.015;
          camera.position.x = (isMobile ? 0.5 : -0.65) + currentPointer.x * 0.18;
          camera.position.y = (isMobile ? 1.15 : 0.7) - currentPointer.y * 0.12;
          camera.lookAt(0.45, -0.18, 0);

          if (postProcessing) {
            postProcessing.render(elapsed);
          } else {
            renderer.render(scene, camera);
          }
          animationFrame = window.requestAnimationFrame(animate);
        };
        animate();

        cleanup = () => {
          window.cancelAnimationFrame(animationFrame);
          resizeObserver.disconnect();
          mount.removeEventListener("pointermove", onPointerMove);
          postProcessing?.dispose();
          postProcessing = null;
          renderer.dispose();
          scene.traverse((object) => {
            const disposable = object as DisposableSceneObject;
            if (disposable.geometry) {
              disposable.geometry.dispose();
            }
            if (disposable.material) {
              const material = disposable.material;
              if (Array.isArray(material)) {
                material.forEach((item) => item.dispose());
              } else {
                material.dispose();
              }
            }
          });
          renderer.domElement.remove();
          setSceneState("fallback");
        };
      })
      .catch(() => {
        setSceneState("fallback");
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={`observatory-scene-spike observatory-scene-spike--${sceneState}`} aria-hidden="true">
      <div ref={mountRef} className="oss-webgl-mount" />
      <div className="oss-css-fallback">
        <div className="oss-depth-field" />
        <div className="oss-ember-wake" />
        <div className="oss-receiver-map">
          <span />
          <span />
          <span />
        </div>
        <div className="oss-signal-dish">
          <span className="oss-dish-ring oss-dish-ring--outer" />
          <span className="oss-dish-ring oss-dish-ring--mid" />
          <span className="oss-dish-ring oss-dish-ring--inner" />
          <span className="oss-dish-beam" />
          <div className="oss-core">
            <span className="oss-core-glow" />
            <span className="oss-core-mark" />
            <span className="oss-core-line" />
            <span className="oss-core-line" />
            <span className="oss-core-line" />
          </div>
        </div>
        <div className="oss-console-slab">
          <span>RX 07</span>
          <span>MEMORY BAND</span>
          <span>NO AUTOPLAY</span>
        </div>
        <div className="oss-foreground-rail">
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
