#Script para retetar os bancos de dados agro e agro_test
echo " Parando containers e removendo volumes..."
docker-compose down -v

echo " Subindo bancos limpos..."
docker-compose up -d db db_test

echo "Pronto. Bancos agro e agro_test foram resetados com sucesso."