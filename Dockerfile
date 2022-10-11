FROM node:16-slim as base
# needed by prisma
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

FROM base as builder
RUN npm ci
COPY . .
RUN sed -i s/localhost/postgres/ .env && \
    npm run build

FROM base as runner
RUN npm ci --only=production
COPY --from=builder /app/start.sh /app/.env ./
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["./start.sh"]
