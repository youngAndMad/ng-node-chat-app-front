# FROM nginx:1.17.1-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /dist/ng-node-chat-app-front /usr/share/nginx/html

# Stage 1
FROM node:20.10.0-buster-slim
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.4.0
RUN npm config set registry http://registry.npmjs.org/
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration production
EXPOSE 4200
CMD ["npm", "start"]