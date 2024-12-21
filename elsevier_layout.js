// ==UserScript==
// @name         Modify Elsevier Article Layout
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify layout of Elsevier articles by removing specific elements, adjusting class names, and justifying text
// @author       Ye Li
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencedirect.com
// @match        https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 定义修改函数
    function modifyPage() {
        // 删除指定的元素
        const elementToRemove = document.querySelector('#mathjax-container > div.article-wrapper.grid.row > div.u-display-block-from-md.col-lg-6.col-md-8.pad-right.u-padding-s-top');
        if (elementToRemove) {
            elementToRemove.remove();
        }

        // 修改 #mathjax-container > div.article-wrapper.grid.row > article 的类名
        const articleElement = document.querySelector("#mathjax-container > div.article-wrapper.grid.row > article");
        if (articleElement) {
            articleElement.classList.forEach(className => {
                if (className.startsWith('col-lg-')) {
                    const newClassName = className.replace(/col-lg-\d+/, 'col-lg-18');
                    articleElement.classList.replace(className, newClassName);
                }
            });
        }

        // 设置所有 class 为 "u-margin-s-bottom" 的 div 文本两端对齐
        const divs = document.querySelectorAll('div.u-margin-s-bottom');
        divs.forEach(div => {
            div.style.textAlign = 'justify';
        });

        // 获取所有 <figure> 元素
        const figureElements = document.querySelectorAll('figure');

        // 遍历每个 <figure> 元素
        figureElements.forEach(figure => {
            // 确保包含图片的 <figure> 元素居中
            figure.style.textAlign = 'center';

            // 获取 <figure> 内的图片
            const img = figure.querySelector('img');
            if (img) {
                // 确保图片本身居中
                img.style.display = 'block';
                img.style.margin = '0 auto';
            }
        });

        // 获取所有 class="display" 的元素
        const displayElements = document.querySelectorAll('.display');

        // 遍历每个 display 元素
        displayElements.forEach(displayElement => {
            // 在 display 元素中查找所有 class="math" 的子元素
            const mathElements = displayElement.querySelectorAll('.math');

            // 遍历所有 math 元素并应用居中样式
            mathElements.forEach(mathElement => {
                mathElement.style.display = 'flex';
                mathElement.style.justifyContent = 'center';
                mathElement.style.alignItems = 'center';
                mathElement.style.textAlign = 'center';
            });
        });

    }

    // 初次运行修改函数
    modifyPage();

    // 创建 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        modifyPage();
    });

    // 开始监听整个文档的 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });
})();
