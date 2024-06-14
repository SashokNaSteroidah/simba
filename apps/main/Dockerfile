FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
RUN apt update -y && apt install openssl -y
COPY ./ ./
RUN npm i -g prisma
RUN yarn prisma generate
RUN yarn build main

CMD [ "yarn", "start:prod:main" ]

EXPOSE 3001