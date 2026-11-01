// Light scenes, exposure maths and colour temperature helpers.

export type ScenePalette = {
  indoor: boolean;
  skyTop: string;
  skyBottom: string;
  groundTop: string;
  groundBottom: string;
  hills: string;
  trees: [string, string, string];
  trunk: string;
  leaves: [string, string];
  lights: string[]; // bokeh colours
  lightsOpacity: number; // how visible the string lights are in this scene
};

export type LightScene = {
  id: string;
  ev: number; // scene brightness, EV at ISO 100
  kelvin: number; // colour temperature of the light
  palette: ScenePalette;
};

const WARM = ["#ffe2a8"];

const outdoor = (p: Partial<ScenePalette>): ScenePalette => ({
  indoor: false,
  skyTop: "#7fa7d6",
  skyBottom: "#dfe8ee",
  groundTop: "#7d9a5b",
  groundBottom: "#4f6b38",
  hills: "#8aa3a8",
  trees: ["#3f6b3a", "#4c7d45", "#5a8a4f"],
  trunk: "#5b4632",
  leaves: ["#2f5a2a", "#3c7034"],
  lights: WARM,
  lightsOpacity: 0.3,
  ...p,
});

export const SCENES: LightScene[] = [
  { id: "summer", ev: 15, kelvin: 5500, palette: outdoor({ skyTop: "#5d93d6", skyBottom: "#cfe2f2" }) },
  {
    id: "spring",
    ev: 14,
    kelvin: 5600,
    palette: outdoor({
      skyTop: "#86b2e0",
      groundTop: "#8cb265",
      groundBottom: "#5d8440",
      trees: ["#e8a9c3", "#6f9d55", "#f2c3d5"],
      leaves: ["#5f9a46", "#e4a2bd"],
    }),
  },
  {
    id: "autumn",
    ev: 13,
    kelvin: 5000,
    palette: outdoor({
      skyTop: "#8aa9c8",
      skyBottom: "#e6dccb",
      groundTop: "#a08a4e",
      groundBottom: "#6e5a2f",
      hills: "#9c8f7a",
      trees: ["#c9622c", "#d99a2b", "#a8432a"],
      leaves: ["#c4552a", "#d9962c"],
    }),
  },
  {
    id: "winter",
    ev: 15,
    kelvin: 6800,
    palette: outdoor({
      skyTop: "#a9c2dc",
      skyBottom: "#eef3f7",
      groundTop: "#f4f6f8",
      groundBottom: "#d7dee6",
      hills: "#e3e9ef",
      trees: ["#5f7466", "#e8eef2", "#6d8173"],
      trunk: "#4a3d33",
      leaves: ["#55695b", "#dfe6ea"],
    }),
  },
  {
    id: "overcast",
    ev: 12,
    kelvin: 6500,
    palette: outdoor({ skyTop: "#a7adb3", skyBottom: "#d5d8da", groundTop: "#6f8558", groundBottom: "#4a5d39", hills: "#8f9a9c" }),
  },
  {
    id: "golden",
    ev: 11,
    kelvin: 3500,
    palette: outdoor({ skyTop: "#8fa6c9", skyBottom: "#f6d2a4", groundTop: "#7f9455", groundBottom: "#4d5f33", lightsOpacity: 0.55 }),
  },
  {
    id: "blue",
    ev: 7,
    kelvin: 9000,
    palette: outdoor({
      skyTop: "#1f3c78",
      skyBottom: "#6a86b8",
      groundTop: "#2c3b30",
      groundBottom: "#18221b",
      hills: "#34466a",
      trees: ["#1d2d24", "#24382c", "#1a2a21"],
      trunk: "#1c1712",
      leaves: ["#1a2a1e", "#223527"],
      lightsOpacity: 1,
    }),
  },
  {
    id: "night",
    ev: 4,
    kelvin: 3000,
    palette: outdoor({
      skyTop: "#080c1c",
      skyBottom: "#1c2238",
      groundTop: "#1a1f1a",
      groundBottom: "#0c0f0c",
      hills: "#151a2a",
      trees: ["#111a14", "#16211a", "#0f1712"],
      trunk: "#120e0a",
      leaves: ["#0f1a12", "#142217"],
      lightsOpacity: 1,
    }),
  },
  {
    id: "hall",
    ev: 7,
    kelvin: 3200,
    palette: {
      indoor: true,
      skyTop: "#6b5444",
      skyBottom: "#a8876b",
      groundTop: "#8a6a4c",
      groundBottom: "#5a4230",
      hills: "#000",
      trees: ["#7a1f2b", "#8f2a36", "#6b1824"],
      trunk: "#000",
      leaves: ["#d9c9a8", "#efe3c8"],
      lights: WARM,
      lightsOpacity: 1,
    },
  },
  {
    id: "disco",
    ev: 5,
    kelvin: 4000,
    palette: {
      indoor: true,
      skyTop: "#1a1426",
      skyBottom: "#33264a",
      groundTop: "#2a2230",
      groundBottom: "#151018",
      hills: "#000",
      trees: ["#241a38", "#2e2147", "#1e1630"],
      trunk: "#000",
      leaves: ["#b8a6d9", "#d8ccef"],
      lights: ["#ff4fd8", "#41e2ff", "#7dff6a", "#ffd34d", "#a46bff"],
      lightsOpacity: 1,
    },
  },
];

export const SHUTTER_SPEEDS = [
  1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60,
  1 / 30, 1 / 15, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 15, 30,
];

export const ISOS = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200];

export const WB_MODES = ["auto", "daylight", "cloudy", "tungsten", "kelvin"] as const;
export type WbMode = (typeof WB_MODES)[number];

export function formatShutter(t: number) {
  if (t >= 1) return `${Math.round(t * 10) / 10}"`;
  const d = 1 / t;
  const nice = d >= 100 ? Math.round(d / 10) * 10 : Math.round(d);
  return `1/${nice}`;
}

/** Exposure value of the camera settings at ISO 100. */
export function cameraEV(aperture: number, shutter: number, iso: number) {
  return Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
}

/** Shutter time that gives a correct exposure. */
export function correctShutter(sceneEV: number, aperture: number, iso: number) {
  return (aperture * aperture) / Math.pow(2, sceneEV + Math.log2(iso / 100));
}

export function nearestShutter(t: number) {
  let best = SHUTTER_SPEEDS[0];
  for (const s of SHUTTER_SPEEDS)
    if (Math.abs(Math.log2(s / t)) < Math.abs(Math.log2(best / t))) best = s;
  return best;
}

export function whiteBalanceKelvin(mode: WbMode, sceneK: number, manualK: number) {
  switch (mode) {
    case "daylight":
      return 5500;
    case "cloudy":
      return 6500;
    case "tungsten":
      return 3200;
    case "kelvin":
      return manualK;
    default:
      // AWB corrects most, but not all, of the colour cast
      return 5200 + (sceneK - 5200) * 0.75;
  }
}

function kelvinToRgb(k: number): [number, number, number] {
  const t = k / 100;
  const c = (v: number) => Math.min(255, Math.max(0, v));
  const r = t <= 66 ? 255 : c(329.698727446 * Math.pow(t - 60, -0.1332047592));
  const g =
    t <= 66
      ? c(99.4708025861 * Math.log(t) - 161.1195681661)
      : c(288.1221695283 * Math.pow(t - 60, -0.0755148492));
  const b = t >= 66 ? 255 : t <= 19 ? 0 : c(138.5177312231 * Math.log(t - 10) - 305.0447927307);
  return [r, g, b];
}

/** Per-channel multipliers for light of sceneK photographed with white balance wbK. */
export function colorCast(sceneK: number, wbK: number): [number, number, number] {
  const a = kelvinToRgb(sceneK);
  const b = kelvinToRgb(wbK);
  const m = [0, 1, 2].map((i) => (a[i] + 1) / (b[i] + 1));
  const lum = 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  return [m[0] / lum, m[1] / lum, m[2] / lum];
}

// ── Video
export const VIDEO_SYSTEMS = {
  PAL: { mainsHz: 50, fps: [25, 50, 100], shutters: [1 / 25, 1 / 50, 1 / 100, 1 / 200, 1 / 400, 1 / 800, 1 / 1600, 1 / 3200, 1 / 6400] },
  NTSC: { mainsHz: 60, fps: [24, 30, 60, 120], shutters: [1 / 24, 1 / 30, 1 / 48, 1 / 60, 1 / 120, 1 / 250, 1 / 500, 1 / 1000, 1 / 2000, 1 / 4000, 1 / 8000] },
} as const;
export type VideoSystem = keyof typeof VIDEO_SYSTEMS;

export function videoShutters(sys: VideoSystem, fps: number) {
  return VIDEO_SYSTEMS[sys].shutters.filter((t) => t <= 1 / fps + 1e-9);
}

/** Shutter closest to the 180° rule (1 / (2 × fps)) for this system. */
export function shutter180(sys: VideoSystem, fps: number) {
  const target = 1 / (2 * fps);
  const list = videoShutters(sys, fps);
  return list.reduce((best, t) =>
    Math.abs(Math.log2(t / target)) < Math.abs(Math.log2(best / target)) ? t : best
  );
}

/** True when the shutter is a multiple of the light's flicker period. */
export function isFlickerSafe(shutter: number, mainsHz: number) {
  const n = shutter * 2 * mainsHz;
  return n >= 0.98 && Math.abs(n - Math.round(n)) < 0.03;
}

export const AUTO_ISO_MIN = 100;
export const AUTO_ISO_MAX = 25600;

export function autoIso(sceneEV: number, aperture: number, shutter: number, minIso = AUTO_ISO_MIN) {
  const exact = 100 * Math.pow(2, cameraEV(aperture, shutter, 100) - sceneEV);
  const iso = Math.min(AUTO_ISO_MAX, Math.max(minIso, exact));
  // round to nearest 1/3 stop for display
  const stops = Math.round(Math.log2(iso / 100) * 3) / 3;
  return { iso, display: Math.round((100 * Math.pow(2, stops)) / 10) * 10, atLimit: iso !== exact };
}

// ── Filters
export const ND_FILTERS: { id: string; label: string; stops: number }[] = [
  { id: "none", label: "", stops: 0 },
  { id: "ND2", label: "ND2", stops: 1 },
  { id: "ND4", label: "ND4", stops: 2 },
  { id: "ND8", label: "ND8", stops: 3 },
  { id: "ND16", label: "ND16", stops: 4 },
  { id: "ND32", label: "ND32", stops: 5 },
  { id: "ND64", label: "ND64", stops: 6 },
  { id: "ND128", label: "ND128", stops: 7 },
  { id: "ND256", label: "ND256", stops: 8 },
  { id: "ND400", label: "ND400", stops: 8.6 },
  { id: "ND500", label: "ND500", stops: 9 },
  { id: "ND1000", label: "ND1000", stops: 10 },
  { id: "ND2000", label: "ND2000", stops: 11 },
  { id: "ND4000", label: "ND4000", stops: 12 },
  { id: "ND32000", label: "ND32000", stops: 15 },
  { id: "ND64000", label: "ND64000", stops: 16 },
  { id: "vnd", label: "VND", stops: 0 },
];
export const CPL_LOSS = 1.5; // stops

/** Smallest fixed ND that removes at least `stops` of light (or the strongest one). */
export function pickNd(stops: number) {
  const fixed = ND_FILTERS.filter((n) => n.id !== "vnd" && n.id !== "none");
  if (stops <= 0.15) return ND_FILTERS[0];
  return fixed.find((n) => n.stops >= stops - 0.15) ?? fixed[fixed.length - 1];
}

export function nearestIso(target: number, minIso = 100) {
  const list = [...new Set([minIso, ...ISOS.filter((v) => v >= minIso)])];
  return list.reduce((best, v) =>
    Math.abs(Math.log2(v / target)) < Math.abs(Math.log2(best / target)) ? v : best
  );
}
