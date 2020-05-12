#!/usr/bin/env sh

rm -rf ./dist
mkdir -p ./dist

npm run build:main
npm run build:component
npm run build:core
npm run build:dnd
npm run build:utils
npm run build:mathf
