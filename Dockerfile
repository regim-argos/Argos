
FROM node:alpine

LABEL version="0.1.0"

COPY ./ /argos

WORKDIR /argos

RUN apk --no-cache add curl

RUN yarn --silent --production

CMD yarn migrations && NODE_ENV=production node ./dist/server.js
