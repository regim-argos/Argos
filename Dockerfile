
FROM node:alpine

LABEL version="0.1.0"

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

COPY ./ /argos

WORKDIR /argos

RUN npm set progress=false && \
  npm i --silent --production

RUN apk del native-deps

CMD yarn migrations && yarn start
