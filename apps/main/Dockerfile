FROM node as deps

WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn

ADD prisma /app/prisma
RUN yarn add prisma && yarn add @prisma/client && npx prisma generate


FROM node:20-slim as build

WORKDIR /app

ADD /apps /app/apps
ADD *.json /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json .
COPY --from=deps /app/yarn.lock .

RUN yarn build main

FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

RUN apt update -y && apt upgrade -y && apt install openssl -y

COPY --from=deps /app/yarn.lock .
COPY --from=deps /app/package.json .
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist /app/dist
COPY --from=deps /app/node_modules/.prisma /app/node_modules/.prisma

ENTRYPOINT [ "node" ]
CMD [ "dist/apps/main/main.js" ]

EXPOSE 3001
