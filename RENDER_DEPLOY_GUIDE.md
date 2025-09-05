# 🚀 Bridge Project Render 部署指南

## 概述
Render 是一个现代化的全栈部署平台，支持前后端同时部署，非常适合 Bridge Project 这样的全栈应用。

## 🎯 为什么选择 Render？

### ✅ 优势
- **免费使用** - 提供免费层，足够个人项目使用
- **全栈支持** - 同时支持后端 API 和前端静态网站
- **自动部署** - 连接 GitHub 后自动部署
- **HTTPS 免费** - 自动提供 SSL 证书
- **简单易用** - 图形化界面，配置简单
- **全球 CDN** - 自动优化全球访问速度

### 📊 免费层限制
- **后端服务**: 750 小时/月 (约 31 天)
- **静态网站**: 100GB 带宽/月
- **数据库**: 1GB 存储空间
- **构建时间**: 500 分钟/月

## 🚀 快速开始

### 方法一：使用部署脚本 (推荐)
```bash
# 运行 Render 部署工具
node deploy-render.js
```

### 方法二：手动部署
按照下面的详细步骤操作

## 📋 详细部署步骤

### 1. 准备环境

#### 1.1 安装必要工具
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- GitHub 账户

#### 1.2 准备项目
```bash
# 克隆项目
git clone <your-repo-url>
cd ACCBC

# 安装依赖
npm run install:all
```

### 2. 配置环境变量

#### 2.1 后端环境变量
创建 `backend/.env` 文件：
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket_booking
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=https://your-frontend.onrender.com
```

#### 2.2 前端环境变量
创建 `frontend/bridge/.env` 文件：
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_APP_NAME=Bridge Project
VITE_APP_VERSION=1.0.0
```

### 3. 数据库准备

#### 3.1 MongoDB Atlas (推荐)
1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串
4. 配置到环境变量

#### 3.2 Render 数据库 (可选)
- 在 Render 控制台创建 PostgreSQL 或 MongoDB 服务
- 获取连接字符串
- 配置到环境变量

### 4. 推送代码到 GitHub

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "准备 Render 部署"

# 推送到 GitHub
git push origin main
```

### 5. 在 Render 创建后端服务

#### 5.1 创建 Web Service
1. 访问 [Render Dashboard](https://dashboard.render.com)
2. 点击 "New +" -> "Web Service"
3. 连接 GitHub 仓库
4. 选择仓库和分支

#### 5.2 配置后端服务
```
Name: bridge-backend
Environment: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Plan: Free
```

#### 5.3 设置环境变量
在 Render 控制台添加：
```
NODE_ENV = production
PORT = 3000
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/ticket_booking
JWT_SECRET = your_super_secret_jwt_key_here
CORS_ORIGIN = https://your-frontend.onrender.com
```

### 6. 在 Render 创建前端服务

#### 6.1 创建 Static Site
1. 点击 "New +" -> "Static Site"
2. 连接同一个 GitHub 仓库
3. 选择仓库和分支

#### 6.2 配置前端服务
```
Name: bridge-frontend
Build Command: cd frontend/bridge && npm install && npm run build
Publish Directory: frontend/bridge/dist
Plan: Free
```

#### 6.3 设置环境变量
在前端服务中添加：
```
VITE_API_BASE_URL = https://your-backend.onrender.com
VITE_APP_NAME = Bridge Project
VITE_APP_VERSION = 1.0.0
```

### 7. 等待部署完成

- 后端服务通常需要 2-5 分钟
- 前端服务通常需要 1-3 分钟
- 查看构建日志确保没有错误

## 🔧 高级配置

### 自定义域名
1. 在 Render 控制台选择服务
2. 进入 "Settings" -> "Custom Domains"
3. 添加你的域名
4. 配置 DNS 记录

### 环境变量管理
- 使用 Render 的环境变量功能
- 敏感信息不要提交到代码
- 定期轮换密钥

### 监控和日志
- 查看 Render 控制台的日志
- 设置告警通知
- 监控服务状态

## 🛠️ 常用命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 安装所有依赖
npm run install:all

# 运行 Render 部署工具
node deploy-render.js
```

## 🔍 故障排除

### 常见问题

#### 1. 构建失败
- 检查 Node.js 版本 (需要 18+)
- 查看构建日志中的错误信息
- 确保所有依赖都正确安装

#### 2. 数据库连接失败
- 检查 MongoDB URI 格式
- 确认数据库用户权限
- 检查网络连接

#### 3. CORS 错误
- 检查 CORS_ORIGIN 环境变量
- 确保前端 URL 正确
- 检查后端 CORS 配置

#### 4. 前端 API 调用失败
- 检查 VITE_API_BASE_URL 配置
- 确认后端服务正常运行
- 检查网络请求

### 获取帮助
- 查看 Render 文档: https://render.com/docs
- 检查项目日志
- 搜索相关错误信息

## 📊 性能优化

### 后端优化
- 启用 gzip 压缩
- 配置缓存策略
- 优化数据库查询

### 前端优化
- 启用 CDN
- 压缩静态资源
- 优化图片大小

## 💰 成本估算

### 免费方案
- 后端服务: 免费 (750小时/月)
- 前端服务: 免费 (100GB带宽/月)
- 数据库: 免费 (1GB存储)
- 总计: $0/月

### 付费方案
- 后端服务: $7/月 (无限时间)
- 前端服务: $7/月 (无限带宽)
- 数据库: $7/月 (1GB存储)
- 总计: $21/月

## 🎉 部署完成检查

- [ ] 后端 API 正常响应
- [ ] 前端页面正常访问
- [ ] 数据库连接正常
- [ ] 用户注册/登录功能正常
- [ ] HTTPS 证书有效
- [ ] 移动端适配正常

## 📞 技术支持

如果遇到问题：
1. 查看 Render 控制台日志
2. 检查环境变量配置
3. 参考项目文档
4. 寻求技术支持

---

**🎊 恭喜！你的 Bridge Project 现在已经成功部署到 Render 平台！**

访问你的应用，开始享受全栈部署的便利吧！
