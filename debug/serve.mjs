import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const INDEX = fileURLToPath(new URL("./index.debug.html", import.meta.url));
const PORT = 3000;
const HOST = "0.0.0.0";

createServer(async (req, res) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache"
    });
    res.end(await readFile(INDEX));
  } catch {
    res.writeHead(500);
    res.end("index.debug.html not found");
  }
}).listen(PORT, HOST, () => {
  console.log(`serving only index.debug.html on http://${HOST}:${PORT}`);
});
