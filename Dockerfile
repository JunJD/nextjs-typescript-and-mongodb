# 构建阶段
FROM node:20-slim AS build
WORKDIR /app

# 安装 OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# 安装 pnpm
RUN npm install -g pnpm@8.15.4

# 首先复制依赖相关文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制不常变动的文件
COPY prisma ./prisma/
COPY cert ./cert/

# 设置构建时的环境变量
ARG MONGO_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GOOGLE_APP_CLIENT_ID
ARG GOOGLE_APP_CLIENT_SECRET
ARG WECHAT_PAY_APP_ID
ARG WECHAT_APP_SECRET

ENV MONGO_URI=${MONGO_URI}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV GOOGLE_APP_CLIENT_ID=${GOOGLE_APP_CLIENT_ID}
ENV GOOGLE_APP_CLIENT_SECRET=${GOOGLE_APP_CLIENT_SECRET}
ENV WECHAT_PAY_APP_ID=${WECHAT_PAY_APP_ID}
ENV WECHAT_APP_SECRET=${WECHAT_APP_SECRET}

# 生成Prisma客户端 (添加 --no-engine 标志)
RUN pnpm prisma generate --no-engine

# 最后复制源代码（因为这是最常变动的部分）
COPY . .
RUN pnpm run build

# 优化构建产物
RUN cp -r public .next/standalone/ && \
    cp -r .next/static .next/standalone/.next/

# 生产阶段
FROM node:20-slim AS runner
WORKDIR /app

# 安装 OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# 设置运行时环境变量
ARG MONGO_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GOOGLE_APP_CLIENT_ID
ARG GOOGLE_APP_CLIENT_SECRET
ARG WECHAT_PAY_APP_ID
ARG WECHAT_APP_SECRET

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV MONGO_URI=${MONGO_URI}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV GOOGLE_APP_CLIENT_ID=${GOOGLE_APP_CLIENT_ID}
ENV GOOGLE_APP_CLIENT_SECRET=${GOOGLE_APP_CLIENT_SECRET}
ENV WECHAT_PAY_APP_ID=${WECHAT_PAY_APP_ID}
ENV WECHAT_APP_SECRET=${WECHAT_APP_SECRET}
ENV WECHAT_PAY_MCH_ID=${WECHAT_PAY_MCH_ID}
ENV WECHAT_PAY_KEY=${WECHAT_PAY_KEY}
ENV WECHAT_PAY_PFX_PATH=${WECHAT_PAY_PFX_PATH}
ENV WECHAT_PAY_NOTIFY_URL=${WECHAT_PAY_NOTIFY_URL}

# 复制构建产物和必要的证书文件
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/cert ./cert/

EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
