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