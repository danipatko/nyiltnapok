FROM node:16-slim as base
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
# needed by prisma

FROM base as builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN sed -i s/localhost/postgres/ .env && \
    npm run build

FROM base as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma/
COPY --from=builder /app/start.sh /app/.env ./
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["./start.sh"]
