FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY ./ ./
RUN npm i -g prisma
RUN prisma generate
RUN yarn run build

CMD [ "yarn", "start:dev", "main" ]

EXPOSE 3001