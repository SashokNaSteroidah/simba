FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY . .
RUN yarn prisma generate
RUN yarn run build

CMD [ "node", "dist/main.js" ]

EXPOSE 3001