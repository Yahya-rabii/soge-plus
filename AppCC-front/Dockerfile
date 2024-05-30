FROM node:20-alpine as angular
WORKDIR /ng-app
COPY package*.json /ng-app/
RUN npm ci
COPY . .
RUN npm install -g @angular/cli@17.3.4
RUN ng build --configuration=production
FROM nginx:alpine
ARG name="front-app-cc"
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular /ng-app/dist/$name/browser /usr/share/nginx/html
# to build image run : docker build --build-arg name=front-app-cc -t soge-system-ui .
EXPOSE 80