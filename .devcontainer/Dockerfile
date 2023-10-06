FROM almalinux:8

RUN dnf -y install \
      openssh-clients \
      tar \
      gzip \
      git \
      dotnet \
      nodejs \
      gcc && \
    rm -rf /var/cache/yum && \
    npm i -g n && \
    n 20

  
RUN groupadd --gid 1000 developer \
    && useradd --uid 1000 --gid 1000 -m developer \
    && chown -R developer. /home/developer

USER developer


WORKDIR /app