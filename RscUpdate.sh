#!/bin/bash
e=~/Dropbox/Projects/EssenceJS/1.1
cd rsc
cp -f $e/essence.js essence.js
cp -f $e/essence.min.js essence.min.js
cp -f $e/essence.css essence.css
cp -f $e/essence.min.css essence.min.css
cp -f $e/modules modules
cd modules
rm list.md