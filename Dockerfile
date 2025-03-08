FROM node:latest

COPY . .

EXPOSE 8080

RUN npm install

RUN npm run build

WORKDIR ./dist

CMD [ "node", "app.js" ]
