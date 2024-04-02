#!/bin/bash

# Step 1: Navigate to your Docker Compose directory
cd ../../.devcontainer/

# Step 2: Stop the Docker Compose managed containers and remove them
docker compose down 

docker container prune -f

# Step 3: Delete the specific data volume
docker volume --force rm nutrinova_devcontainer_nutrinova_db_data

# Step 4: Start the Docker Compose managed containers again
docker compose up -d --build

# Ensure the database is fully up and running before scaffolding
echo "Waiting for database to be fully up..."
sleep 10 # Adjust this sleep time as necessary

# Step 5: Execute the scaffold command inside the API container
docker exec -it nutrinova-editor sh -c "
    cd /app/nutrinova-api/
    dotnet tool install --global dotnet-ef
    export PATH="$PATH:/home/developer/.dotnet/tools"
    dotnet ef dbcontext scaffold \"Host=nutrinova-db;Port=5432;Database=nutrinovadb;Username=admin;Password=Pleasegivemecoke!\" Npgsql.EntityFrameworkCore.PostgreSQL --project ./NutrinovaData/ -c NutrinovaDbContext --context-dir ./ -o Entities -f --no-onconfiguring
"

docker compose down 

echo "Scaffolding complete."
