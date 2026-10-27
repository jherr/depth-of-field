# Depth Of Field Simulator

A web application that allows you to figure out the depth of field of a camera lens. You can adjust the aperture, focal length, and distance to the subject to see how the depth of field changes. The application also shows the hyperfocal distance and the near and far limits of the depth of field. [Live Demo](https://jherr.github.io/depth-of-field/)

Built with React, TypeScript, Vite, and Chakra UI.

## Features

- Live DoF diagram with a draggable subject
- Near focus, far focus, total DoF, and hyperfocal readouts
- Metric / Imperial units
- Preset sensor sizes (webcam → medium format) plus a **Custom** sensor option
- 35mm-equivalent focal length for cropped sensors
- Diffraction warning when the aperture is small enough to soften the image
- Quick presets for common camera/lens setups
- Light and dark modes

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (bundled with Node). Yarn or pnpm work equally well.

### Install & run

```bash
npm install
npm run dev
```

Vite prints a local URL (default `http://localhost:5173`). Open it in a browser; edits hot-reload automatically.

### Build for production

```bash
npm run build
```

The optimized output is written to `dist/`. Preview the production build with:

```bash
npm run preview
```

### Scripts

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload   |
| `npm run build`   | Type-check (`tsc`) and build to `dist/`     |
| `npm run preview` | Serve the production build locally          |
| `npm run lint`    | Run ESLint over the `ts`/`tsx` sources      |
| `npm test`        | Run the unit tests (`tsx --test`)           |

## How the values are calculated

All optics are computed in `src/App.tsx` from four inputs — **focal length** (`f`, mm), **aperture** (`N`, the f-number), **subject distance** (`s`), and the selected **sensor** — plus a **circle of confusion** derived from that sensor. Distances are tracked internally in millimeters and converted to feet/inches or centimeters for display (`src/utils/units.ts`).

### Circle of Confusion (CoC)

The circle of confusion is the largest blur spot that still looks "in focus" to the viewer at normal viewing size. It scales with the sensor: a larger sensor tolerates a larger blur circle because the image is enlarged less to reach final viewing size.

Each preset sensor ships with a fixed CoC (in mm), e.g. 0.029 mm for 35mm full frame and 0.019 mm for APS-C. For a **Custom** sensor the CoC is estimated from the sensor diagonal:

```
CoC = √(width² + height²) / 1500
```

This is the common "diagonal ÷ 1500" rule of thumb (the full-frame diagonal of ~43.3 mm gives ~0.029 mm, matching the full-frame preset).

### Crop factor and 35mm-equivalent focal length

The crop factor compares a sensor's diagonal to the 35mm full-frame diagonal (≈ 43.27 mm). For a custom sensor:

```
cropFactor = 43.27 / √(width² + height²)
```

Preset sensors carry their own crop factor. The 35mm-equivalent focal length (shown for non-full-frame sensors) is simply:

```
equivalentFocalLength = focalLength × cropFactor
```

### Hyperfocal distance

The hyperfocal distance `H` is the focus distance at which everything from half that distance out to infinity is acceptably sharp. It is computed as:

```
H = f + f² / (N × CoC)
```

where `f` is focal length, `N` is the f-number (aperture), and `CoC` is the circle of confusion — all in millimeters.

### Depth of field (near and far limits)

Given the hyperfocal distance `H`, the subject distance `s`, and focal length `f`, the near and far sharp limits are:

```
near = (H × s) / (H + (s − f))
far  = (H × s) / (H − (s − f))
```

- **Total DoF** = `far − near`.
- When the far limit exceeds the scene range (or goes non-positive because the denominator crosses zero), it is treated as **infinity (∞)** — this happens once the subject is at or beyond the hyperfocal distance.
- Values are clamped to the diagram's range so the visualization stays sane.

The **Set Hyperfocal** button focuses the subject exactly at `H`, the setting that maximizes depth of field for the current lens and aperture.

### Vertical field of view

The vertical angle of view comes from the sensor height and focal length:

```
FoV = 2 × atan( sensorHeight / (2 × f) )   // converted to degrees
```

This drives how wide the cone is drawn in the scene diagram.

### Diffraction limit

Stopping the aperture down (large f-number) eventually softens the image because the Airy diffraction disk grows larger than the circle of confusion. The Airy disk diameter is approximated as `0.001342 × N` mm, so the aperture at which diffraction begins to matter is:

```
diffractionLimitFStop = CoC / 0.001342
```

Above this f-number a warning badge is shown. Because the threshold scales with CoC, smaller sensors hit diffraction at wider apertures than larger ones.

### Units

Internally everything is inches/millimeters; `src/utils/units.ts` formats the output:

- **Imperial** → feet and inches (`12 in = 1 ft`)
- **Metric** → centimeters (`1 in = 2.54 cm`)

> These formulas use the standard thin-lens depth-of-field model. They are excellent for understanding and comparing setups, but real lenses (breathing, pupil magnification, etc.) can differ slightly from the idealized math.

## Project structure

```
src/
  App.tsx                # Inputs, state, and all DoF/CoC/hyperfocal math
  PhotographyGraphic.tsx # The scene diagram (subject, focus cone, limits)
  selectStyles.ts        # Theme-aware styling for native selects
  utils/units.ts         # Imperial/metric formatting
  assets/                # Lens illustrations
```

## Contributing

Issues and pull requests are welcome at [github.com/jherr/depth-of-field](https://github.com/jherr/depth-of-field). Please run `npm run lint` and `npm test` before opening a PR.

## License

[MIT](./LICENSE.txt) © Jack Herrington
