#!/bin/bash

clear

echo Sass - Linux

source="$1"

mapFiles=$(find $source/css/system -name "*.css.map")

echo "$mapFiles" | while read fileName; do
    rm -f $fileName
done

minifiedFiles=$(find $source/css/system -name "*.css")

echo "$minifiedFiles" | while read fileName; do
    rm -f $fileName
done

sass --watch $source/scss/system:$source/css/system --style compressed