FROM node:18-alpine AS base

# Declare build arguments
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_FROM
ARG GOOGLE_CLOUD_BUCKET_NAME
ARG TIPTAP_PRO_TOKEN

# Set environment variables
ENV EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST
ENV EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT
ENV EMAIL_SERVER_USER=$EMAIL_SERVER_USER
ENV EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD
ENV EMAIL_FROM=$EMAIL_FROM
ENV GOOGLE_CLOUD_BUCKET_NAME=$GOOGLE_CLOUD_BUCKET_NAME
ENV TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache \
    libc6-compat \
    git \
    openssl \
    openssl-dev 
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

# Build the application
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