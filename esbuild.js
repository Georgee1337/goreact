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
        system: "\x1b[38;5;15;48;5;240m",
        reset: "\x1b[0m",
    };
    console.log(`${colors[type]} ${message} ${colors.reset}`);
}

function cleanOutput() {
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
        logMessage("system", `Cleaned output directory: ${BUILD_DIR}`);
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
                        plugins: [require("autoprefixer")],
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
        });
}

let debounceTimeout;
const watchPath = path.resolve(__dirname, "./react/");
const baseDir = path.resolve(__dirname);

chokidar
    .watch([watchPath], {
        ignoreInitial: true,
        usePolling: true,
        interval: 100,
    })
    .on("all", (event, filePath) => {
        const relativePath = path.relative(baseDir, filePath);
        logMessage("system", `Detected ${event} on \"${relativePath}\"`);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            cleanOutput();
            build();
        }, 100);
    });

cleanOutput();
build();
