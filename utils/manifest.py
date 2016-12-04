#!/usr/bin/env python

import sys
import os
import json

#note to self PICS_DIR is /home/jared/Videos

PICS_DIR = os.getenv("PICS_DIR")
if not PICS_DIR:
    print("no PICS_DIR in environment")
    sys.exit(1)

if len(sys.argv) == 1:
    print('Argument missing!')
    print('example usage: ./manifest.py goneWithTheWind or ./manifest.py thor')
    sys.exit(1)
argument = sys.argv[1]

targetDirectory = os.path.join(PICS_DIR, argument, "hq")
if os.path.exists(targetDirectory):
    print("targetDirectory declared: " + targetDirectory)
else:
    print("Cannot locate directory or hq folder is missing")
    sys.exit(1)

manifest = {"files": []}

fileList = os.listdir(targetDirectory)
for filename in fileList:
    manifest['files'].append(filename)
manifest['files'].sort()

saveHere = os.path.join(PICS_DIR, argument, "manifest.json")
# this is just a string
with open(saveHere,"w") as foo:
    json.dump(manifest,foo)
# manifestString = json.dumps(manifest)
# foo.write(manifestString)




# f=open("/tmp/test.txt","w")
