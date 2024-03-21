FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --verbose
COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
