import { access, readFile, mkdir, copyFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "image_8a836c98.jpg",
  "api/tiktok/login.js",
  "api/tiktok/callback.js",
  "api/tiktok/status.js",
  "api/tiktok/publish.js"
];

await Promise.all(requiredFiles.map((file) => access(file)));
const html = await readFile("index.html", "utf8");
for (const reference of ["styles.css", "script.js", "image_8a836c98.jpg"]) {
  if (!html.includes(reference)) throw new Error(`Missing HTML reference: ${reference}`);
}

await mkdir("public", { recursive: true });
for (const file of ["index.html", "styles.css", "script.js", "privacy.md", "terms.md", "image_8a836c98.jpg"]) {
  await copyFile(file, `public/${file}`);
}

console.log(`Build check passed: ${requiredFiles.length} required files verified.`);
