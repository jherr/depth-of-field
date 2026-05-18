import test from "node:test";
import assert from "node:assert/strict";
import { buildNativeSelectStyles } from "./selectStyles";

test("dark-mode select styles keep a stable dark background across interaction states", () => {
  const styles = buildNativeSelectStyles("dark");

  assert.equal(styles.bg, "gray.700");
  assert.equal(styles._hover.bg, styles.bg);
  assert.equal(styles._focus.bg, styles.bg);
  assert.equal(styles._active.bg, styles.bg);
  assert.equal(styles.sx.colorScheme, "dark");
  assert.equal(
    styles.sx["& > option"].background,
    "var(--chakra-colors-gray-700)"
  );
});
