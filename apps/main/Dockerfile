FROM node:20-slim as deps

WORKDIR /app

RUN apt update -y && apt install openssl -y

COPY package*.json ./
RUN yarn
COPY . .
RUN npm i -g prisma
RUN yarn prisma generate

FROM deps as build

WORKDIR /app

COPY --from=deps /app /app

RUN yarn build main

FROM build as runner

WORKDIR /app

COPY --from=deps /app/node_modules .
COPY --from=deps /app/dist .
COPY --from=deps /app/package.json .

CMD [ "yarn", "start:prod:main" ]

EXPOSE 3001