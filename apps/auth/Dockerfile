FROM node:21-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY ./ ./
RUN npm i -g prisma
RUN yarn prisma generate
RUN yarn build auth

CMD [ "yarn", "start:prod:auth" ]

EXPOSE 3002