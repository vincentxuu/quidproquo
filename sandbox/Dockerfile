FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    build-essential \
    fonts-noto-cjk \
    fontconfig \
    libcairo2-dev \
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

RUN pip install --no-cache-dir \
    numpy \
    pandas \
    matplotlib \
    scipy \
    sympy \
    scikit-learn \
    seaborn \
    Pillow \
    openpyxl \
    xlsxwriter \
    python-docx \
    reportlab \
    fpdf2 \
    pypdf \
    pdfplumber \
    pymupdf \
    pdf2image \
    pytesseract \
    "markitdown[pptx]" \
    statsmodels \
    requests \
    beautifulsoup4 \
    lxml \
    defusedxml \
    cairosvg \
    anthropic \
    mcp

RUN pip install --no-cache-dir mplfonts \
    && mplfonts init \
    && mplfonts install --update Noto\ Sans\ CJK\ SC

RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm typescript tsx \
       pptxgenjs docx react-icons react react-dom sharp \
    && npm cache clean --force
ENV NODE_PATH=/usr/local/lib/node_modules:/usr/lib/node_modules

RUN MPLRC="$(python -c 'import matplotlib; print(matplotlib.matplotlib_fname())')" \
    && sed -i 's/^#font.sans-serif:.*/font.sans-serif: Noto Sans CJK SC, DejaVu Sans, sans-serif/' "$MPLRC" \
    && sed -i 's/^#axes.unicode_minus:.*/axes.unicode_minus: False/' "$MPLRC"

RUN useradd --create-home --uid 1000 sandbox \
    && mkdir -p /workspace \
    && chown -R sandbox:sandbox /workspace
WORKDIR /workspace
USER sandbox
