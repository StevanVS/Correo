FROM node:21-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install mysql2

COPY . .

EXPOSE 8080:8080

CMD [ "npm", "run", "dev" ]