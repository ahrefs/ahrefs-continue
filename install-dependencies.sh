#!/bin/bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension
set -e
echo "Installing Core extension dependencies..."
pushd core
npm install
npm link
popd

echo "Installing GUI extension dependencies..."
pushd gui
npm install
npm link @continuedev/core
popd

echo "Installing VSCode extension dependencies..."
pushd extensions/vscode
# This does way too many things inline but is the common denominator between many of the scripts
npm install
npm link @continuedev/core
popd

echo "Building GUI..."
pushd gui
npm run build
popd

echo "Installing binary dependencies..."
pushd binary
npm install
npm run build


# echo "Packaging extension..."
# # VSCode Extension (will also package GUI)
# pushd extensions/vscode
# npm install vsce
# npx @vscode/vsce package  
# popd