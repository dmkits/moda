#!/bin/bash
cd "$(dirname "$(readlink -fn "$0")")"
node app.js -p:8080
