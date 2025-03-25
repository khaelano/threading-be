FROM node:slim AS build
WORKDIR /temp/
COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./
RUN npm run build

FROM node:slim AS deploy
RUN apt-get update -y
RUN apt-get install -y openssl

FROM deploy
WORKDIR /app

COPY --from=build /temp/dist/ ./dist/
COPY --from=build /temp/entrypoint.sh ./
COPY --from=build /temp/prisma/ ./
COPY --from=build /temp/package.json ./

ENV NODE_ENV=production
RUN npm install

RUN chmod +x ./entrypoint.sh
EXPOSE 8080

ENTRYPOINT [ "bash", "./entrypoint.sh" ]