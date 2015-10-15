FROM ubuntu

# Install system dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install nodejs redis-server

# Install application dependencies
ADD instalike /var/livedemo
WORKDIR /var/livedemo
RUN npm install
RUN npm run build

# Expose port
EXPOSE 8089

# Run app using the package.json start script
COPY ./start.sh /var/livedemo/start.sh
RUN chmod +x ./start.sh
CMD start.sh
