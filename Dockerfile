FROM node:latest

COPY . .

EXPOSE 8080

RUN npm install
RUN npm run build

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

WORKDIR /dist

CMD [ "node", "app.js" ]
