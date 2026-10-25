import { useLayoutEffect, useRef, useState } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { SUBJECTS } from "./PhotographyGraphic";
import type { ScenePalette } from "./lighting";

// Simulated "what the photographer sees on the camera monitor".
// World units are inches, distances measured from the camera.

const VB_W = 300;
const VB_H = 200;
const EYE_HEIGHT = 60; // camera held at ~1.5 m

type Props = {
  focalLength: number; // mm
  aperture: number;
  distanceInInches: number;
  sensorHeightMM: number;
  cocMM: number;
  subject: keyof typeof SUBJECTS;
  hudLabel: string; // e.g. "2.0 m"
  title: string;
  caption: string;
  palette: ScenePalette;
  exposureDelta: number; // EV over (+) or under (-) exposed
  cast: [number, number, number];
  noise: number; // 0..1 grain strength
  shutterLabel: string;
  isoLabel: string;
  recording?: boolean;
  cpl?: number; // 0..1 polariser effect
  uv?: boolean;
  filterTag?: string;
  logView?: boolean; // show flat log image (no LUT)
  profileTag?: string;
};

export default function MonitorView({
  focalLength,
  aperture,
  distanceInInches,
  sensorHeightMM,
  cocMM,
  subject,
  hudLabel,
  title,
  caption,
  palette: P,
  exposureDelta,
  cast,
  noise,
  shutterLabel,
  isoLabel,
  recording,
  cpl = 0,
  uv = false,
  filterTag = "",
  logView = false,
  profileTag = "",
}: Props) {
  const gain = Math.pow(2, exposureDelta);
  const slope = cast.map((c) => (c * gain) / (logView ? 8 : 1));
  // log encoding of linear light 0..8 (≈ middle grey at ~40 %)
  const logTable = Array.from({ length: 65 }, (_, i) => {
    const L = (i / 64) * 8;
    return L <= 0 ? 0.03 : Math.min(1, Math.max(0.03, (Math.log2(L) + 6) / 9));
  }).join(" ");
  const meter = Math.max(-3, Math.min(3, exposureDelta));
  const vfovRad = 2 * Math.atan(sensorHeightMM / 2 / focalLength);
  const frameHeightAt = (x: number) => 2 * x * Math.tan(vfovRad / 2);
  const scaleAt = (x: number) => VB_H / frameHeightAt(x);
  const halfWidthAt = (x: number) => (frameHeightAt(x) * (VB_W / VB_H)) / 2;

  const dMM = distanceInInches * 25.4;
  const f = focalLength;

  // Blur-disc diameter in viewBox units for an object at distance x (inches)
  const blurAt = (xIn: number) => {
    const xMM = xIn * 25.4;
    if (dMM <= f) return 0;
    const bMM = (f * f * Math.abs(xMM - dMM)) / (aperture * xMM * (dMM - f));
    if (bMM <= cocMM) return 0;
    return Math.min((bMM / sensorHeightMM) * VB_H, 80);
  };

  // Scene layout (relative to the subject so it stays in frame)
  const d = distanceInInches;
  const lightsDist = d + 80; // string lights ~2 m behind subject
  const treesDist = d + 180; // trees ~4.5 m behind
  const hillsDist = 4000;
  const branchDist = Math.max(d * 0.4, 14);

  const SubjectGraphic = SUBJECTS[subject].graphic;
  const subjRef = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState({ x: -20, y: 0, w: 40, h: 72 });
  useLayoutEffect(() => {
    try {
      const b = subjRef.current?.getBBox();
      if (b && b.height > 0)
        setBbox({ x: b.x, y: b.y, w: b.width, h: b.height });
    } catch {
      /* getBBox unavailable */
    }
  }, [subject]);

  const layer = (dist: number) =>
    `translate(${VB_W / 2} ${VB_H / 2}) scale(${scaleAt(dist)})`;
  const stdDev = (dist: number) => blurAt(dist) / 2.5;

  // Trees across the frame
  const treeHalfW = halfWidthAt(treesDist) + 80;
  const trees: number[] = [];
  for (let x = -treeHalfW; x <= treeHalfW && trees.length < 60; x += 70)
    trees.push(x);

  // String lights: bokeh discs drawn directly (radius grows with blur)
  const lightsHalfW = halfWidthAt(lightsDist) + 20;
  const lightScale = scaleAt(lightsDist);
  const lightBlur = blurAt(lightsDist);
  const lights: { x: number; y: number }[] = [];
  const step = Math.max(14, lightsHalfW / 30);
  for (let x = -lightsHalfW; x <= lightsHalfW && lights.length < 160; x += step) {
    const sag = 10 * Math.cos((x / 110) * Math.PI);
    lights.push({ x, y: -30 + sag });
  }

  const subjectBlur = stdDev(d);
  const focusBox = {
    x: VB_W / 2 - (bbox.w * scaleAt(d)) / 2 - 4,
    y: VB_H / 2 + (EYE_HEIGHT - bbox.h) * scaleAt(d) - 4,
    w: bbox.w * scaleAt(d) + 8,
    h: bbox.h * scaleAt(d) * 0.35 + 8,
  };

  const frameBorder = useColorModeValue("gray.300", "gray.600");
  const muted = useColorModeValue("gray.500", "gray.400");

  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color={muted}
        textTransform="uppercase"
        letterSpacing="wider"
        mb={2}
        textAlign="center"
      >
        {title}
      </Text>
      <Box
        bg="#111"
        p={{ base: 2, md: 3 }}
        rounded="xl"
        border="1px"
        borderColor={frameBorder}
        shadow="md"
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: 4 }}
          role="img"
          aria-label={title}
        >
          <defs>
            <clipPath id="mon-frame">
              <rect x={0} y={0} width={VB_W} height={VB_H} />
            </clipPath>
            <linearGradient id="mon-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.skyTop} />
              <stop offset="100%" stopColor={P.skyBottom} />
            </linearGradient>
            <linearGradient id="mon-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.groundTop} />
              <stop offset="100%" stopColor={P.groundBottom} />
            </linearGradient>
            {P.lights.map((c, i) => (
              <radialGradient key={i} id={`mon-bokeh-${i}`}>
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="45%" stopColor={c} stopOpacity="0.95" />
                <stop offset="100%" stopColor={c} stopOpacity="0.55" />
              </radialGradient>
            ))}
            <filter id="mon-expose" colorInterpolationFilters="sRGB" x={0} y={0} width={VB_W} height={VB_H} filterUnits="userSpaceOnUse">
              <feColorMatrix type="saturate" values={String(1 + (P.indoor ? 0.05 : 0.35) * cpl)} />
              <feComponentTransfer>
                <feFuncR type="gamma" amplitude={1} exponent={2.2} offset={0} />
                <feFuncG type="gamma" amplitude={1} exponent={2.2} offset={0} />
                <feFuncB type="gamma" amplitude={1} exponent={2.2} offset={0} />
              </feComponentTransfer>
              <feComponentTransfer>
                <feFuncR type="linear" slope={slope[0]} intercept={0} />
                <feFuncG type="linear" slope={slope[1]} intercept={0} />
                <feFuncB type="linear" slope={slope[2]} intercept={0} />
              </feComponentTransfer>
              {logView ? (
                <>
                  <feComponentTransfer>
                    <feFuncR type="table" tableValues={logTable} />
                    <feFuncG type="table" tableValues={logTable} />
                    <feFuncB type="table" tableValues={logTable} />
                  </feComponentTransfer>
                  <feColorMatrix type="saturate" values="0.6" />
                </>
              ) : (
                <feComponentTransfer>
                  <feFuncR type="gamma" amplitude={1} exponent={1 / 2.2} offset={0} />
                  <feFuncG type="gamma" amplitude={1} exponent={1 / 2.2} offset={0} />
                  <feFuncB type="gamma" amplitude={1} exponent={1 / 2.2} offset={0} />
                </feComponentTransfer>
              )}
            </filter>
            <linearGradient id="mon-cpl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d3f8a" />
              <stop offset="100%" stopColor="#7d9ad0" stopOpacity="0.2" />
            </linearGradient>
            <filter id="mon-grain" x={0} y={0} width={VB_W} height={VB_H} filterUnits="userSpaceOnUse">
              <feTurbulence type="fractalNoise" baseFrequency={1.6} numOctaves={1} seed={3} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            {[
              ["mon-b-hills", stdDev(hillsDist)],
              ["mon-b-trees", stdDev(treesDist)],
              ["mon-b-subj", subjectBlur],
              ["mon-b-branch", stdDev(branchDist)],
            ].map(([id, s]) => (
              <filter
                key={id as string}
                id={id as string}
                filterUnits="userSpaceOnUse"
                x={-100}
                y={-100}
                width={VB_W + 200}
                height={VB_H + 200}
              >
                <feGaussianBlur stdDeviation={s as number} />
              </filter>
            ))}
          </defs>

          <g clipPath="url(#mon-frame)">
          <g filter="url(#mon-expose)">
            {/* Sky + ground (horizon at camera height = frame centre) */}
            <rect x={0} y={0} width={VB_W} height={VB_H / 2 + 1} fill="url(#mon-sky)" />
            <rect x={0} y={VB_H / 2} width={VB_W} height={VB_H / 2} fill="url(#mon-ground)" />
            {!P.indoor && cpl > 0 && (
              <rect x={0} y={0} width={VB_W} height={VB_H / 2} fill="url(#mon-cpl)" opacity={cpl * 0.55} style={{ mixBlendMode: "multiply" }} />
            )}

            {/* Distant hills */}
            {!P.indoor && <g filter="url(#mon-b-hills)">
              <path
                d={`M0 ${VB_H / 2 + 1} L0 ${VB_H / 2 - 14} Q60 ${VB_H / 2 - 30} 120 ${VB_H / 2 - 16} T240 ${VB_H / 2 - 20} T300 ${VB_H / 2 - 12} L300 ${VB_H / 2 + 1} Z`}
                fill={P.hills}
                opacity={uv ? 0.92 : 0.8}
              />
            </g>}

            {/* Tree line behind the subject */}
            <g filter="url(#mon-b-trees)">
              <g transform={layer(treesDist)}>
                {P.indoor
                  ? trees.map((x, i) => (
                      <rect
                        key={i}
                        x={x - 35}
                        y={EYE_HEIGHT - 300}
                        width={36}
                        height={300}
                        fill={P.trees[i % 3]}
                      />
                    ))
                  : trees.map((x, i) => {
                      const h = 150 + ((i * 37) % 60);
                      return (
                        <g key={i} transform={`translate(${x} ${EYE_HEIGHT})`}>
                          <rect x={-5} y={-h * 0.45} width={10} height={h * 0.45} fill={P.trunk} />
                          <ellipse cx={0} cy={-h * 0.62} rx={38 + (i % 3) * 6} ry={h * 0.32} fill={P.trees[i % 3]} />
                        </g>
                      );
                    })}
              </g>
            </g>

            {/* String lights → bokeh */}
            <g>
              {lights.map((l, i) => {
                const cx = VB_W / 2 + l.x * lightScale;
                const cy = VB_H / 2 + l.y * lightScale;
                const sharpR = Math.max(1.2 * lightScale, 0.6);
                const r = Math.max(sharpR, lightBlur / 2);
                const opacity =
                  Math.max(0.25, Math.min(1, (sharpR / r) * 2.2)) * P.lightsOpacity;
                return (
                  <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#mon-bokeh-${i % P.lights.length})`} opacity={opacity} />
                );
              })}
            </g>

            {/* Subject (always on the focus plane) */}
            <g filter="url(#mon-b-subj)">
              <g transform={layer(d)}>
                <g
                  transform={`translate(${-(bbox.x + bbox.w / 2)} ${EYE_HEIGHT - (bbox.y + bbox.h)})`}
                  fill="#2d2a32"
                >
                  <g ref={subjRef}>
                    <SubjectGraphic />
                  </g>
                </g>
              </g>
            </g>

            {/* Foreground branch at the left edge */}
            <g filter="url(#mon-b-branch)">
              <g transform={layer(branchDist)}>
                <g transform={`translate(${-halfWidthAt(branchDist)} ${-frameHeightAt(branchDist) * 0.18}) scale(${frameHeightAt(branchDist) / 60})`}>
                  <path d="M-4 18 Q8 10 16 4" stroke={P.indoor ? "#7a6a52" : "#3b2f22"} strokeWidth={1.2} fill="none" />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <ellipse key={i} cx={2 + i * 3.2} cy={15 - i * 2.6} rx={3.4} ry={1.5} transform={`rotate(${-30 + i * 9} ${2 + i * 3.2} ${15 - i * 2.6})`} fill={P.leaves[i % 2]} />
                  ))}
                </g>
              </g>
            </g>

          </g>
            {noise > 0.01 && (
              <rect x={0} y={0} width={VB_W} height={VB_H} filter="url(#mon-grain)" opacity={noise} style={{ mixBlendMode: "overlay" }} />
            )}

            {/* Rule-of-thirds grid */}
            <g stroke="#fff" strokeOpacity={0.25} strokeWidth={0.4}>
              <line x1={VB_W / 3} y1={0} x2={VB_W / 3} y2={VB_H} />
              <line x1={(VB_W * 2) / 3} y1={0} x2={(VB_W * 2) / 3} y2={VB_H} />
              <line x1={0} y1={VB_H / 3} x2={VB_W} y2={VB_H / 3} />
              <line x1={0} y1={(VB_H * 2) / 3} x2={VB_W} y2={(VB_H * 2) / 3} />
            </g>

            {/* AF box */}
            {focusBox.w < VB_W * 1.2 && (
              <rect
                x={focusBox.x}
                y={focusBox.y}
                width={focusBox.w}
                height={focusBox.h}
                fill="none"
                stroke="#3ee07a"
                strokeWidth={1}
              />
            )}

            {/* HUD */}
            <rect x={0} y={VB_H - 14} width={VB_W} height={14} fill="#000" opacity={0.55} />
            <text x={5} y={VB_H - 4.5} fill="#fff" fontSize={6.5} fontFamily="ui-monospace, Menlo, monospace">
              {shutterLabel}  F{aperture.toFixed(1)}  ISO {isoLabel}
            </text>
            <g transform={`translate(${VB_W / 2 + 18} ${VB_H - 7})`} fontFamily="ui-monospace, Menlo, monospace">
              {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
                <g key={v} transform={`translate(${v * 7} 0)`}>
                  <line x1={0} y1={v === 0 ? -4 : -2.5} x2={0} y2={0} stroke="#fff" strokeWidth={0.6} />
                </g>
              ))}
              <line x1={-21} y1={0} x2={21} y2={0} stroke="#fff" strokeWidth={0.5} />
              <path
                d={`M${meter * 7} 1 l-2 3 h4 z`}
                fill={Math.abs(exposureDelta) > 3 ? "#ff5a5a" : "#ffd34d"}
              />
            </g>
            <text x={VB_W - 5} y={VB_H - 4.5} fill="#fff" fontSize={6.5} textAnchor="end" fontFamily="ui-monospace, Menlo, monospace">
              AF {hudLabel}
            </text>
            {profileTag && (
              <text x={VB_W - 5} y={Math.abs(exposureDelta) >= 0.15 ? 19 : 9} fill="#ffcf6b" fontSize={6} textAnchor="end" stroke="#000" strokeWidth={0.25} fontFamily="ui-monospace, Menlo, monospace">
                {profileTag}
              </text>
            )}
            {filterTag && (
              <text x={5} y={recording ? 20 : 10} fill="#9fd8ff" fontSize={6} stroke="#000" strokeWidth={0.25} fontFamily="ui-monospace, Menlo, monospace">
                {filterTag}
              </text>
            )}
            {recording && (
              <g fontFamily="ui-monospace, Menlo, monospace">
                <circle cx={9} cy={8} r={3} fill="#ff3b3b" />
                <text x={15} y={10.5} fill="#fff" fontSize={7} stroke="#000" strokeWidth={0.25}>REC</text>
              </g>
            )}
            {Math.abs(exposureDelta) >= 0.15 && (
              <text x={VB_W - 5} y={9} fill={Math.abs(exposureDelta) > 3 ? "#ff7a7a" : "#fff"} fontSize={7} textAnchor="end" fontFamily="ui-monospace, Menlo, monospace" stroke="#000" strokeWidth={0.25}>
                {exposureDelta > 0 ? "+" : ""}
                {exposureDelta.toFixed(1)} EV
              </text>
            )}
          </g>
        </svg>
      </Box>
      <Text fontSize="xs" color={muted} mt={2} textAlign="center">
        {caption}
      </Text>
    </Box>
  );
}
