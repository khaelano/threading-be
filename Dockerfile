FROM node:slim AS build
WORKDIR /temp/
COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./
RUN npm run build

FROM node:slim AS deploy
WORKDIR /app
COPY --from=build /temp/dist/ ./dist/
COPY --from=build /temp/package.json ./
ENV NODE_ENV=production
RUN npm install

EXPOSE 8080
ENTRYPOINT [ "node", "./dist/app.js" ]