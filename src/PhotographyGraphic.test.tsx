import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import PhotographyGraphic from "./PhotographyGraphic";

test("applies an explicit fill to SVG labels so they stay visible in dark mode", () => {
  const markup = renderToStaticMarkup(
    <PhotographyGraphic
      distanceToSubjectInInches={72}
      nearFocalPointInInches={60}
      farFocalPointInInches={90}
      farDistanceInInches={360}
      subject="Human"
      focalLength={50}
      aperture={1.8}
      system="Imperial"
      verticalFieldOfView={27}
      textColor="#f7fafc"
    />
  );

  assert.match(markup, /<text[^>]*fill="#f7fafc"/i);
});

test("renders vertical distance labels with a dark clipped overlay inside the field-of-view area", () => {
  const markup = renderToStaticMarkup(
    <PhotographyGraphic
      distanceToSubjectInInches={72}
      nearFocalPointInInches={60}
      farFocalPointInInches={90}
      farDistanceInInches={360}
      subject="Human"
      focalLength={50}
      aperture={1.8}
      system="Imperial"
      verticalFieldOfView={27}
      textColor="#f7fafc"
    />
  );

  assert.match(markup, /clip-path="url\(#fov\)"/i);
  assert.match(markup, /<text[^>]*fill="#1a202c"[^>]*rotate\(-90\)/i);
  assert.match(markup, /<text[^>]*fill="#1a202c"[^>]*rotate\(90\)/i);
});
