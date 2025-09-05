# Bridge Project

## 项目说明
这是一个前后端分离的项目，包含Vue.js前端和Express.js后端。

## 环境设置

### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件：
```bash
# 复制示例文件
cp .env.example .env

# 或者手动创建 .env 文件
```

4. 编辑 `.env` 文件，添加你的MongoDB连接字符串：
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

5. 启动后端服务：
```bash
npm run dev
```

### 前端设置

1. 进入前端目录：
```bash
cd frontend/bridge
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## MongoDB 存储选项

### 1. MongoDB Atlas (推荐用于生产环境)
- **优点**: 云端托管，自动备份，高可用性
- **免费层**: 512MB存储空间
- **设置步骤**:
  1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas)
  2. 创建免费账户
  3. 创建集群
  4. 获取连接字符串
  5. 在 `.env` 文件中配置 `MONGODB_URI`

### 2. 本地MongoDB
- **优点**: 完全控制，无网络延迟
- **缺点**: 需要自己管理备份和更新
- **设置步骤**:
  1. 下载并安装 [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  2. 启动MongoDB服务
  3. 使用默认连接字符串: `mongodb://localhost:27017/ticket_booking`

### 3. Docker MongoDB
- **优点**: 容器化，易于部署
- **设置步骤**:
```bash
# 运行MongoDB容器
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 连接字符串
mongodb://localhost:27017/ticket_booking
```

## 部署到GitHub

### 1. 初始化Git仓库
```bash
git init
```

### 2. 添加文件到Git
```bash
git add .
git commit -m "Initial commit"
```

### 3. 创建GitHub仓库
1. 访问 [GitHub](https://github.com)
2. 点击 "New repository"
3. 输入仓库名称
4. 选择公开或私有
5. **不要**勾选 "Add a README file"

### 4. 连接本地仓库到GitHub
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## 安全注意事项

⚠️ **重要**: 永远不要将包含密码的 `.env` 文件提交到Git仓库！

- `.env` 文件已添加到 `.gitignore`
- 使用 `.env.example` 作为模板
- 在生产环境中使用环境变量或密钥管理服务

## 项目结构

```
Bridege/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── index.js
│   └── package.json
├── frontend/
│   └── bridge/
├── .gitignore
└── README.md
```

