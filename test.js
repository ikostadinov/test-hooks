#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const configVersionFile = './config_version.json';
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\n/, '');

const generateVersion = () => {
    return new Date().toISOString().split(".")[0].replace(/\D/g,'')
};

const setVersion = () => {
    fs.writeFileSync(configVersionFile, JSON.stringify({version: generateVersion()}));
};


if (currentBranch === "master") {
    try {
        setVersion()
    } catch (e) {
        console.log("ERROR: ", e)
    }
}