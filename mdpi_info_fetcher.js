// ==UserScript==
// @name         MDPI Info Fetcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch and process information from MDPI journal articles
// @author       Ye Li
// @match        https://www.mdpi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdpi.com
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    // 异步执行的主体逻辑
    async function main() {
        const journalElement = document.querySelector('#container > section > header > div.breadcrumb.row.full-row > div:nth-child(2) > a');
        if (!journalElement || !journalElement.href) {
            console.log('未找到期刊元素');
            return;
        }

        const journalLowerCase = journalElement.href.toLowerCase();

        try {
            const [apcResponse, journalResponse] = await Promise.all([
                fetch(`${journalLowerCase}/apc`).then(r => r.text()),
                fetch(journalLowerCase).then(r => r.text())
            ]);

            // 处理APC信息
            processAPC(apcResponse);

            // 处理JCR信息
            processJCR(journalResponse);
        } catch (error) {
            console.error('请求失败:', error);
        }
    }

    function processAPC(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const targetElement = doc.querySelector('#middle-column > div.middle-column__main.ul-spaced > div > p:nth-child(2) > strong');

        if (!targetElement) {
            console.log('未找到APC费用元素');
            return;
        }

        const regex = /(\d+)/;
        const matches = targetElement.innerText.match(regex);
        if (!matches) {
            console.log('未找到匹配的数字');
            return;
        }

        const money_chf = parseInt(matches[0]);
        const money_cny = parseInt(money_chf * 8.1835);
        appendToTitle(`<div style="background-color:yellow; display:inline-block; padding:5px; border-radius:10px;"><span style="color:red;">${money_chf}/${money_cny}</span></div>`);
    }

    function processJCR(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const element = doc.querySelector('#middle-column > div:nth-child(3) > div.custom-accordion-for-small-screen-content.show-for-medium-up > div > div.journal__description__content > ul > li:nth-child(3)');

        if (!element) {
            console.log('未找到JCR元素');
            return;
        }

        const regex = /JCR\s*-\s*Q\d/;
        const matches = element.textContent.match(regex);
        if (!matches) {
            console.log('未找到匹配的JCR分区');
            return;
        }

        appendToTitle(`<div style="background-color:orange; display:inline-block; padding:5px; border-radius:10px;"><span style="color:red;">${matches[0].slice(-2)}</span></div>`);
    }

    function appendToTitle(html) {
        const targetSelector = '#abstract > div.html-content__container.content__container.content__container__combined-for-large__first.bright > article > div > h1';
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) {
            console.log('论文标题元素未找到');
            return;
        }

        targetElement.innerHTML += html;
    }

    await main();
})();
