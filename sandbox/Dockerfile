# AgentSandbox container. The base image ships the Sandbox SDK control server
# (port 3000, ENTRYPOINT) that @cloudflare/sandbox talks to; keep its tag equal
# to the @cloudflare/sandbox version in package.json. The -python variant adds Python 3.
FROM docker.io/cloudflare/sandbox:0.12.9-python

ENV DEBIAN_FRONTEND=noninteractive

# Document conversion, OCR and CJK fonts used by the file-producing skills.
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    && fc-cache -f

RUN python3 -m pip install --no-cache-dir \
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
    mcp

RUN MPLRC="$(python3 -c 'import matplotlib; print(matplotlib.matplotlib_fname())')" \
    && sed -i 's/^#font.sans-serif:.*/font.sans-serif: Noto Sans CJK TC, Noto Sans CJK SC, DejaVu Sans, sans-serif/' "$MPLRC" \
    && sed -i 's/^#axes.unicode_minus:.*/axes.unicode_minus: False/' "$MPLRC"

RUN npm install -g pptxgenjs tsx docx react-icons react react-dom sharp \
    && npm cache clean --force
ENV NODE_PATH=/usr/local/lib/node_modules

# Commits made by agent runs.
RUN git config --system user.name "quidproquo-agent" \
    && git config --system user.email "agent@quidproquo.cc"

WORKDIR /workspace
