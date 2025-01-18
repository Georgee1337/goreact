const esbuild = require("esbuild");
const postCssPlugin = require("esbuild-style-plugin");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");

const BUILD_DIR = "assets/webpack/public/bundle";

function logMessage(type, message) {
  const colors = {
    info: "\x1b[38;5;15;48;2;0;97;255m",
    success: "\x1b[38;5;0;48;2;0;255;135m",
    error: "\x1b[38;5;15;48;2;244;7;82m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[type]} ${message} ${colors.reset}`);
}

function cleanOutput() {
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    logMessage("info", `Cleaned output directory: ${BUILD_DIR}`);
  }
}

function build() {
  const start = Date.now();
  logMessage("info", "🚀 Building with esbuild...");

  esbuild
    .build({
      entryPoints: ["react/Application.tsx", "react/styles.css"],
      outdir: BUILD_DIR,
      bundle: true,
      minify: true,
      splitting: true,
      format: "esm",
      loader: {
        ".woff": "file",
        ".woff2": "file",
        ".ttf": "file",
        ".otf": "file",
      },
      plugins: [
        postCssPlugin({
          postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
          },
        }),
      ],
    })
    .then(() => {
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      logMessage("success", `⚡ Build complete! Took ${duration} seconds.`);
    })
    .catch((err) => {
      logMessage("error", `❌ Build failed! Error: ${err}`);
      process.exit(1);
    });
}

chokidar
  .watch(["react/**/*.{tsx,css}"], { ignoreInitial: true })
  .on("all", (event, path) => {
    logMessage("info", `File ${event}: ${path}`);
    cleanOutput();
    build();
  });

cleanOutput();
build();
