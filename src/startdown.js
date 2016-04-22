/** 
 * This file is part of Startdown.js.
 * 
 * Startdown.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Startdown.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Startdown.js. If not, see <http://www.gnu.org/licenses/>.
 * 
 * @author
 * Peter Vaszari
 * 
 * @site
 * https://github.com/petvas/startdown/ 
 * 
 */

(function (window) {       
    var document = window.document;
    if (!document) {
        throw new Error('no browser');
    }
    
    const MARKDOWN_WRAPPER_TAG_NAME = 'xmp';
    const MARKDOWNIT_OPTIONS = undefined;
    
    
    //order is matter
    const JS = {
        'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/6.0.1/markdown-it.min.js': 'sha384-D+ST5i1SJX4B4Uitw5f4NAXT/obvvY3gYeV5hRfs7vpp41HKfTn/ncrmG1VyqDOX',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js': 'sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb',
        'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js': 'sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS',
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/highlight.min.js' : 'sha384-czDlQLETRif3pMHK2GVWjfu2+EAZV0jtyoaQ0epadu0KlK+jmLEPTCeGQHIf1b7B'
    };
    
    //order not matter     
    const CSS = {
        'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css': 'sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7',
        'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap-theme.min.css': 'sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r',
        //'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/styles/default.min.css': 'sha384-zhIsEafzyQWHSoMCQ4BfT8ZlRXQyIFwAHAJn32PNdsb8n6tVysGZSLpEEIvCskw4'
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.3.0/styles/github.min.css': 'sha384-WtUWHyk39lfUpZQVgokNfSKCJaKAeD6adgLduBLrKTMUuPzFhLtL23y1guFy6lZn'
        
    };    
    
    function onLoadPromise(element) {
        return new Promise(function (resolve, reject) {
            if (element.readyState && element.readyState !== 'loading') {
                resolve(element);
                return;
            }
            element.onload = element.onreadystatechange = function () {
                if (!element.readyState || element.readyState !== 'loading') {
                    resolve(element);
                }
            };
            element.onerror = element.onabort = reject;
        });
    }
    
    function addScript(url) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.integrity = JS[url];
        head.appendChild(script);
        return onLoadPromise(script);
    }
    
    function addCss(url) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.href = url;
        link.rel ="stylesheet";
        link.async = true;
        link.crossOrigin = 'anonymous';
        link.integrity = CSS[url];
        head.appendChild(link);
        return onLoadPromise(link);
    }
    onLoadPromise(document)
    .then(function () {
        document.body.style.display = 'none';
        var promises = [];
        promises = promises.concat(Object.keys(JS).map((s)=>()=>addScript(s)).reduce((prev, f) => prev.then(f), Promise.resolve('Start'))); //magic :))) https://gist.github.com/petvas/329fca582e31921d3860
        promises = promises.concat(Object.keys(CSS).map(addCss));       
        return Promise.all(promises);
    })
    .then(function (val) {
        return markdownit();
    })
    .then(function (md) {
        
        var markdownElement = document.getElementsByTagName(MARKDOWN_WRAPPER_TAG_NAME)[0] || document.getElementsByTagName('textarea')[0];
        if (!markdownElement) {
            return;
        }
        markdownElement.style.display = 'none';
        var markdown = markdownElement.textContent ||
            markdownElement.innerText ||
            markdownElement.value;
        
        var htmlElement = document.createElement('div');
        htmlElement.id = 'content';
        htmlElement.className += 'container';
        
        htmlElement.innerHTML += md.render(markdown); 
        document.body.appendChild(htmlElement); 
    })
    .then(function () {
        hljs.initHighlightingOnLoad();
        
    })
    .then(function () {
        document.body.style.display = 'block';
    })
    .then();
}(this));