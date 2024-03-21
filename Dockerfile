FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --verbose
COPY . .

RUN npm run build
EXPOSE 3001

CMD [ "node", "dist/main.js" ]
