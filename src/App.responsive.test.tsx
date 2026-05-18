import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const VITE_BIN = fileURLToPath(
  new URL("../node_modules/vite/bin/vite.js", import.meta.url)
);

async function getOpenPort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  server.close();
  await once(server, "close");

  if (!address || typeof address === "string") {
    throw new Error("Could not allocate a local test port");
  }

  return address.port;
}

async function startVite(port: number) {
  const appUrl = `http://127.0.0.1:${port}/depth-of-field/`;
  const server = spawn(
    process.execPath,
    [VITE_BIN, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(appUrl);
      if (response.ok) {
        return { server, appUrl };
      }
    } catch {
      // Keep polling until the dev server accepts connections.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  server.kill();
  throw new Error(`Vite server did not start:\n${output}`);
}

test("sensor select has enough visible width on narrow mobile screens", async () => {
  const port = await getOpenPort();
  const { server, appUrl } = await startVite(port);

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

    await page.goto(appUrl, { waitUntil: "networkidle" });

    const sensorSelect = page.getByRole("combobox").first();
    const width = await sensorSelect.evaluate((select) => ({
      client: select.clientWidth,
      scroll: select.scrollWidth,
    }));

    await browser.close();

    assert.ok(
      width.client >= width.scroll,
      `expected sensor select visible width ${width.client}px to fit ${width.scroll}px of content`
    );
  } finally {
    server.kill();
    await once(server, "exit").catch(() => undefined);
  }
});
