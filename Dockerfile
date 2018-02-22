# Select Docker template
FROM node:7.2.1-alpine

WORKDIR /app/

RUN apk update &&\
    apk add git &&\
    apk add bash &&\
    git clone https://github.com/ChrisLyn/react-native-with-go.git

WORKDIR /app/react-native-with-go/Client/

# Install dependencies
RUN npm install -g react-native &&\
    npm install -g react-native-cli &&\
    npm install &&\
    react-native run-ios

# Export port to docker host
EXPOSE 8081

ENTRYPOINT ["npm", "start"]
