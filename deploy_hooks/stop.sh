#!/bin/sh
service redis-server stop
pm2 stop index.js
