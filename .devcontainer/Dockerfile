FROM mcr.microsoft.com/devcontainers/dotnet:8.0-bookworm

RUN apt-get update && \
    apt-get -y install \
      openssh-client \
      tar \
      gzip \
      git \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg \
      lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    curl https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb -o packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get -y install \
      docker-ce \
      nodejs \
      gcc && \
    rm -rf /var/lib/apt/lists/* && \
    npm i -g n && \
    n 20

RUN dotnet tool install --global dotnet-ef --version 8.0.0

RUN userdel -r vscode
  
RUN groupadd --gid 1000 developer \
    && useradd --uid 1000 --gid 1000 -m developer \
    && chown -R 1000:1000 /home/developer

# get docker to connect to the host
RUN usermod -aG docker developer
RUN groupadd -g 1001 dockerhostgroup
RUN usermod -aG dockerhostgroup developer

USER developer

WORKDIR /app