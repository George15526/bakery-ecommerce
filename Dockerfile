FROM node:20-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
