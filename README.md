# POOPENGINE
The experimental game engine written for poopbox (in progress). The engine is writen in JavaScript and is ment for ES6 Module JavaScript. It uses HTML canvas for rendering.
### INSTALLATION
Simply copy the `poopengine.mjs` file into your website and import it using HTML like this:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>your-title</title>
    <style>
        body {
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <script src="your-code.js" type="module"></script>
</body>
</html>
```

You can then import poopengin into your JS file like this:
```js
import { poopengine } from "./poopengine.mjs";

const originalStart = poopengine.start;
poopengine.start = function () {
  originalStart.apply(this);
  // Code goes here:
}

const originalUpdate = poopengine.update;
poopengine.update = function () {
  originalUpdate.apply(this);
  // Code goes here:
}

poopengine.resize = function () {
  // Code goes here:
}

poopengine.start();
```
>You can find this code skelton in the `poopengine-boilerplate.js` file.
