FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app

# 複製 package 相關文件
COPY package.json ./
# 如果使用 package-lock.json，確保它存在
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 添加調試信息
RUN npm list || true

# 安裝依賴並確保 node_modules 存在
RUN npm ci
RUN ls -la && echo "Node modules:" && ls -la node_modules

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