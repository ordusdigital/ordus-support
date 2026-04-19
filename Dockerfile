FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY scripts/screenshot-pipeline.ts ./scripts/
COPY scripts/logo-replacer.ts ./scripts/
COPY scripts/qa-checker.ts ./scripts/
COPY scripts/server.ts ./scripts/
COPY scripts/sheets-sync.ts ./scripts/
COPY src/types/article.ts ./src/types/
COPY src/lib/categories.ts ./src/lib/
COPY tsconfig.scripts.json ./

RUN apt-get update && apt-get install -y fonts-liberation && rm -rf /var/lib/apt/lists/*

EXPOSE 3001

CMD ["npx", "ts-node", "--project", "tsconfig.scripts.json", "scripts/server.ts"]
