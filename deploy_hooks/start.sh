#!/bin/sh
service redis-server restart
pm2 start index.js
