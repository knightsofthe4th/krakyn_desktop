import {CreateProfile} from '../wailsjs/go/main/App';
import {LoadProfile} from '../wailsjs/go/main/App';

import logo from './assets/images/splash_banner.svg';

var generateForm;
var gUser;
var gKey;
var gError;

var loadForm;
var lUser;
var lKey;
var lError;

var onLoadForm = true;

window.loadForms = function() {
    generateForm = document.getElementById("generateform");
    gUser        = document.getElementById("guser");
    gKey         = document.getElementById("gkey");
    gError       = document.getElementById("gerror");

    loadForm     = document.getElementById("loadform");
    lUser        = document.getElementById("luser");
    lKey         = document.getElementById("lkey");
    lError       = document.getElementById("lerror");

    var banner   = document.getElementById("banner");
    banner.src   = logo;

    showLoadForm();
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const showLoadForm = async () => {
    await delay(1000);
    loadForm.classList.remove("hidden");
    loadForm.style.display = "none";
    loadForm.style.display = "block";
}

window.profileFormChange = function() {
    lUser.value      = "";
    lKey.value       = "";
    lError.innerText = "";

    gUser.value      = "";
    gKey.value       = "";
    gError.innerText = "";

    if (onLoadForm) {
        loadForm.style.display     = "none";
        generateForm.style.display = "block";
        onLoadForm                 = false;
    }

    else {
        loadForm.style.display     = "block";
        generateForm.style.display = "none";
        onLoadForm                 = true;
    }
};

window.submitLoad = function() {
    if (lUser.value == "" || lKey.value == "") {
        lError.innerText = "All fields are mandatory!";
        return;
    }

    try {
        LoadProfile(lUser.value, lKey.value)
            .then((result) => {
                if (result != "") {
                    lError.innerText = result;
                    return;
                } else {
                    contentChat();
                }
            });
    } catch (err) {
        console.error(err);
        return;
    }
};

window.submitGenerate = function() {
    if (gUser.value == "" || gKey.value == "") {
        gError.innerText = "All fields are mandatory!";
        return;
    }

   try {
        CreateProfile(gUser.value, gKey.value)
            .then((result) => {
                if (result != "") {
                    gError.innerText = result;
                    return;
                }
            });
    } catch (err) {
        console.error(err);
        return;
    }

    profileFormChange();
};