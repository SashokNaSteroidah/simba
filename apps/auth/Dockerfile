FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY ./ ./
RUN yarn prisma generate
RUN yarn run build

CMD [ "yarn", "start:dev", "auth" ]

EXPOSE 3002