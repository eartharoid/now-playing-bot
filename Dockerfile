FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install

CMD ["bun", "."]