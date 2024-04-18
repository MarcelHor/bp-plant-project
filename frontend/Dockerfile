FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json  ./

RUN npm install

COPY . .

RUN npm run build
FROM nginx:stable-alpine as production-stage

ENV TZ=Europe/Prague
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]





