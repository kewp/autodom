/*
console.log('importing jsdom');
const { JSDOM } = require("jsdom");
JSDOM.env({
    html: "<html><body></body></html>",
    documentRoot: __dirname + '/js',
    scripts: [
        'index.js'
    ]
}, function (err, window) {
    console.log(window.loadFromJSDOM);
}
);
*/

'use strict';
console.info('booting jsdom');

const { JSDOM } = require('jsdom');

const options = {
  resources: 'usable',
  runScripts: 'dangerously',
};

JSDOM.fromFile('index.html', options).then( (dom) => {

    dom.window.document.addEventListener('DOMContentLoaded', () => {

        var html = require("html");
        console.log(html.prettyPrint(dom.serialize()));
    });
});


/*
const dom = new JSDOM(`<body>
<script>document.body.appendChild(document.createElement("hr"));</script>
</body>`);
//console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
var html = require("html");
console.log(html.prettyPrint(dom.serialize()))
*/