# [Instalike](http://instalike.click) [![Build Status](https://travis-ci.org/theopak/instalike.svg?branch=master)](https://travis-ci.org/theopak/instalike) [![npm version](https://badge.fury.io/js/instalike.svg)](http://badge.fury.io/js/instalike)

Attractive, anonymous, globally-aware like buttons for anything. Simple embed an iframe in your website and it will use the public API. Or, you can self-host the API in order to add a custom like button to your nodejs project. You can use Instalike buttons to hold informal polls, to ask the internet for approval, and even to impress your friends.

![preview.gif](preview.gif)


# Usage

There are 2 ways you can use Instalike: with the public API, or as a self-hosted node package.

### 1. Use the public API

Place the `<iframe>` into your HTML, and specify a `THING` to keep track of. (Thing names are case-sensitive and can contain any Unicode characters.) That's it! The http://instalike.click website will automatically use the public API to keep track of the like count for your "thing."

```html
<iframe src="//instalike.click/button/?thing=THING" frameborder="0" scrolling="0" width="140px" height="16px">
</iframe>
```

API hosting provided by [Cimpress](http://cimpress.com). The API supports GET/POST/PATCH http://instalike.click/api/THING.

### 2. Host the API yourself

Install the npm module if you want to host the API yourself. This is perfect for on-premesis enterprise installations.

```bash
& sudo npm install -g gulp
$ npm install instalike
```


# Development

Pull requests welcome. The tech stack is very simple:

- Backend (api)
  - Node.js
  - Express.js
  - Swagger-Tools
  - Mocha for testing
  - Hosted on-prem
- Frontend (buttons)
  - Source is JS (zero external dependencies)
  - Source is HTML + CSS3
  - Uses FontAwesome icons
  - Built by Gulp
  - Hosted on gh-pages

The `./public` directory contains all the source files:

- **index.html** — the demo page hosted at http://instalike.click
- **button/index.html** — iframe target heavily inspired by https://github.com/mdo/github-buttons.
- **button/script.js** — use API to get/increment like count, use localStorage for button state.
- **button/style.css** — supports modern browsers.
- **button/icons** — fontawesome minimal subset via http://icomoon.io.

Here are examples of calls to the JSON API:

```
GET /{thingName} HTTP/1.1
Host: api.instalike.click
Accept: application/json

200 OK
{
  "thing": "{thingName}",
  "count": 42
}
```

```
POST /{thingName} HTTP/1.1
Host: api.instalike.click
Accept: application/json

200 OK
{
  "thing": "{thingName}",
  "count": 43
}
```

```
PATCH /{thingName} HTTP/1.1
Host: api.instalike.click
Accept: application/json

200 OK
{
  "thing": "{thingName}",
  "count": 42
}
```
