FROM node:18-alpine AS base

# Declare build arguments
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_FROM
ARG GOOGLE_CLOUD_BUCKET_NAME

# Set environment variables
ENV EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST
ENV EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT
ENV EMAIL_SERVER_USER=$EMAIL_SERVER_USER
ENV EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD
ENV EMAIL_FROM=$EMAIL_FROM
ENV TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN
ENV GOOGLE_CLOUD_BUCKET_NAME=$GOOGLE_CLOUD_BUCKET_NAME

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app

# 安裝必要的 SSL 庫
RUN apk add --no-cache openssl1.1-compat

# 添加 Tiptap Pro token
ARG TIPTAP_PRO_TOKEN
RUN echo "Token length: ${#TIPTAP_PRO_TOKEN}"  # 只輸出長度，不輸出實際 token
COPY .npmrc ./
RUN if [ -n "$TIPTAP_PRO_TOKEN" ]; then \
    echo "Adding token to .npmrc"; \
    echo "//registry.tiptap.dev/:_authToken=${TIPTAP_PRO_TOKEN}" >> .npmrc; \
    fi

# 調試用（記得移除）
RUN echo "Token length: ${#TIPTAP_PRO_TOKEN}"
RUN cat .npmrc | grep "registry" || true

# 生成 Prisma Client
RUN npx prisma generate

# 複製 package 相關文件
COPY package.json package-lock.json ./

RUN ls -la  # 列出所有文件

# 如果使用 package-lock.json，確保它存在
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 添加調試信息
RUN npm list || true

# 安裝依賴並確保 node_modules 存在
RUN npm ci
RUN ls -la && echo "Node modules:" && ls -la node_modules

# 安裝完成後刪除 .npmrc（安全考慮）
RUN rm -f .npmrc

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# 確保正確複製 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 排除 image-processor，因為它是獨立的服務
RUN rm -rf image-processor

# Generate Prisma Client
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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