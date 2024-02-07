# Fáze 1: Sestavení aplikace
FROM node:16 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

# Fáze 2: Běhové prostředí
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y ffmpeg

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/static ./static


EXPOSE 3000

CMD ["node", "dist/app.js"]
