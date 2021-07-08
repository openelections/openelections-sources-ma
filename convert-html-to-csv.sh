#!/bin/bash

HTMLDIR="2016/html"

for path in "$HTMLDIR"/*
do
  f=${path##*/}
  node tools/convert-html-to-csv.js "$HTMLDIR/$f" > "2016/csv/$f.csv"
done
