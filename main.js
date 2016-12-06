"use strict";

var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
var pathExists = require('path-exists');
var http = require('http');
var url = require('url');
const path = require('path');
// const im = require('imagemagick');
const gm = require('gm');
const sync = require('synchronize');

const DEV_IMAGE_PORT = 9011;

app.use('/public', express.static('static'));



// make sure files/directories configured correctly
//
var moviesManifest = './metadata/movies.json';

if (moviesManifest === undefined)   {
    console.warn('moviesManifested is undefined; something has gone horribly wrong');
    process.exit(1);
}   else {
    // console.log('moviesManifest: ' + moviesManifest);
}
var picsDir = "http://stillsdb-f58.kxcdn.com/";
if (picsDir === undefined) {
    console.error("no PICS_DIR specified, exiting...");
    process.exit(1);
}   else {
    // console.log('picsDir: ' + picsDir);
}

// process movies (create preview images)
//
var contents = fs.readFileSync(moviesManifest, 'utf8');
var movieMetadata = JSON.parse(contents);

function sortByTitle(a,b)   {
    if (a.title < b.title)  {
        return -1;
    }
    if (a.title > b.title)  {
        return 1;
    }
    return 0;
}
movieMetadata.movies.sort(sortByTitle);
// so here contents is the movies.json object only once


// somewhere it's not requesting the individual paths for the image,
// it's requesting the path
var movieByEncodedTitle = {}

for (var i = 0; i < movieMetadata.movies.length; i++) {
    let movie = movieMetadata.movies[i];
    movieByEncodedTitle[movie['title_encoded']] = movie;

    let movieDir = path.join(picsDir, movie['title_encoded'], "hq")
    let moviePreviewDir = path.join(picsDir, movie['title_encoded'], "preview");
    let movieThumbnailDir = path.join(picsDir, movie['title_encoded'], "thumbnail");

    // manifest object ...
    // old code: let files = fs.readdirSync(movieDir);
    // readdirSync returns an array of filenames, so files was an array of all the files in /avatar/hq
    // so I need to let files be the files array inside the json object
    // let files = fs.readdirSync('./manifest');
    // for (var j = 0; j < files.length; j++)  {
    //     let file = path.join('./manifest' , files[j]);
    //     let fileContents = fs.readFileSync(file);
    //     let movieFiles = JSON.parse(fileContents.toString());
    //     console.log(movieFiles['files'].length);
    // }

    movie['previewPaths'] = [];
    movie['thumbnailPaths'] = [];
    movie['hqPaths'] = [];

    function numberFormatter(input)   {
        var x = "" + input;
        while (x.length < 4)    {
            x = '0' + x;
        }
        return x;
    }

    var movieFrames = movie['frameCount'];
    for (var j = 0; j < movieFrames; j++) {
        let number = j;
        let fileNumber = numberFormatter(number);
        let pngTailFile = fileNumber + ".png";
        let jpgTailFile = fileNumber + ".jpg";
        let picPath = path.join(movieDir, pngTailFile);
        let previewPath = path.join(moviePreviewDir, jpgTailFile);
        let thumbnailPath = path.join(movieThumbnailDir, jpgTailFile);

        let relativeHqPath = path.relative(picsDir, picPath);
        movie['hqPaths'].push(relativeHqPath);
        let relativePreviewPath = path.relative(picsDir, previewPath);
        movie['previewPaths'].push(relativePreviewPath);
        let relativeThumbnailPath = path.relative(picsDir, thumbnailPath);
        movie['thumbnailPaths'].push(relativeThumbnailPath);
    }
}

/*
    for (let i in files) {
        let file = files[i];
        let picPath = path.join(movieDir, file);
        let previewPath = path.join(moviePreviewDir, file);
        previewPath = previewPath.replace(".png", ".jpg");
        let thumbnailPath = path.join(movieThumbnailDir, file);
        thumbnailPath = thumbnailPath.replace(".png", ".jpg");

        let relativeHqPath = path.relative(picsDir, picPath);
        movie['hqPaths'].push(relativeHqPath);
        let relativePreviewPath = path.relative(picsDir, previewPath);
        movie['previewPaths'].push(relativePreviewPath);
        let relativeThumbnailPath = path.relative(picsDir, thumbnailPath);
        movie['thumbnailPaths'].push(relativeThumbnailPath);
    }
}
*/

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
        // var cdnBase = "http://localhost:" + DEV_IMAGE_PORT;
        var cdnBase = "http://stillsdb-f58.kxcdn.com";
        res.render('movie', {
            cdnBase: cdnBase,
            movie: movieByEncodedTitle[movie]
        });
        // console.log(movieByEncodedTitle[movie]);
    } else {
        res.redirect('/'); // TODO: send to error page?
        console.log('Redirected, movie not in movieByEncodedTitle');
    }
});

// if dev build, start http server for CND files
//

http.createServer(onRequestFile).listen(DEV_IMAGE_PORT);
function onRequestFile(req, res) {
    var uri = url.parse(req.url).pathname;
    var filePath = path.join(picsDir, uri);
    if (pathExists.sync(filePath)) {
        fs.readFile(filePath, "binary", function(err, file) {
            if (err) {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                res.end();
                return;
            }
            setTimeout(function()  {
                res.writeHead(200);
                res.write(file, "binary");
                res.end();
            }, 1000);
        });
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
    }
}

app.listen(3000, function () {
  console.log('StillsDB main.js listening on port 3000!');
});
