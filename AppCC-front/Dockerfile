FROM node:20-alpine as angular
WORKDIR /ng-app
COPY package*.json /ng-app/
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:alpine
ARG name
COPY --from=angular /ng-app/dist/$name/browser /usr/share/nginx/html
# to build image run : docker build --build-arg name=front-app-cc -t soge-system-ui .
EXPOSE 80