#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const PlayFab = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFab");
const PlayFabServer = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFabServer");

const title =    {
    id: "35511", // testing title 1
    key: "9Q3AN15K3Q53QAFJ34MZRRE7YKHS6OX3SXJGMHQC4QAC71PWQN"
}

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\n/, '');

console.log(currentBranch)

const version = fs.readFileSync('./version.txt', 'utf8');
console.log(version)

PlayFab.settings.titleId = title.id;
PlayFab.settings.developerSecretKey = title.key;

const getTitleData = () => {
    return new Promise((resolve, reject) => {
        PlayFabServer.GetTitleData(title.id, (err, res) => {
            if (err) return reject(err);

            return resolve(res.data.Data);
        })
    })
};

const displayTitleData = async () => {
    console.log(await getTitleData());
}



if (currentBranch === "master") {
    displayTitleData()
}