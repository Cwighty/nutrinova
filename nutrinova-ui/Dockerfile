FROM node:21 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# stage 2

FROM node:21

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]