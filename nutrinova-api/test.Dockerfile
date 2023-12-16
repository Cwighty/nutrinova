FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NutrinovaApi.IntegrationTests/NutrinovaApi.IntegrationTests.csproj", "NutrinovaApi.IntegrationTests/"]
RUN dotnet restore "NutrinovaApi.IntegrationTests/NutrinovaApi.IntegrationTests.csproj"
COPY . .
RUN dotnet test