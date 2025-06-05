#!/bin/bash
export DATABASE_URL=$(cat /run/secrets/db_url)
export JWT_SECRET=$(cat /run/secrets/jwt_secret)


set -e
npx prisma migrate deploy
npm start
