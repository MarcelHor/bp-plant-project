# Sestavte React aplikaci
FROM node:16 as build-stage

WORKDIR /app

COPY package.json  ./

RUN npm install

COPY . .

RUN npm run build

# Nastavte NGINX pro hostování sestavené aplikace
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Kopírujte váš vlastní NGINX konfigurační soubor
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]