#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NutrinovaApi/NutrinovaApi.csproj", "NutrinovaApi/"]
RUN dotnet restore "NutrinovaApi/NutrinovaApi.csproj"
COPY . .
WORKDIR "/src/NutrinovaApi"
RUN dotnet build "NutrinovaApi.csproj" -c Release -o /app/build
