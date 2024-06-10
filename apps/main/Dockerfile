FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY ./ ./
RUN npm i -g prisma
RUN yarn prisma generate
RUN yarn run build

CMD [ "yarn", "start:prod:main" ]

EXPOSE 3001