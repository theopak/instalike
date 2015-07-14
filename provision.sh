#!/bin/bash

# Change hostname for convenience
echo "instalike" > /etc/hostname
echo "127.0.0.1 instalike" >> /etc/hosts
hostname instalike

# Install
apt-get update
apt-get install -y make g++ git curl vim libcairo2-dev libav-tools nfs-common portmap # build tools
apt-get install -y nodejs npm
ln -sf /usr/bin/nodejs /usr/bin/node

# We want to use the local package, not the npm version, so that we can iterate on changes
mkdir -p /usr/local/lib/node_modules
ln -sf /vagrant /usr/local/lib/node_modules/instalike

# Create init script for this project
cat <<EOF >/etc/init/instalike.conf
# Agent (Upstart unit)
description "instalike service"
start on runlevel [2345]
stop on runlevel [!2345]
chdir /usr/local/lib/node_modules/instalike
respawn
respawn limit 10 10
kill timeout 10
script
  exec node index.js
end script
EOF
sudo service instalike start

# Redis
apt-get install -y redis-server
sed -i '/bind 127.0.0.1/c\\#bind 127.0.0.1' /etc/redis/redis.conf
service redis-server restart
