FROM node:20-alpine

WORKDIR /app


COPY . .

RUN npm i -g @nestjs/cli
RUN npm i -g pnpm
RUN pnpm install

# Copia script de start corretamente
RUN chmod +x /app/scripts/start-dev.sh

EXPOSE 3000

ENTRYPOINT [ "/app/scripts/start-dev.sh" ]
