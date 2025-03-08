FROM node:latest

COPY . .

EXPOSE 8080

RUN npm install

RUN npm run build

RUN npx prisma migrate deploy

WORKDIR ./dist

CMD [ "node", "app.js" ]
