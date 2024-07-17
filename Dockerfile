FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY ./prisma ./prisma
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
CMD npm run prisma:migrate:deploy && npm run start:ci
