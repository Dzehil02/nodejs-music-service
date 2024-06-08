FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

CMD ["npm", "run", "start:docker:migrate"]