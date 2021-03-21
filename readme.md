# autodom

the idea here is to have the browser document object module
match the dynamic state that auto produces, i.e.

```js
var $ = auto({
    'list': ($) => [
        'item1': ($) => /* ... */
    // ...
})
```

still trying to wrap my head around whether this instinct
was right. i thought - isn't the dom just another kind of
state? and if auto let's you declaratively define how
state should be updated then wouldn't that naturally
translate to keeping the dom up to date, i.e. doesn't
that mean you can use auto as a ui library?

starting to seem incorrect but haven't clarified completely.

## jsdom

i wanted to test this quickly / iteratively from the console
(without firing up a browser i.e. selenium) and **jsdom** is
gratefully a library which lets one do just that.

```js
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
```

gorgeous: this is what we get:

```
C:\Users\karlp\autodom>node test.js
booting jsdom
running script.js
<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>

    <body>
        <div id="root">
            <h1 title="foo">Hello</h1>
        </div>
        <script src="script.js"></script>
    </body>

</html>

C:\Users\karlp\autodom>
```

here is `index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title></title>
  </head>
  <body>
    <div id='root'></div>
    <script src='script.js'></script>
  </body>
</html>
```

and here is `script.js`:

```js
console.log('running script.js');

// https://pomb.us/build-your-own-react/

const container_id = 'root'
const container = document.getElementById(container_id)

if (!container) console.trace("container with id '"+container_id+"' not found")
else
{
    const node = document.createElement('h1');
    node['title'] = 'foo';

    const text = document.createTextNode('');
    text['nodeValue'] = 'Hello';

    node.appendChild(text)
    container.appendChild(node)
}
```

