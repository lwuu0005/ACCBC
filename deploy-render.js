#!/usr/bin/env node

/**
 * Bridge Project Render 部署脚本
 * 自动化部署到 Render 平台
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

class RenderDeployer {
  constructor() {
    this.projectRoot = process.cwd();
    this.backendPath = path.join(this.projectRoot, 'backend');
    this.frontendPath = path.join(this.projectRoot, 'frontend', 'bridge');
  }

  async start() {
    console.log('🚀 Bridge Project Render 部署工具');
    console.log('=====================================\n');

    try {
      await this.checkRequirements();
      await this.setupEnvironment();
      await this.prepareForRender();
      await this.showDeploymentSteps();
      console.log('\n🎉 准备完成！');
    } catch (error) {
      console.error('\n❌ 准备失败:', error.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  async checkRequirements() {
    console.log('🔍 检查系统要求...');
    
    // 检查 Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      console.log(`✅ Node.js: ${nodeVersion}`);
    } catch {
      throw new Error('请先安装 Node.js (https://nodejs.org)');
    }

    // 检查 npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log(`✅ npm: ${npmVersion}`);
    } catch {
      throw new Error('请先安装 npm');
    }

    // 检查 Git
    try {
      execSync('git --version', { encoding: 'utf8' });
      console.log('✅ Git: 已安装');
    } catch {
      throw new Error('请先安装 Git (https://git-scm.com)');
    }

    console.log('');
  }

  async setupEnvironment() {
    console.log('🔧 配置环境变量...');

    // 设置后端环境变量
    await this.setupBackendEnv();
    
    // 设置前端环境变量
    await this.setupFrontendEnv();
    
    // 安装依赖
    await this.installDependencies();
  }

  async setupBackendEnv() {
    const envPath = path.join(this.backendPath, '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ 后端环境变量已存在');
      return;
    }

    console.log('📝 配置后端环境变量...');
    
    const mongodbUri = await question('MongoDB Atlas 连接字符串 (推荐) 或按回车使用 Render 数据库: ');
    const jwtSecret = await question('JWT 密钥 (或按回车自动生成): ');
    
    const envContent = `NODE_ENV=production
PORT=3000
MONGODB_URI=${mongodbUri || 'mongodb://localhost:27017/ticket_booking'}
JWT_SECRET=${jwtSecret || this.generateJWTSecret()}
CORS_ORIGIN=https://your-frontend-domain.onrender.com`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ 后端环境变量已创建');
  }

  async setupFrontendEnv() {
    const envPath = path.join(this.frontendPath, '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ 前端环境变量已存在');
      return;
    }

    console.log('📝 配置前端环境变量...');
    
    const apiUrl = await question('后端 API 地址 (或按回车使用默认): ');
    
    const envContent = `VITE_API_BASE_URL=${apiUrl || 'https://your-backend.onrender.com'}
VITE_APP_NAME=Bridge Project
VITE_APP_VERSION=1.0.0`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ 前端环境变量已创建');
  }

  async installDependencies() {
    console.log('📦 安装依赖...');
    
    // 安装后端依赖
    console.log('  安装后端依赖...');
    execSync('npm install', { cwd: this.backendPath, stdio: 'inherit' });
    
    // 安装前端依赖
    console.log('  安装前端依赖...');
    execSync('npm install', { cwd: this.frontendPath, stdio: 'inherit' });
    
    console.log('✅ 依赖安装完成');
  }

  async prepareForRender() {
    console.log('🔧 准备 Render 部署配置...');

    // 确保 render.yaml 存在
    if (!fs.existsSync('render.yaml')) {
      console.log('❌ 未找到 render.yaml 文件');
      return;
    }

    // 创建 .gitignore 更新
    await this.updateGitignore();

    // 创建部署脚本
    await this.createDeployScripts();

    console.log('✅ Render 配置准备完成');
  }

  async updateGitignore() {
    const gitignorePath = '.gitignore';
    let gitignoreContent = '';

    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    const additions = `
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/

# Logs
*.log
npm-debug.log*

# OS generated files
.DS_Store
Thumbs.db
`;

    if (!gitignoreContent.includes('.env')) {
      gitignoreContent += additions;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ .gitignore 已更新');
    }
  }

  async createDeployScripts() {
    // 创建 package.json 根配置
    const packageJson = {
      name: "bridge-project",
      version: "1.0.0",
      description: "Bridge Project - 前后端分离的票务预订系统",
      scripts: {
        "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
        "dev:backend": "cd backend && npm run dev",
        "dev:frontend": "cd frontend/bridge && npm run dev",
        "build": "npm run build:frontend",
        "build:frontend": "cd frontend/bridge && npm run build",
        "install:all": "npm install && cd backend && npm install && cd ../frontend/bridge && npm install",
        "render:deploy": "echo '请按照部署指南在 Render 控制台部署'",
        "render:setup": "node deploy-render.js"
      },
      keywords: ["vue", "express", "mongodb", "ticket-booking", "fullstack"],
      author: "Your Name",
      license: "MIT",
      devDependencies: {
        "concurrently": "^8.2.2"
      },
      engines: {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json 已创建');
  }

  async showDeploymentSteps() {
    console.log('\n📋 Render 部署步骤:');
    console.log('=====================================');
    console.log('');
    console.log('1. 🌐 访问 Render 平台');
    console.log('   链接: https://render.com');
    console.log('   注册/登录账户');
    console.log('');
    console.log('2. 📤 推送代码到 GitHub');
    console.log('   git add .');
    console.log('   git commit -m "准备 Render 部署"');
    console.log('   git push origin main');
    console.log('');
    console.log('3. 🚀 在 Render 创建服务');
    console.log('   a) 点击 "New +" -> "Web Service"');
    console.log('   b) 连接 GitHub 仓库');
    console.log('   c) 选择仓库和分支');
    console.log('   d) 配置服务设置:');
    console.log('      - Name: bridge-backend');
    console.log('      - Environment: Node');
    console.log('      - Build Command: cd backend && npm install');
    console.log('      - Start Command: cd backend && npm start');
    console.log('      - Plan: Free');
    console.log('');
    console.log('4. ⚙️ 配置环境变量');
    console.log('   在 Render 控制台添加以下环境变量:');
    console.log('   - NODE_ENV: production');
    console.log('   - PORT: 3000');
    console.log('   - MONGODB_URI: 你的 MongoDB 连接字符串');
    console.log('   - JWT_SECRET: 你的 JWT 密钥');
    console.log('   - CORS_ORIGIN: https://your-frontend.onrender.com');
    console.log('');
    console.log('5. 🎨 部署前端');
    console.log('   a) 再次点击 "New +" -> "Static Site"');
    console.log('   b) 连接同一个 GitHub 仓库');
    console.log('   c) 配置前端设置:');
    console.log('      - Name: bridge-frontend');
    console.log('      - Build Command: cd frontend/bridge && npm install && npm run build');
    console.log('      - Publish Directory: frontend/bridge/dist');
    console.log('      - Plan: Free');
    console.log('');
    console.log('6. 🔗 配置前端环境变量');
    console.log('   在前端服务中添加:');
    console.log('   - VITE_API_BASE_URL: https://your-backend.onrender.com');
    console.log('   - VITE_APP_NAME: Bridge Project');
    console.log('   - VITE_APP_VERSION: 1.0.0');
    console.log('');
    console.log('7. 🎉 完成部署');
    console.log('   等待构建完成，访问你的应用！');
    console.log('');
    console.log('🔗 有用的链接:');
    console.log('- Render 平台: https://render.com');
    console.log('- MongoDB Atlas: https://www.mongodb.com/atlas');
    console.log('- 项目文档: README.md');
  }

  generateJWTSecret() {
    return require('crypto').randomBytes(64).toString('hex');
  }
}

// 启动部署工具
if (require.main === module) {
  new RenderDeployer().start();
}

module.exports = RenderDeployer;
