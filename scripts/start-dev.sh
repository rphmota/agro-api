#!/bin/sh

echo "⏳ Aguardando o banco ficar disponível..."

# Aguarda o serviço de banco ficar pronto antes de continuar
until nc -z db 5432; do
  sleep 1
done

echo "✅ Banco disponível. Executando migrações..."
pnpm run migrate:all
pnpm test
pnpm run start:dev


