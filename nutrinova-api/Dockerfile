#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 8080


FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS dev
RUN --mount=type=bind,target=/docker-context \
    cd /docker-context/; \
    find ./ -mindepth 0 -maxdepth 4 \( -name "*.sln" -o -name "*.csproj" -o -iname "nuget.config" \) -exec cp --parents "{}" /src \;
COPY . /src
WORKDIR /src/NutrinovaApi
CMD dotnet watch run --no-launch-profile --non-interactive


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NutrinovaApi/NutrinovaApi.csproj", "NutrinovaApi/"]
RUN dotnet restore "NutrinovaApi/NutrinovaApi.csproj"
COPY . .
WORKDIR "/src/NutrinovaApi"
RUN dotnet build "NutrinovaApi.csproj" -c Release -o /app/build


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS integrationtests
WORKDIR /src
COPY ["NutrinovaApi.IntegrationTests/NutrinovaApi.IntegrationTests.csproj", "NutrinovaApi.IntegrationTests/"]
RUN dotnet restore "NutrinovaApi.IntegrationTests/NutrinovaApi.IntegrationTests.csproj"
COPY . .
RUN dotnet test

FROM build AS publish
RUN dotnet publish "NutrinovaApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NutrinovaApi.dll"]