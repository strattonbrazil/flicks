"use strict";

const fs = require('fs');
const pathExists = require('path-exists');
const gm = require('gm');
const path = require('path');
const sync = require('synchronize');

if (process.argv.length < 3)    {
    console.error("usage: nodejs watermark.js TARGETDIR");
    process.exit(1);
}

var targetDir = process.argv[2];

if (!pathExists.sync(targetDir))   {
    console.error("not a directory");
    process.exit(1);
}

let files = fs.readdirSync(targetDir);
for (let i in files)    {
    let file = files[i];
    sync.fiber(function() {
        let targetImage = path.join(targetDir, file);
        console.log("adding watermark" + file);
        sync.await(gm().command("composite").in("-gravity", "center").in(targetImage).in('./misc/watermark.png').write(targetImage, sync.defer()));
    });
}
