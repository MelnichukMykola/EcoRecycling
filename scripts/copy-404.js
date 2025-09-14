import { copyFile } from "node:fs/promises";

try {
  await copyFile("dist/index.html", "dist/404.html");
  console.log("SPA fallback: 404.html utworzony.");
} catch (e) {
  console.error("Nie udało się utworzyć 404.html:", e);
  process.exit(1);
}
