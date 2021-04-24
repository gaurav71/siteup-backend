FROM node:lts-alpine3.13

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run tsc

CMD ["node", "./dist/index.js"]
