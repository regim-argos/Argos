
FROM node

LABEL version="0.1.0"

COPY ./ /argos

WORKDIR /argos

RUN yarn install --production --silent

CMD yarn migrations && yarn start
