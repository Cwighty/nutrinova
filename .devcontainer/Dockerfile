FROM almalinux:8

RUN dnf -y install \
      openssh-clients \
      tar \
      gzip \
      git \
      dotnet-sdk-8.0 \
      aspnetcore-runtime-8.0 \
      nodejs \
      gcc  \
      dnf-plugins-core && \
      dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo && \
      dnf -y install docker-ce --nobest && \
      rm -rf /var/cache/yum && \
      npm i -g n && \
      n 20
RUN dotnet tool install --global dotnet-ef --version 8.0.0 
 
  
RUN groupadd --gid 1000 developer \
    && useradd --uid 1000 --gid 1000 -m developer \
    && chown -R developer /home/developer

# get docker to connect to the host
RUN usermod -aG docker developer
RUN groupadd -g 1001 dockerhostgroup
RUN usermod -aG dockerhostgroup developer

USER developer

WORKDIR /app