# Fáze 1: Sestavení aplikace
FROM node:16 as builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl libssl1.1

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

# Fáze 2: Běhové prostředí
FROM node:16-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl libssl1.1

# Kopírujte sestavené soubory a node_modules z builder fáze
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Pokud potřebujete Prisma soubory v běhové fázi, kopírujte je
COPY --from=builder /usr/src/app/prisma ./prisma

#create folder for images maybe in future in js
COPY ./static/images ./static/images
COPY ./static/thumbnails ./static/thumbnails
COPY .env ./
EXPOSE 3000


CMD ["node", "dist/app.js"]
