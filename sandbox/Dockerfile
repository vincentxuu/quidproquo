FROM python:3.13-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    numpy \
    pandas \
    matplotlib \
    sympy \
    Pillow \
    openpyxl \
    xlsxwriter \
    python-docx \
    python-pptx \
    reportlab \
    fpdf2 \
    pypdf \
    pdfplumber \
    pymupdf \
    pdf2image \
    pytesseract \
    "markitdown[pptx]" \
    requests \
    beautifulsoup4 \
    lxml \
    defusedxml \
    cairosvg \
    anthropic \
    mcp \
    mplfonts

RUN mplfonts init \
    && mplfonts install --update Noto\ Sans\ CJK\ SC

FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    fonts-noto-cjk \
    fontconfig \
    libcairo2 \
    libreoffice-core \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libreoffice-l10n-zh-tw \
    poppler-utils \
    pandoc \
    qpdf \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-chi-tra \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

RUN MPLRC="$(python -c 'import matplotlib; print(matplotlib.matplotlib_fname())')" \
    && sed -i 's/^#font.sans-serif:.*/font.sans-serif: Noto Sans CJK SC, DejaVu Sans, sans-serif/' "$MPLRC" \
    && sed -i 's/^#axes.unicode_minus:.*/axes.unicode_minus: False/' "$MPLRC"

RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pptxgenjs tsx docx \
       react-icons react react-dom sharp \
    && npm cache clean --force
ENV NODE_PATH=/usr/local/lib/node_modules:/usr/lib/node_modules

RUN useradd --create-home --uid 1000 sandbox \
    && mkdir -p /workspace \
    && chown -R sandbox:sandbox /workspace
WORKDIR /workspace
USER sandbox
