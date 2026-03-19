#!/bin/bash

apachectl configtest
exec apachectl -DFOREGROUND
