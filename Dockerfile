FROM node:18-bullseye-slim AS base

# 在構建時需要的參數
ARG TIPTAP_PRO_TOKEN
ARG GOOGLE_CLOUD_BUCKET_NAME
ARG OPENAI_API_KEY
ARG OPENAI_ORGANIZATION_ID
ARG OPENAI_PROJECT_ID

# Set environment variables that are needed during build
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV OPENAI_ORGANIZATION_ID=${OPENAI_ORGANIZATION_ID}
ENV OPENAI_PROJECT_ID=${OPENAI_PROJECT_ID}

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && apt-get install -y \
    git \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 添加 Tiptap Pro token
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN if [ -n "$TIPTAP_PRO_TOKEN" ]; then \
    echo "Configuring Tiptap Pro registry"; \
    echo "@tiptap-pro:registry=https://registry.tiptap.dev/" >> .npmrc; \
    echo "//registry.tiptap.dev/:_authToken=${TIPTAP_PRO_TOKEN}" >> .npmrc; \
    fi

# Install dependencies
RUN npm ci
RUN npx prisma generate
RUN rm -f .npmrc

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules and other files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

# Ensure environment variables are available during build
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV OPENAI_ORGANIZATION_ID=${OPENAI_ORGANIZATION_ID}
ENV OPENAI_PROJECT_ID=${OPENAI_PROJECT_ID}

# Build the application
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

RUN groupadd -r nodejs && useradd -r -g nodejs nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
