import type { CSSProperties } from "react";

type Fault = {
  x: number;
  y: number;
  rotation: number;
  duration: number;
  opacity: number;
  delay: number;
  width: number;
};

type FaultStyle = CSSProperties & Record<`--${string}`, string | number>;

const faults: Fault[] = [
  { x: 5, y: 18, rotation: -18, duration: 5.8, opacity: 0.34, delay: 0.2, width: 18 },
  { x: 21, y: 9, rotation: 24, duration: 7.2, opacity: 0.24, delay: 2.1, width: 12 },
  { x: 42, y: 16, rotation: -31, duration: 6.4, opacity: 0.38, delay: 1.4, width: 24 },
  { x: 68, y: 11, rotation: 18, duration: 8.1, opacity: 0.22, delay: 3.1, width: 16 },
  { x: 82, y: 26, rotation: -10, duration: 5.9, opacity: 0.28, delay: 0.9, width: 20 },
  { x: 13, y: 43, rotation: 35, duration: 7.7, opacity: 0.3, delay: 2.6, width: 22 },
  { x: 34, y: 39, rotation: -12, duration: 6.1, opacity: 0.42, delay: 1.1, width: 27 },
  { x: 57, y: 46, rotation: 29, duration: 8.6, opacity: 0.26, delay: 3.6, width: 19 },
  { x: 72, y: 53, rotation: -42, duration: 6.9, opacity: 0.31, delay: 1.8, width: 25 },
  { x: 9, y: 67, rotation: -28, duration: 7.1, opacity: 0.22, delay: 3.9, width: 17 },
  { x: 28, y: 72, rotation: 14, duration: 5.7, opacity: 0.36, delay: 0.4, width: 23 },
  { x: 49, y: 78, rotation: -8, duration: 8.2, opacity: 0.24, delay: 2.8, width: 18 },
  { x: 76, y: 74, rotation: 38, duration: 6.3, opacity: 0.32, delay: 1.7, width: 21 },
  { x: 88, y: 63, rotation: -22, duration: 7.4, opacity: 0.2, delay: 4.2, width: 14 },
];

export function ShadowPressureField() {
  return (
    <div className="shadow-pressure-field" aria-hidden="true">
      <div className="shadow-pressure-field__core" />
      <div className="shadow-pressure-field__collapse" />
      {faults.map((fault, index) => {
        const style: FaultStyle = {
          "--x": fault.x,
          "--y": fault.y,
          "--r": `${fault.rotation}deg`,
          "--d": `${fault.duration}s`,
          "--o": fault.opacity,
          "--delay": `${fault.delay}s`,
          "--w": `${fault.width}vw`,
        };

        return <span className="shadow-pressure-field__fault" style={style} key={`${fault.x}-${fault.y}-${index}`} />;
      })}
    </div>
  );
}
