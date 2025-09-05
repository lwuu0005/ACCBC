# 🚀 Bridge Project 一体化部署

## 快速开始

### 1. 一键部署
```bash
# 克隆项目
git clone <your-repo-url>
cd ACCBC

# 运行部署工具
npm run deploy
```

### 2. 手动部署步骤

#### 方式一：Vercel (推荐)
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署后端
cd backend
vercel --prod

# 4. 部署前端
cd ../frontend/bridge
vercel --prod
```

#### 方式二：Docker
```bash
# 1. 启动所有服务
docker-compose up -d

# 2. 查看日志
docker-compose logs -f

# 3. 停止服务
docker-compose down
```

#### 方式三：Railway
1. 访问 [Railway](https://railway.app)
2. 连接 GitHub 仓库
3. 创建两个服务：后端和前端
4. 配置环境变量
5. 部署

## 环境变量配置

### 后端 (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket_booking
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 前端 (.env)
```env
VITE_API_BASE_URL=https://your-backend.vercel.app
VITE_APP_NAME=Bridge Project
VITE_APP_VERSION=1.0.0
```

## 数据库设置

### MongoDB Atlas (推荐)
1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串
4. 配置到环境变量

### 本地 MongoDB
```bash
# 使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 连接字符串
MONGODB_URI=mongodb://localhost:27017/ticket_booking
```

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已配置
- [ ] 数据库已连接
- [ ] 前端 API 地址已更新
- [ ] SSL 证书已配置
- [ ] 域名已解析

## 常用命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 安装所有依赖
npm run install:all

# Docker 操作
npm run docker:up
npm run docker:down
npm run docker:logs

# Vercel 操作
npm run vercel:login
npm run vercel:deploy
```

## 故障排除

### 常见问题
1. **CORS 错误**: 检查 `CORS_ORIGIN` 环境变量
2. **数据库连接失败**: 检查 `MONGODB_URI` 和网络连接
3. **前端 API 调用失败**: 检查 `VITE_API_BASE_URL` 配置
4. **构建失败**: 检查 Node.js 版本和依赖安装

### 获取帮助
- 查看项目文档
- 检查控制台错误信息
- 查看部署平台日志

## 生产环境建议

1. **安全**
   - 使用强密码和复杂密钥
   - 定期更新依赖
   - 配置防火墙规则

2. **性能**
   - 启用 CDN
   - 配置缓存策略
   - 监控资源使用

3. **监控**
   - 设置错误监控
   - 配置性能监控
   - 定期备份数据
