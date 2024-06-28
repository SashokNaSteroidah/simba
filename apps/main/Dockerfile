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

COPY --from=build /app/node_modules .
COPY --from=build /app/dist .
COPY --from=build /app/package.json .

CMD [ "yarn", "start:prod:main" ]

EXPOSE 3001