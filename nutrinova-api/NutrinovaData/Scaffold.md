# Scaffold Nutrinova Entities

- Running this command will overwrite the NutrinovaDbContext and Entities folder
- Use partial classes to add additional functionality to the entities and context


```bash
dotnet ef dbcontext scaffold "Host=nutrinova-db;Port=5432;Database=nutrinovadb;Username=admin;Password=Pleasegivemecoke!" Npgsql.EntityFrameworkCore.PostgreSQL --project ./NutrinovaData/ -c NutrinovaDbContext --context-dir ./ -o Entities -f
```

- Note: This is to be run from within the development container, the connection string is set up to work with the docker-compose networK