FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    fonts-noto-cjk \
    fontconfig \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

RUN pip3 install --no-cache-dir --break-system-packages \
    numpy \
    pandas \
    matplotlib \
    scipy \
    sympy \
    Pillow \
    openpyxl \
    requests \
    beautifulsoup4 \
    lxml

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN useradd --create-home --uid 1000 sandbox \
    && mkdir -p /workspace \
    && chown -R sandbox:sandbox /workspace
WORKDIR /workspace
USER sandbox
