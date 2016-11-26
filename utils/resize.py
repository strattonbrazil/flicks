#!/usr/bin/env python

import sys
import os
import json
import Image # python pillow library

PREVIEW_SIZE = (500, 400)

MOVIES_MANIFEST = os.getenv("MOVIES_MANIFEST")
if not MOVIES_MANIFEST:
    print("no MOVIES_MANIFEST in environment")
    sys.exit(1)


PICS_DIR = os.getenv("PICS_DIR")
if not PICS_DIR:
    print("no PICS_DIR in environment")
    sys.exit(1)

manifestFile = open(MOVIES_MANIFEST, "r")
manifest = json.load(manifestFile)

for movie in manifest["movies"]:
    moviePicPath = os.path.join(PICS_DIR, movie["title_encoded"])
    hqPicPath = os.path.join(moviePicPath, "hq")

    if os.path.exists(hqPicPath):
        previewPicPath = os.path.join(moviePicPath, "preview")
        if not os.path.exists(previewPicPath):
            print "creating preview path: " + previewPicPath
            os.makedirs(previewPicPath)

        for dirName, subdirList, fileList in os.walk(hqPicPath):
            for hqFile in fileList:
                im = Image.open(os.path.join(hqPicPath, hqFile))

                # make preview image

                im.thumbnail(PREVIEW_SIZE, Image.ANTIALIAS)
                im.save(os.path.join(previewPicPath, hqFile))
    else:
        print "hq pics not found, skipping movie: " + hqPicPath
