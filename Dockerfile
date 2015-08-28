FROM ubuntu

MAINTAINER Theodore X. Pak (Work) "tpak@cimpress.com"

# Install dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install build-essential python nodejs
# RUN npm install -g pm2

# Provides cached layer for node_modules
# Recommended reading:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# http://anandmanisankar.com/posts/docker-container-nginx-node-redis-example/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Build frontend
RUN npm run build

# Expose port
EXPOSE 8089

# Run app using the package.json start script
CMD ["npm", "start"]
