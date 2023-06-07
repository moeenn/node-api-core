FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm ci
ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
EXPOSE 5000
