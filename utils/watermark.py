#!/usr/bin/env python

import sys
import os
import json
import Image, ImageDraw # python pillow library

#note to self PICS_DIR is /home/jared/Videos

PICS_DIR = os.getenv("PICS_DIR")
if not PICS_DIR:
    print("no PICS_DIR in environment")
    sys.exit(1)

if len(sys.argv) == 1:
    print('Argument missing!')
    print('example usage: ./watermark.py goneWithTheWind or ./watermark.py thor')
    sys.exit(1)
argument = sys.argv[1]

targetDirectory = os.path.join(PICS_DIR, argument, "hq")
if os.path.exists(targetDirectory):
    print("targetDirectory declared: " + targetDirectory)
else:
    print("Cannot locate directory or hq folder is missing")
    sys.exit(1)

watermark = Image.open('../misc/watermark.png')
offset = (1810,1045)
fileList = os.listdir(targetDirectory)
#TODO sort file list numerically
for i, filename in enumerate(fileList):
    sys.stdout.write("\rProcessing %i of %i" % (i + 1, len(fileList)))
    sys.stdout.flush()
    im = Image.open(os.path.join(targetDirectory, filename))
    im.paste(watermark, offset, mask=watermark)
    im.save(os.path.join(targetDirectory, filename))
