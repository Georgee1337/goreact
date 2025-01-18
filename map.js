const fs = require("fs");
const path = require("path");

//debug of chokidar.watch

function getDirectoryMap(dirPath, depth = 0) {
    const stats = fs.statSync(dirPath);

    if (!stats.isDirectory()) {
        return path.basename(dirPath);
    }

    const items = fs.readdirSync(dirPath);
    const map = {};

    items.forEach((item) => {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            map[item] = getDirectoryMap(fullPath, depth + 1);
        } else {
            map[item] = "file";
        }
    });

    return map;
}

const rootDir = path.resolve(__dirname, "./react");
const directoryMap = getDirectoryMap(rootDir);

fs.writeFileSync(
    path.join(__dirname, "map.json"),
    JSON.stringify(directoryMap, null, 2)
);
