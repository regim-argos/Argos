
FROM node:alpine

LABEL version="0.1.0"

COPY ./ /argos

WORKDIR /argos

RUN npm set progress=false && \
  npm i --silent --production

CMD yarn migrations && NODE_ENV=production node ./dist/server.js
