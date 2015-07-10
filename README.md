# Instalike

The like button for anything. Heavily inspired by http://ghbtns.com (Github Star counts). Use these attractive, globally-aware, anonymous like buttons to measure interest and hold informal polls.

![preview.gif](preview.gif)


# Usage

Simply drop the `<iframe>` in your HTML, and specify a hash to keep track of. Hashes are case-sensitive and can contain any Unicode characters.

```html
<iframe src="btn.html?thing=HASH" frameborder="0" scrolling="0" width="140px" height="16px">
</iframe>
```


# Development

The `./public` directory contains all the source files:

- **btn.html** — iframe target heavily inspired by https://github.com/mdo/github-buttons.
- **script.js** — use API to get/increment like count, use localStorage for button state.
- **style.css** — supports modern browsers.
- **icons** — fontawesome minimal subset via http://icomoon.io.

```bash
npm install
npm install -g gulp
gulp default        # Build source into ./dist
node .              # Serve ./dist on http://localhost:7001
```

Here's an example of a call to the JSON API:

```
POST /{thingName} HTTP/1.1
Host: localhost
Accept: application/json

200 OK
{
  "id": 12345,
  "thing": "{thingName}",
  "count": 9000
}
```