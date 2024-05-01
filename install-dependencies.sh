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
