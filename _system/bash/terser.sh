#!/bin/bash

clear

echo Terser - Linux

source="$1/js/system"

minifiedFiles=$(find $source -name "*.min.js")

echo "$minifiedFiles" | while read fileName; do
    rm -f $fileName
done

originalFiles=$(find $source -name "*.js")

echo Count: $(echo ls -f "$originalFiles" | wc -l)

echo "$originalFiles" | while read fileName; do
    terser $fileName --compress --mangle --output $(dirname $fileName)/$(basename ${fileName%%.*}).min.js

    echo $(basename $fileName)
done