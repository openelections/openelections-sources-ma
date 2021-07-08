#!/bin/bash

cd 2016
FILES=*.pdf

for f in $FILES
do
  pdf2htmlex \
    "$f" "html/$f.html"\

  # take action on each file. $f store current file name
done
