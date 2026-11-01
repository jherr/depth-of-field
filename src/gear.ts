// Camera + lens database. Sensor keys must match CIRCLES_OF_CONFUSION in App.tsx.

export type Camera = {
  id: string;
  brand: "Panasonic" | "Sony" | "Canon" | "Nikon" | "DJI" | "Insta360";
  fixedLens?: boolean; // lens built in (drones, action & 360 cams)
  model: string;
  sensor: string;
  mounts: string[]; // lens mounts that fit, in display order
};

export type Lens = {
  id: string;
  maker: string;
  name: string;
  minFocal: number;
  maxFocal: number;
  apertureWide: number; // max aperture at minFocal
  apertureTele: number; // max aperture at maxFocal
  sensor?: string; // overrides the camera sensor (multi-camera drones)
  fixedAperture?: boolean; // aperture cannot be changed
};

const FF = "35mm (full frame)";
const APSC = "APS-C";
const APSC_CANON = "APS-C (Canon)";
const MFT = "Micro Four Thirds";
const S1IN = "1-inch";
const S11 = "1/1.1-inch";
const S13 = "1/1.3-inch";
const S15 = "1/1.5-inch";
const S12 = "1/2-inch";

export const BRANDS = ["Panasonic", "Sony", "Canon", "Nikon", "DJI", "Insta360"] as const;

export const CAMERAS: Camera[] = [
  // Panasonic
  { id: "pana-s1ii", brand: "Panasonic", model: "Lumix S1 II", sensor: FF, mounts: ["L"] },
  { id: "pana-s1rii", brand: "Panasonic", model: "Lumix S1R II", sensor: FF, mounts: ["L"] },
  { id: "pana-s1h", brand: "Panasonic", model: "Lumix S1H", sensor: FF, mounts: ["L"] },
  { id: "pana-s5ii", brand: "Panasonic", model: "Lumix S5 II", sensor: FF, mounts: ["L"] },
  { id: "pana-s5iix", brand: "Panasonic", model: "Lumix S5 IIX", sensor: FF, mounts: ["L"] },
  { id: "pana-s5", brand: "Panasonic", model: "Lumix S5", sensor: FF, mounts: ["L"] },
  { id: "pana-s9", brand: "Panasonic", model: "Lumix S9", sensor: FF, mounts: ["L"] },
  { id: "pana-gh7", brand: "Panasonic", model: "Lumix GH7", sensor: MFT, mounts: ["MFT"] },
  { id: "pana-gh6", brand: "Panasonic", model: "Lumix GH6", sensor: MFT, mounts: ["MFT"] },
  { id: "pana-g9ii", brand: "Panasonic", model: "Lumix G9 II", sensor: MFT, mounts: ["MFT"] },
  // Sony
  { id: "sony-a1ii", brand: "Sony", model: "Alpha 1 II", sensor: FF, mounts: ["E"] },
  { id: "sony-a9iii", brand: "Sony", model: "Alpha 9 III", sensor: FF, mounts: ["E"] },
  { id: "sony-a7rv", brand: "Sony", model: "Alpha 7R V", sensor: FF, mounts: ["E"] },
  { id: "sony-a7iv", brand: "Sony", model: "Alpha 7 IV", sensor: FF, mounts: ["E"] },
  { id: "sony-a7siii", brand: "Sony", model: "Alpha 7S III", sensor: FF, mounts: ["E"] },
  { id: "sony-a7cii", brand: "Sony", model: "Alpha 7C II", sensor: FF, mounts: ["E"] },
  { id: "sony-fx3", brand: "Sony", model: "FX3", sensor: FF, mounts: ["E"] },
  { id: "sony-zve1", brand: "Sony", model: "ZV-E1", sensor: FF, mounts: ["E"] },
  { id: "sony-a6700", brand: "Sony", model: "Alpha 6700", sensor: APSC, mounts: ["E-APSC", "E"] },
  { id: "sony-fx30", brand: "Sony", model: "FX30", sensor: APSC, mounts: ["E-APSC", "E"] },
  { id: "sony-zve10ii", brand: "Sony", model: "ZV-E10 II", sensor: APSC, mounts: ["E-APSC", "E"] },
  // Canon
  { id: "canon-r1", brand: "Canon", model: "EOS R1", sensor: FF, mounts: ["RF"] },
  { id: "canon-r3", brand: "Canon", model: "EOS R3", sensor: FF, mounts: ["RF"] },
  { id: "canon-r5ii", brand: "Canon", model: "EOS R5 Mark II", sensor: FF, mounts: ["RF"] },
  { id: "canon-r6ii", brand: "Canon", model: "EOS R6 Mark II", sensor: FF, mounts: ["RF"] },
  { id: "canon-r8", brand: "Canon", model: "EOS R8", sensor: FF, mounts: ["RF"] },
  { id: "canon-r7", brand: "Canon", model: "EOS R7", sensor: APSC_CANON, mounts: ["RF-S", "RF"] },
  { id: "canon-r10", brand: "Canon", model: "EOS R10", sensor: APSC_CANON, mounts: ["RF-S", "RF"] },
  { id: "canon-r50", brand: "Canon", model: "EOS R50", sensor: APSC_CANON, mounts: ["RF-S", "RF"] },
  // Nikon
  { id: "nikon-z9", brand: "Nikon", model: "Z9", sensor: FF, mounts: ["Z"] },
  { id: "nikon-z8", brand: "Nikon", model: "Z8", sensor: FF, mounts: ["Z"] },
  { id: "nikon-z6iii", brand: "Nikon", model: "Z6III", sensor: FF, mounts: ["Z"] },
  { id: "nikon-zf", brand: "Nikon", model: "Zf", sensor: FF, mounts: ["Z"] },
  { id: "nikon-z5ii", brand: "Nikon", model: "Z5II", sensor: FF, mounts: ["Z"] },
  { id: "nikon-z50ii", brand: "Nikon", model: "Z50II", sensor: APSC, mounts: ["Z-DX", "Z"] },
  { id: "nikon-zfc", brand: "Nikon", model: "Zfc", sensor: APSC, mounts: ["Z-DX", "Z"] },
  // DJI – handheld, action and 360
  { id: "dji-pocket3", brand: "DJI", model: "Osmo Pocket 3", sensor: S1IN, mounts: ["fx:dji-pocket3"], fixedLens: true },
  { id: "dji-action5", brand: "DJI", model: "Osmo Action 5 Pro", sensor: S13, mounts: ["fx:dji-action5"], fixedLens: true },
  { id: "dji-action4", brand: "DJI", model: "Osmo Action 4", sensor: S13, mounts: ["fx:dji-action4"], fixedLens: true },
  { id: "dji-nano", brand: "DJI", model: "Osmo Nano", sensor: S13, mounts: ["fx:dji-nano"], fixedLens: true },
  { id: "dji-osmo360", brand: "DJI", model: "Osmo 360", sensor: S1IN, mounts: ["fx:dji-osmo360"], fixedLens: true },
  // DJI – drones
  { id: "dji-avata360", brand: "DJI", model: "Avata 360", sensor: S11, mounts: ["fx:dji-avata360"], fixedLens: true },
  { id: "dji-avata2", brand: "DJI", model: "Avata 2", sensor: S13, mounts: ["fx:dji-avata2"], fixedLens: true },
  { id: "dji-neo", brand: "DJI", model: "Neo", sensor: S12, mounts: ["fx:dji-neo"], fixedLens: true },
  { id: "dji-mini4pro", brand: "DJI", model: "Mini 4 Pro", sensor: S13, mounts: ["fx:dji-mini4pro"], fixedLens: true },
  { id: "dji-mini5pro", brand: "DJI", model: "Mini 5 Pro", sensor: S1IN, mounts: ["fx:dji-mini5pro"], fixedLens: true },
  { id: "dji-air3s", brand: "DJI", model: "Air 3S", sensor: S1IN, mounts: ["fx:dji-air3s"], fixedLens: true },
  { id: "dji-mavic4pro", brand: "DJI", model: "Mavic 4 Pro", sensor: MFT, mounts: ["fx:dji-mavic4pro"], fixedLens: true },
  { id: "dji-mavic3pro", brand: "DJI", model: "Mavic 3 Pro", sensor: MFT, mounts: ["fx:dji-mavic3pro"], fixedLens: true },
  // Insta360
  { id: "insta-x6", brand: "Insta360", model: "X6", sensor: S11, mounts: ["fx:insta-x6"], fixedLens: true },
  { id: "insta-x5", brand: "Insta360", model: "X5", sensor: S13, mounts: ["fx:insta-x5"], fixedLens: true },
  { id: "insta-x4", brand: "Insta360", model: "X4", sensor: S12, mounts: ["fx:insta-x4"], fixedLens: true },
  { id: "insta-x3", brand: "Insta360", model: "X3", sensor: S12, mounts: ["fx:insta-x3"], fixedLens: true },
];

// [maker, name, minFocal, maxFocal, apertureWide, apertureTele]
type Row = [string, string, number, number, number, number?];

const RAW: Record<string, Row[]> = {
  L: [
    ["Panasonic", "Lumix S PRO 24-70mm F2.8", 24, 70, 2.8],
    ["Panasonic", "Lumix S PRO 70-200mm F2.8 O.I.S.", 70, 200, 2.8],
    ["Panasonic", "Lumix S PRO 16-35mm F4", 16, 35, 4],
    ["Panasonic", "Lumix S 24-105mm F4 Macro O.I.S.", 24, 105, 4],
    ["Panasonic", "Lumix S 20-60mm F3.5-5.6", 20, 60, 3.5, 5.6],
    ["Panasonic", "Lumix S 14-28mm F4-5.6 Macro", 14, 28, 4, 5.6],
    ["Panasonic", "Lumix S 18-40mm F4.5-6.3", 18, 40, 4.5, 6.3],
    ["Panasonic", "Lumix S 28-200mm F4-7.1 Macro O.I.S.", 28, 200, 4, 7.1],
    ["Panasonic", "Lumix S 70-300mm F4.5-5.6 Macro O.I.S.", 70, 300, 4.5, 5.6],
    ["Panasonic", "Lumix S PRO 50mm F1.4", 50, 50, 1.4],
    ["Panasonic", "Lumix S 18mm F1.8", 18, 18, 1.8],
    ["Panasonic", "Lumix S 24mm F1.8", 24, 24, 1.8],
    ["Panasonic", "Lumix S 35mm F1.8", 35, 35, 1.8],
    ["Panasonic", "Lumix S 50mm F1.8", 50, 50, 1.8],
    ["Panasonic", "Lumix S 85mm F1.8", 85, 85, 1.8],
    ["Panasonic", "Lumix S 100mm F2.8 Macro", 100, 100, 2.8],
    ["Sigma", "24-70mm F2.8 DG DN II Art", 24, 70, 2.8],
    ["Sigma", "28-45mm F1.8 DG DN Art", 28, 45, 1.8],
    ["Sigma", "28-70mm F2.8 DG DN Contemporary", 28, 70, 2.8],
    ["Sigma", "14-24mm F2.8 DG DN Art", 14, 24, 2.8],
    ["Sigma", "70-200mm F2.8 DG DN OS Sports", 70, 200, 2.8],
    ["Sigma", "100-400mm F5-6.3 DG DN OS Contemporary", 100, 400, 5, 6.3],
    ["Sigma", "35mm F1.4 DG DN Art", 35, 35, 1.4],
    ["Sigma", "50mm F1.2 DG DN Art", 50, 50, 1.2],
    ["Sigma", "85mm F1.4 DG DN Art", 85, 85, 1.4],
  ],
  MFT: [
    ["Panasonic", "Leica DG Vario-Elmarit 12-60mm F2.8-4", 12, 60, 2.8, 4],
    ["Panasonic", "Lumix G X Vario 12-35mm F2.8 II", 12, 35, 2.8],
    ["Panasonic", "Lumix G X Vario 35-100mm F2.8 II", 35, 100, 2.8],
    ["Panasonic", "Lumix G Vario 12-60mm F3.5-5.6", 12, 60, 3.5, 5.6],
    ["Panasonic", "Leica DG Vario-Summilux 10-25mm F1.7", 10, 25, 1.7],
    ["Panasonic", "Leica DG Vario-Elmar 100-400mm F4-6.3 II", 100, 400, 4, 6.3],
    ["Panasonic", "Leica DG Summilux 25mm F1.4 II", 25, 25, 1.4],
    ["Panasonic", "Lumix G 42.5mm F1.7", 42.5, 42.5, 1.7],
  ],
  E: [
    ["Sony", "FE 24-70mm F2.8 GM II", 24, 70, 2.8],
    ["Sony", "FE 16-35mm F2.8 GM II", 16, 35, 2.8],
    ["Sony", "FE 70-200mm F2.8 GM OSS II", 70, 200, 2.8],
    ["Sony", "FE 24-50mm F2.8 G", 24, 50, 2.8],
    ["Sony", "FE 16-25mm F2.8 G", 16, 25, 2.8],
    ["Sony", "FE 20-70mm F4 G", 20, 70, 4],
    ["Sony", "FE 24-105mm F4 G OSS", 24, 105, 4],
    ["Sony", "FE 70-200mm F4 Macro G OSS II", 70, 200, 4],
    ["Sony", "FE 28-70mm F3.5-5.6 OSS", 28, 70, 3.5, 5.6],
    ["Sony", "FE 100-400mm F4.5-5.6 GM OSS", 100, 400, 4.5, 5.6],
    ["Sony", "FE 24mm F1.4 GM", 24, 24, 1.4],
    ["Sony", "FE 35mm F1.4 GM", 35, 35, 1.4],
    ["Sony", "FE 50mm F1.2 GM", 50, 50, 1.2],
    ["Sony", "FE 50mm F1.4 GM", 50, 50, 1.4],
    ["Sony", "FE 50mm F1.8", 50, 50, 1.8],
    ["Sony", "FE 85mm F1.4 GM II", 85, 85, 1.4],
    ["Sony", "FE 90mm F2.8 Macro G OSS", 90, 90, 2.8],
    ["Sony", "FE 135mm F1.8 GM", 135, 135, 1.8],
    ["Sigma", "24-70mm F2.8 DG DN II Art", 24, 70, 2.8],
    ["Sigma", "28-45mm F1.8 DG DN Art", 28, 45, 1.8],
    ["Sigma", "28-70mm F2.8 DG DN Contemporary", 28, 70, 2.8],
    ["Sigma", "70-200mm F2.8 DG DN OS Sports", 70, 200, 2.8],
    ["Sigma", "35mm F1.4 DG DN Art", 35, 35, 1.4],
    ["Sigma", "50mm F1.2 DG DN Art", 50, 50, 1.2],
    ["Sigma", "85mm F1.4 DG DN Art", 85, 85, 1.4],
    ["Tamron", "28-75mm F/2.8 Di III VXD G2", 28, 75, 2.8],
    ["Tamron", "17-28mm F/2.8 Di III RXD", 17, 28, 2.8],
    ["Tamron", "70-180mm F/2.8 Di III VXD G2", 70, 180, 2.8],
    ["Tamron", "35-150mm F/2-2.8 Di III VXD", 35, 150, 2, 2.8],
    ["Tamron", "28-200mm F/2.8-5.6 Di III RXD", 28, 200, 2.8, 5.6],
    ["Tamron", "50-400mm F/4.5-6.3 Di III VC VXD", 50, 400, 4.5, 6.3],
  ],
  "E-APSC": [
    ["Sony", "E 16-55mm F2.8 G", 16, 55, 2.8],
    ["Sony", "E PZ 16-50mm F3.5-5.6 OSS II", 16, 50, 3.5, 5.6],
    ["Sony", "E 18-135mm F3.5-5.6 OSS", 18, 135, 3.5, 5.6],
    ["Sony", "E 70-350mm F4.5-6.3 G OSS", 70, 350, 4.5, 6.3],
    ["Sigma", "18-50mm F2.8 DC DN Contemporary", 18, 50, 2.8],
    ["Sigma", "16mm F1.4 DC DN Contemporary", 16, 16, 1.4],
    ["Sigma", "30mm F1.4 DC DN Contemporary", 30, 30, 1.4],
    ["Sigma", "56mm F1.4 DC DN Contemporary", 56, 56, 1.4],
    ["Tamron", "17-70mm F/2.8 Di III-A VC RXD", 17, 70, 2.8],
  ],
  RF: [
    ["Canon", "RF 24-70mm F2.8 L IS USM", 24, 70, 2.8],
    ["Canon", "RF 28-70mm F2 L USM", 28, 70, 2],
    ["Canon", "RF 24-105mm F2.8 L IS USM Z", 24, 105, 2.8],
    ["Canon", "RF 15-35mm F2.8 L IS USM", 15, 35, 2.8],
    ["Canon", "RF 70-200mm F2.8 L IS USM Z", 70, 200, 2.8],
    ["Canon", "RF 24-105mm F4 L IS USM", 24, 105, 4],
    ["Canon", "RF 10-20mm F4 L IS STM", 10, 20, 4],
    ["Canon", "RF 28-70mm F2.8 IS STM", 28, 70, 2.8],
    ["Canon", "RF 24-105mm F4-7.1 IS STM", 24, 105, 4, 7.1],
    ["Canon", "RF 24-240mm F4-6.3 IS USM", 24, 240, 4, 6.3],
    ["Canon", "RF 100-500mm F4.5-7.1 L IS USM", 100, 500, 4.5, 7.1],
    ["Canon", "RF 24mm F1.4 L VCM", 24, 24, 1.4],
    ["Canon", "RF 35mm F1.4 L VCM", 35, 35, 1.4],
    ["Canon", "RF 35mm F1.8 Macro IS STM", 35, 35, 1.8],
    ["Canon", "RF 50mm F1.2 L USM", 50, 50, 1.2],
    ["Canon", "RF 50mm F1.4 L VCM", 50, 50, 1.4],
    ["Canon", "RF 50mm F1.8 STM", 50, 50, 1.8],
    ["Canon", "RF 85mm F1.2 L USM", 85, 85, 1.2],
    ["Canon", "RF 85mm F2 Macro IS STM", 85, 85, 2],
    ["Canon", "RF 100mm F2.8 L Macro IS USM", 100, 100, 2.8],
    ["Canon", "RF 135mm F1.8 L IS USM", 135, 135, 1.8],
  ],
  "RF-S": [
    ["Canon", "RF-S 18-45mm F4.5-6.3 IS STM", 18, 45, 4.5, 6.3],
    ["Canon", "RF-S 18-150mm F3.5-6.3 IS STM", 18, 150, 3.5, 6.3],
    ["Canon", "RF-S 10-18mm F4.5-6.3 IS STM", 10, 18, 4.5, 6.3],
    ["Canon", "RF-S 55-210mm F5-7.1 IS STM", 55, 210, 5, 7.1],
    ["Sigma", "18-50mm F2.8 DC DN Contemporary", 18, 50, 2.8],
  ],
  Z: [
    ["Nikon", "Nikkor Z 24-70mm f/2.8 S", 24, 70, 2.8],
    ["Nikon", "Nikkor Z 14-24mm f/2.8 S", 14, 24, 2.8],
    ["Nikon", "Nikkor Z 70-200mm f/2.8 VR S", 70, 200, 2.8],
    ["Nikon", "Nikkor Z 28-75mm f/2.8", 28, 75, 2.8],
    ["Nikon", "Nikkor Z 24-70mm f/4 S", 24, 70, 4],
    ["Nikon", "Nikkor Z 24-120mm f/4 S", 24, 120, 4],
    ["Nikon", "Nikkor Z 24-200mm f/4-6.3 VR", 24, 200, 4, 6.3],
    ["Nikon", "Nikkor Z 28-400mm f/4-8 VR", 28, 400, 4, 8],
    ["Nikon", "Nikkor Z 100-400mm f/4.5-5.6 VR S", 100, 400, 4.5, 5.6],
    ["Nikon", "Nikkor Z 35mm f/1.4", 35, 35, 1.4],
    ["Nikon", "Nikkor Z 35mm f/1.8 S", 35, 35, 1.8],
    ["Nikon", "Nikkor Z 40mm f/2", 40, 40, 2],
    ["Nikon", "Nikkor Z 50mm f/1.2 S", 50, 50, 1.2],
    ["Nikon", "Nikkor Z 50mm f/1.8 S", 50, 50, 1.8],
    ["Nikon", "Nikkor Z 85mm f/1.2 S", 85, 85, 1.2],
    ["Nikon", "Nikkor Z 85mm f/1.8 S", 85, 85, 1.8],
    ["Nikon", "Nikkor Z MC 105mm f/2.8 VR S", 105, 105, 2.8],
    ["Nikon", "Nikkor Z 135mm f/1.8 S Plena", 135, 135, 1.8],
    ["Tamron", "28-75mm F/2.8 Di III VXD G2", 28, 75, 2.8],
    ["Tamron", "35-150mm F/2-2.8 Di III VXD", 35, 150, 2, 2.8],
    ["Tamron", "70-180mm F/2.8 Di III VXD G2", 70, 180, 2.8],
  ],
  "Z-DX": [
    ["Nikon", "Nikkor Z DX 16-50mm f/3.5-6.3 VR", 16, 50, 3.5, 6.3],
    ["Nikon", "Nikkor Z DX 18-140mm f/3.5-6.3 VR", 18, 140, 3.5, 6.3],
    ["Nikon", "Nikkor Z DX 50-250mm f/4.5-6.3 VR", 50, 250, 4.5, 6.3],
    ["Nikon", "Nikkor Z DX 12-28mm f/3.5-5.6 PZ VR", 12, 28, 3.5, 5.6],
    ["Nikon", "Nikkor Z DX 24mm f/1.7", 24, 24, 1.7],
    ["Sigma", "18-50mm F2.8 DC DN Contemporary", 18, 50, 2.8],
  ],
};

export const LENSES_BY_MOUNT: Record<string, Lens[]> = Object.fromEntries(
  Object.entries(RAW).map(([mount, rows]) => [
    mount,
    rows.map(([maker, name, minFocal, maxFocal, wide, tele]) => ({
      id: `${mount}:${maker}:${name}`,
      maker,
      name,
      minFocal,
      maxFocal,
      apertureWide: wide,
      apertureTele: tele ?? wide,
    })),
  ])
);

// Built-in lenses. Focal lengths are the real ones (35mm equivalent ÷ crop factor).
const CROP: Record<string, number> = {
  [S1IN]: 2.7, [S11]: 3.0, [S13]: 3.6, [S15]: 4.0, [S12]: 5.4, [MFT]: 2.0,
};
type FixedRow = [string, string, number, number, string, boolean];
const FIXED: Record<string, FixedRow[]> = {
  "dji-pocket3": [["DJI", "20mm eq. f/2.0", 20, 2.0, S1IN, true]],
  "dji-action5": [["DJI", "155° (~12mm eq.) f/2.8", 12, 2.8, S13, true]],
  "dji-action4": [["DJI", "155° (~12mm eq.) f/2.8", 12, 2.8, S13, true]],
  "dji-nano": [["DJI", "143° (~14mm eq.) f/2.8", 14, 2.8, S13, true]],
  "dji-osmo360": [["DJI", "360° (~8mm eq.) f/1.9", 7.8, 1.9, S1IN, true]],
  "dji-avata360": [["DJI", "360° (~8mm eq.) f/1.9", 7.8, 1.9, S11, true]],
  "dji-avata2": [["DJI", "155° (~12mm eq.) f/2.8", 12, 2.8, S13, true]],
  "dji-neo": [["DJI", "117° (~15mm eq.) f/2.8", 15, 2.8, S12, true]],
  "dji-mini4pro": [["DJI", "24mm eq. f/1.7", 24, 1.7, S13, true]],
  "dji-mini5pro": [["DJI", "24mm eq. f/1.8", 24, 1.8, S1IN, true]],
  "dji-air3s": [
    ["DJI", "Wide 24mm eq. f/1.8 (1\")", 24, 1.8, S1IN, true],
    ["DJI", "Medium tele 70mm eq. f/2.8 (1/1.3\")", 70, 2.8, S13, true],
  ],
  "dji-mavic4pro": [
    ["Hasselblad", "28mm eq. f/2.0–11 (4/3)", 28, 2.0, MFT, false],
    ["DJI", "Medium tele 70mm eq. f/2.8 (1/1.3\")", 70, 2.8, S13, true],
    ["DJI", "Tele 168mm eq. f/2.8 (1/1.5\")", 168, 2.8, S15, true],
  ],
  "dji-mavic3pro": [
    ["Hasselblad", "24mm eq. f/2.8–11 (4/3)", 24, 2.8, MFT, false],
    ["DJI", "Medium tele 70mm eq. f/2.8 (1/1.3\")", 70, 2.8, S13, true],
    ["DJI", "Tele 166mm eq. f/3.4 (1/2\")", 166, 3.4, S12, true],
  ],
  "insta-x6": [["Insta360", "360° (~7.8mm eq.) f/2.0", 7.78, 2.0, S11, true]],
  "insta-x5": [["Insta360", "360° (~6.7mm eq.) f/2.0", 6.7, 2.0, S13, true]],
  "insta-x4": [["Insta360", "360° (~6.7mm eq.) f/1.9", 6.7, 1.9, S12, true]],
  "insta-x3": [["Insta360", "360° (~6.7mm eq.) f/1.9", 6.7, 1.9, S12, true]],
};
for (const [camId, rows] of Object.entries(FIXED)) {
  LENSES_BY_MOUNT[`fx:${camId}`] = rows.map(([maker, name, eq, ap, sensor, fixedAp]) => {
    const f = Math.round((eq / CROP[sensor]) * 10) / 10;
    return {
      id: `fx:${camId}:${name}`,
      maker,
      name,
      minFocal: f,
      maxFocal: f,
      apertureWide: ap,
      apertureTele: ap,
      sensor,
      fixedAperture: fixedAp,
    };
  });
}

export function lensesForCamera(cam: Camera | undefined): Lens[] {
  if (!cam) return [];
  return cam.mounts.flatMap((m) => LENSES_BY_MOUNT[m] ?? []);
}

/** Widest aperture a lens allows at a given focal length (linear between ends). */
export function maxApertureAt(lens: Lens, focal: number) {
  if (lens.maxFocal === lens.minFocal) return lens.apertureWide;
  const t = (focal - lens.minFocal) / (lens.maxFocal - lens.minFocal);
  const v = lens.apertureWide + (lens.apertureTele - lens.apertureWide) * Math.min(Math.max(t, 0), 1);
  return Math.round(v * 10) / 10;
}

// ── Log picture profiles (minimum ISO values are typical, approximate)
export type LogProfile = { id: string; name: string; minIso: number };

export function logProfilesFor(cam: Camera | undefined): LogProfile[] {
  const lp = (name: string, minIso: number): LogProfile => ({ id: name, name, minIso });
  if (!cam) return [lp("Log", 400)];
  switch (cam.brand) {
    case "Panasonic":
      return [lp("V-Log", cam.sensor === MFT ? 500 : 640)];
    case "Sony": {
      const low = ["sony-fx3", "sony-a7siii", "sony-fx30", "sony-zve1"].includes(cam.id) ? 640 : 800;
      return [lp("S-Log3", low), lp("S-Log2", low)];
    }
    case "Canon":
      return ["canon-r5ii", "canon-r1"].includes(cam.id)
        ? [lp("C-Log3", 800), lp("C-Log2", 800)]
        : [lp("C-Log3", 800)];
    case "Nikon":
      return cam.id === "nikon-zfc" ? [] : [lp("N-Log", 800)];
    case "DJI":
      if (cam.id === "dji-neo") return [];
      if (cam.id === "dji-mavic4pro" || cam.id === "dji-mavic3pro")
        return [lp("D-Log", 100), lp("D-Log M", 100)];
      return [lp("D-Log M", 100)];
    case "Insta360":
      return cam.id === "insta-x3" ? [lp("Log", 100)] : [lp("I-Log", 100)];
  }
  return [];
}
