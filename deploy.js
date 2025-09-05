#!/usr/bin/env node

/**
 * Bridge Project 一体化部署脚本
 * 支持多种部署方式：Vercel、Railway、Docker
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

class DeployManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.backendPath = path.join(this.projectRoot, 'backend');
    this.frontendPath = path.join(this.projectRoot, 'frontend', 'bridge');
  }

  async start() {
    console.log('🚀 Bridge Project 一体化部署工具');
    console.log('=====================================\n');

    try {
      await this.checkRequirements();
      const deployType = await this.selectDeployType();
      await this.setupEnvironment();
      await this.executeDeployment(deployType);
      console.log('\n🎉 部署完成！');
    } catch (error) {
      console.error('\n❌ 部署失败:', error.message);
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
      console.log('⚠️  Git: 未安装 (某些部署方式需要)');
    }

    console.log('');
  }

  async selectDeployType() {
    console.log('请选择部署方式:');
    console.log('1. Vercel (推荐) - 全栈部署，免费');
    console.log('2. Railway - 全栈部署，简单');
    console.log('3. Docker - 本地/服务器部署');
    console.log('4. 传统服务器 - 手动部署指南');
    
    const choice = await question('\n请输入选择 (1-4): ');
    
    const options = {
      '1': 'vercel',
      '2': 'railway', 
      '3': 'docker',
      '4': 'manual'
    };

    if (!options[choice]) {
      throw new Error('无效选择');
    }

    return options[choice];
  }

  async setupEnvironment() {
    console.log('\n🔧 配置环境...');

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
    
    const mongodbUri = await question('MongoDB Atlas 连接字符串 (或按回车使用本地): ');
    const jwtSecret = await question('JWT 密钥 (或按回车自动生成): ');
    
    const envContent = `NODE_ENV=production
PORT=3000
MONGODB_URI=${mongodbUri || 'mongodb://localhost:27017/ticket_booking'}
JWT_SECRET=${jwtSecret || this.generateJWTSecret()}
CORS_ORIGIN=https://your-frontend-domain.vercel.app`;

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
    
    const envContent = `VITE_API_BASE_URL=${apiUrl || 'https://your-backend.vercel.app'}
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

  async executeDeployment(type) {
    switch (type) {
      case 'vercel':
        await this.deployToVercel();
        break;
      case 'railway':
        await this.deployToRailway();
        break;
      case 'docker':
        await this.deployWithDocker();
        break;
      case 'manual':
        await this.showManualGuide();
        break;
    }
  }

  async deployToVercel() {
    console.log('\n🚀 部署到 Vercel...');
    
    // 检查是否安装了 Vercel CLI
    try {
      execSync('vercel --version', { encoding: 'utf8' });
    } catch {
      console.log('📦 安装 Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // 创建 Vercel 配置文件
    this.createVercelConfigs();
    
    console.log('\n📋 Vercel 部署步骤:');
    console.log('1. 登录 Vercel: vercel login');
    console.log('2. 部署后端: cd backend && vercel --prod');
    console.log('3. 部署前端: cd frontend/bridge && vercel --prod');
    console.log('4. 在 Vercel 控制台配置环境变量');
    
    const proceed = await question('\n是否现在开始部署? (y/N): ');
    if (proceed.toLowerCase() === 'y') {
      await this.runVercelDeploy();
    }
  }

  async deployToRailway() {
    console.log('\n🚀 部署到 Railway...');
    
    console.log('\n📋 Railway 部署步骤:');
    console.log('1. 访问 https://railway.app');
    console.log('2. 连接 GitHub 仓库');
    console.log('3. 创建两个服务: 后端和前端');
    console.log('4. 配置环境变量');
    console.log('5. 部署');
    
    console.log('\n🔗 有用的链接:');
    console.log('- Railway: https://railway.app');
    console.log('- 文档: https://docs.railway.app');
  }

  async deployWithDocker() {
    console.log('\n🐳 使用 Docker 部署...');
    
    // 创建 Docker 配置文件
    this.createDockerConfigs();
    
    console.log('\n📋 Docker 部署命令:');
    console.log('1. 构建并启动: docker-compose up -d');
    console.log('2. 查看日志: docker-compose logs -f');
    console.log('3. 停止服务: docker-compose down');
    
    const proceed = await question('\n是否现在启动 Docker 服务? (y/N): ');
    if (proceed.toLowerCase() === 'y') {
      execSync('docker-compose up -d', { stdio: 'inherit' });
      console.log('✅ Docker 服务已启动');
    }
  }

  async showManualGuide() {
    console.log('\n📖 手动部署指南:');
    console.log('=====================================');
    console.log('1. 准备服务器 (阿里云/腾讯云/华为云)');
    console.log('2. 安装 Node.js 和 PM2');
    console.log('3. 配置 Nginx 反向代理');
    console.log('4. 设置 MongoDB 数据库');
    console.log('5. 配置 SSL 证书');
    console.log('6. 部署应用');
    console.log('\n详细步骤请查看项目文档');
  }

  createVercelConfigs() {
    // 后端 Vercel 配置
    const backendVercel = {
      version: 2,
      builds: [{ src: "index.js", use: "@vercel/node" }],
      routes: [{ src: "/(.*)", dest: "index.js" }]
    };
    
    fs.writeFileSync(
      path.join(this.backendPath, 'vercel.json'),
      JSON.stringify(backendVercel, null, 2)
    );

    // 前端 Vercel 配置
    const frontendVercel = {
      version: 2,
      builds: [{
        src: "package.json",
        use: "@vercel/static-build",
        config: { distDir: "dist" }
      }],
      routes: [{ src: "/(.*)", dest: "/index.html" }]
    };
    
    fs.writeFileSync(
      path.join(this.frontendPath, 'vercel.json'),
      JSON.stringify(frontendVercel, null, 2)
    );

    console.log('✅ Vercel 配置文件已创建');
  }

  createDockerConfigs() {
    // Docker Compose 配置
    const dockerCompose = `version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - MONGODB_URI=\${MONGODB_URI}
      - JWT_SECRET=\${JWT_SECRET}
    depends_on: [mongodb]
    restart: unless-stopped

  frontend:
    build: ./frontend/bridge
    ports: ["80:80"]
    depends_on: [backend]
    restart: unless-stopped

  mongodb:
    image: mongo:7.0
    ports: ["27017:27017"]
    volumes: [mongodb_data:/data/db]
    environment:
      - MONGO_INITDB_ROOT_USERNAME=\${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=\${MONGO_ROOT_PASSWORD}
    restart: unless-stopped

volumes:
  mongodb_data:`;

    fs.writeFileSync('docker-compose.yml', dockerCompose);

    // 环境变量模板
    const envTemplate = `MONGODB_URI=mongodb://mongodb:27017/ticket_booking
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
JWT_SECRET=${this.generateJWTSecret()}`;

    fs.writeFileSync('.env', envTemplate);

    console.log('✅ Docker 配置文件已创建');
  }

  async runVercelDeploy() {
    try {
      console.log('🔐 登录 Vercel...');
      execSync('vercel login', { stdio: 'inherit' });
      
      console.log('🚀 部署后端...');
      execSync('vercel --prod', { cwd: this.backendPath, stdio: 'inherit' });
      
      console.log('🚀 部署前端...');
      execSync('vercel --prod', { cwd: this.frontendPath, stdio: 'inherit' });
      
      console.log('✅ 部署完成！');
    } catch (error) {
      console.error('❌ 部署失败:', error.message);
    }
  }

  generateJWTSecret() {
    return require('crypto').randomBytes(64).toString('hex');
  }
}

// 启动部署工具
if (require.main === module) {
  new DeployManager().start();
}

module.exports = DeployManager;
