// ==UserScript==
// @name         Springer Table Expander
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动显示 Springer 文章页面中的表格
// @author       Ye Li
// @match        https://link.springer.com/article/*
// @match        https://link.springer.com/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=springer.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let tableDivs = document.querySelectorAll('div.c-article-table[data-test="inline-table"]');
    tableDivs.forEach(tableDiv => {

        let tableLink = tableDiv.querySelector('a[data-test="table-link"]');
        if (tableLink) {
            let tableUrl = tableLink.getAttribute('href');

            fetch(tableUrl)
                .then(response => response.text())
                .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let tableContainer = doc.querySelector('.c-article-table-container');
                    if (tableContainer) {

                        let table = tableContainer.querySelector('table');
                        console.log(table);
                        if (table) {
                            let targetElement = tableDiv.querySelector('.u-text-right.u-hide-print');
                            if (targetElement) {
                                targetElement.innerHTML = '';
                                targetElement.appendChild(table);
                            }
                        }
                    }
                })
                .catch(error => console.error('Error fetching table:', error));
        }
    });
})();
