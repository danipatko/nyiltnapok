FROM node:lts as builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

COPY . .

RUN npm i

RUN npx prisma generate

RUN npm run build

# FROM gcr.io/distroless/nodejs:18

# WORKDIR /app

# COPY --from=builder /app /app

EXPOSE 3000

CMD ["./start.sh"]
