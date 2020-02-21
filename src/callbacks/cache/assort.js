"use strict";

function cache() {
    if (!settings.server.rebuildCache) {
        return;
    }

    for (let trader in db.traders) {
        logger.logInfo("Caching: assort_" + trader + ".json");

        let base = json.parse(json.read("db/cache/assort.json"));
        let inputNode = db.assort[trader];
        let inputDir = [
            "items",
            "barter_scheme",
            "loyal_level_items"
        ];

        for (let path in inputDir) {
            let inputFiles = inputNode[inputDir[path]];
            let inputNames = Object.keys(inputFiles);
            let i = 0;

            for (let file in inputFiles) {
                let filePath = inputFiles[file];
                let fileName = inputNames[i++];
                let fileData = json.parse(json.read(filePath));

                if (path == 0) {
                    base.data.items.push(fileData);
                } else if (path == 1) {
                    base.data.barter_scheme[fileName] = fileData;
                } else if (path == 2) {
                    base.data.loyal_level_items[fileName] = fileData;
                }
            }
        }

        base.crc = utility.adlerGen(json.stringify(base.data));
        json.write("user/cache/assort_" + trader + ".json", base);
    }
}

server.addStartCallback("cacheAssort", cache);