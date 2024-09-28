// ==UserScript==
// @name         MDPI Table Expander
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lumos
// @match        https://www.mdpi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdpi.com
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    const tableWrappers = document.querySelectorAll(".html-table-wrap");
    tableWrappers.forEach(tw => {
        const id = tw.querySelector("a").attributes.href.textContent;
        const tableEl = document.querySelector(id + " > table");
        tableEl.classList.remove("mfp-hide");
        tw.append(tableEl);
    })
    document.querySelectorAll(".html-table_wrap_td").forEach(i => i.remove());
})();
