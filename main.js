"use strict";

var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
var pathExists = require('path-exists');
var http = require('http');
var url = require('url');
const path = require('path');
const im = require('imagemagick');
const gm = require('gm');
const sync = require('synchronize');

const DEV_IMAGE_PORT = 9011;

// make sure files/directories configured correctly
//
var moviesManifest = process.env.MOVIES_MANIFEST;
if (moviesManifest === undefined) {
    console.log("MOVIES_MANIFEST not specified, defaulting to ./movies/metadata.json");
    moviesManifest = "./metadata/movies.json";
}
if (!pathExists.sync(moviesManifest)) {
    console.error("unable to find movie manifest: " + moviesManifest);
    process.exit(1);
}

var picsDir = process.env.PICS_DIR;
if (picsDir === undefined) {
    console.error("no PICS_DIR specified, exiting...");
    process.exit(1);
}
if (!pathExists.sync(picsDir)) {
    console.error("unable find to pic dir: "  + picsDir)
    process.exit(1);
}

// process movies (create preview images)
//
var contents = fs.readFileSync(moviesManifest, 'utf8');
var movieMetadata = JSON.parse(contents);
var movieByEncodedTitle = {}
for (var i = 0; i < movieMetadata.movies.length; i++) {
    let movie = movieMetadata.movies[i];
    movieByEncodedTitle[movie["title_encoded"]] = movie;

    let movieDir = path.join(picsDir, movie['title_encoded'], "hq")    
    let moviePreviewDir = path.join(picsDir, movie['title_encoded'], "preview");
    if (!pathExists.sync(moviePreviewDir)) {
        console.log("creating previews for '" + movie['title_encoded']);
        fs.mkdir(moviePreviewDir);
    }
    let movieThumbnailDir = path.join(picsDir, movie['title_encoded'], "thumbnail");
    if (!pathExists.sync(movieThumbnailDir)) {
        console.log("creating thumbnails for '" + movie['title_encoded']);
        fs.mkdir(movieThumbnailDir);
    }
    
    if (!pathExists.sync(movieDir)) {
        console.warn("unable to find pic for for '" + movie['title_encoded'] + "', skipping");
        continue;
    }    
    let files = fs.readdirSync(movieDir);
    movie['previewPaths'] = [];
    movie['thumbnailPaths'] = [];
    for (let i in files) {
        let file = files[i];
        let picPath = path.join(movieDir, file);
        let previewPath = path.join(moviePreviewDir, file);
        previewPath = previewPath.replace(".png", ".jpg");
        let thumbnailPath = path.join(movieThumbnailDir, file);
        thumbnailPath = thumbnailPath.replace(".png", ".jpg");
        
        // create the preview if not present
        if (!pathExists.sync(previewPath)) {
            sync.fiber(function() {
                console.log("creating preview image: " + previewPath);
                sync.await(gm(picPath).resize(900, 508).write(previewPath, sync.defer()));
            });
        }

        // create the thumbnail if not present
        if (!pathExists.sync(thumbnailPath)) {
            sync.fiber(function() {
                console.log("creating thumbnail image: " + thumbnailPath);
                sync.await(gm(picPath).resize(200, 92).write(thumbnailPath, sync.defer()));
            });
        }

        let relativePreviewPath = path.relative(picsDir, previewPath);
        movie['previewPaths'].push(relativePreviewPath);
        let relativeThumbnailPath = path.relative(picsDir, thumbnailPath);
        movie['thumbnailPaths'].push(relativeThumbnailPath);
    }
}

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.get('/', function (req, res) {
    res.render('index', {
        movies: movieMetadata.movies
    });
});

app.get('/m/:movie', function (req, res) {
    let movie = req.params.movie;
    if (movie in movieByEncodedTitle) {
        var cdnBase = "http://localhost:" + DEV_IMAGE_PORT;
        res.render('movie', {
            cdnBase: cdnBase,
            movie: movieByEncodedTitle[movie]
        });
    } else {
        res.redirect('/'); // TODO: send to error page?
    }
});

// if dev build, start http server for CND files
//

http.createServer(onRequestFile).listen(DEV_IMAGE_PORT);
function onRequestFile(req, res) {
    var uri = url.parse(req.url).pathname;

    var filePath = path.join(picsDir, uri);
    console.log(filePath);
    if (pathExists.sync(filePath)) {
        fs.readFile(filePath, "binary", function(err, file) {
            if (err) {        
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                res.end();
                return;
            }

            res.writeHead(200);
            res.write(file, "binary");
            res.end();
        });
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
    }
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
