FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate

EXPOSE 3000

CMD ["yarn", "start:dev"]
