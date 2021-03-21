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

so as per the link in `script.js` i'm building up the
dom manually as i would need to with pure javascript
i.e. this is what auto would have to do. but how do
we connect our auto state with the dom?

## jsx

i spent some time trying to get jsx to work. the
idea is that, ideally, we want to just write html
with some extra tags. and jsx does this perfectly
well.

```js
let $ = auto({
    '<root>': ($) => $.list.forEach( item => <ListItem {item} /> )
})
```

when does the bind happen, i mean `createElement` ?
when does the update happen? do you describe each element
inside of an auto wrap? what would be the cleanest way
to do this?

### functions

what's great about jsx is it's just functions

```js
function MyComponent() {
    return <div>This is JSX</div>;
}
```

which slots great into auto. however, the point of auto
is to break down each component of your calculations
into pieces called _values_ each of which has their
of function and is cached. this is not really components
(since components are functions) but instances.

```js
let $ = auto({
    'sidebar': ($) =>
        <header>
            <section>
                <p>Sidebar title</p>
            </section>
            <MyButton {$.name} />
        </header>
})
```

i guess the difference with **autodom** is that
values aren't saved in a javascript object
(or cached rather than saved) but rather on the
dom. which kind of means it's a re-write of
auto, unless i can come up with ... a generic
way of specifying how to load / save values?

 - i need the load to check for subscriptions (only that?)
 - is it just a save method otherwise?

i suppose the only difference, then, for using
auto as a ui lib (i mean just defining some
access methods for load/save) is then implementing
a jsx-type parser so we can use elements and
the angle brackets 'cause that's what people
are used to...