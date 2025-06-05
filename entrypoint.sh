#!/bin/bash
export DATABASE_URL=$(cat /run/secrets/db_url)

set -e
npx prisma migrate deploy
npm start
