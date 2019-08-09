#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const PlayFab = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFab");
const PlayFabServer = require("./node_modules/playfab-sdk/Scripts/PlayFab/PlayFabServer");
const configVersionFile = './config_version.json';

const title =    {
    id: "35511", // testing title 1
    key: "9Q3AN15K3Q53QAFJ34MZRRE7YKHS6OX3SXJGMHQC4QAC71PWQN"
};

const actions = ["GetTitleInternalData", "SetTitleInternalData"];
const [GetTitleInternalData, SetTitleInternalData] = actions;

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\n/, '');

const setTitleKey = () => {
    PlayFab.settings.titleId = title.id;
    PlayFab.settings.developerSecretKey = title.key;
};

const callBack = (resolve, reject, err, res) => {
    if (err) return reject(err);

    return resolve(res.data)
};

const sendRequest = (action, request) =>
    new Promise((resolve, reject) => {
        PlayFabServer[action](request,
            (err, res) => callBack(resolve, reject, err, res))
    });

const generateVersion = () => {
    return new Date().toISOString().split(".")[0].replace(/\D/g,'')
};

const setVersion = (version) => {
    fs.writeFileSync(configVersionFile, JSON.stringify({version}));
};

const setTitleInternalData = async () => {
    const version = generateVersion();
    setVersion(version);
    const request = {
        Key: "config_version",
        Value: version
    };
    await sendRequest(SetTitleInternalData, request);
    console.log(`Version updated to ${version}`)
};

if (currentBranch === "master") {
    try {
        setTitleKey();
        setTitleInternalData();
    } catch (e) {
        console.log("ERROR: ", e)
    }
}