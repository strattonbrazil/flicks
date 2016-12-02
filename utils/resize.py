#!/usr/bin/env python

import sys
import os
import json
import Image, ImageDraw # python pillow library

PREVIEW_SIZE = (900, 508)
THUMBNAIL_SIZE = (200, 92)

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
    print "processing movie: " + movie["title_encoded"]

    if os.path.exists(hqPicPath):
        previewPicPath = os.path.join(moviePicPath, "preview")
        thumbnailPicPath = os.path.join(moviePicPath, "thumbnail")

        if not os.path.exists(previewPicPath):
            print "creating preview path: " + previewPicPath
            os.makedirs(previewPicPath)

        if not os.path.exists(thumbnailPicPath):
            print "creating thumbnail path: " + thumbnailPicPath
            os.makedirs(thumbnailPicPath)

        for dirName, subdirList, fileList in os.walk(hqPicPath):
            #TODO organize numerically
            for i, hqFile in enumerate(fileList):
                sys.stdout.write("\rProcessing %i of %i" % (i + 1, len(fileList)))
                sys.stdout.flush()
                im = Image.open(os.path.join(hqPicPath, hqFile))
                if not os.path.exists(os.path.join(previewPicPath, hqFile)):
                    im.thumbnail(PREVIEW_SIZE, Image.ANTIALIAS)
                    previewPath = os.path.join(previewPicPath, hqFile)
                    previewPath = previewPath.replace(".png",".jpg")
                    im.save(previewPath, "jpeg")
                if not os.path.exists(os.path.join(thumbnailPicPath, hqFile)):
                    im.thumbnail(THUMBNAIL_SIZE, Image.ANTIALIAS)
                    thumbnailPath = os.path.join(thumbnailPicPath, hqFile)
                    thumbnailPath = thumbnailPath.replace(".png",".jpg")
                    im.save(thumbnailPath, "jpeg")
    else:
        print "hq pics not found, skipping movie: " + hqPicPath
