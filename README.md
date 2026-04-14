
# 寻梦环游记智能旅游导览系统

一个基于 Vue 3 + Node.js 构建的智能旅游导览系统，结合了AI聊天功能和地图服务，为用户提供个性化的旅游规划和导览体验。

## 🌟 项目特色

- **智能AI聊天**：基于DeepSeek API的流式对话，支持多轮上下文理解
- **旅游规划**：智能生成旅游路线，推荐景点和周边设施
- **地图集成**：高德地图API集成，实现景点标记和导航
- **响应式设计**：现代化UI，适配不同设备尺寸
- **数据持久化**：本地存储聊天历史和用户偏好
- **实时流式输出**：AI回复逐字显示，提升用户体验
- **错误处理**：完善的网络错误提示和异常处理

## 🛠️ 技术栈

### 前端
- Vue 3 (Composition API)
- Vite 7
- Element Plus
- Pinia (状态管理)
- Vue Router
- Axios
- CSS3 (渐变和动画效果)

### 后端
- Node.js
- Express
- dotenv (环境变量管理)
- Cors (跨域支持)
- OpenAI SDK (API集成)
- WebSocket (实时通信)

### AI服务
- DeepSeek API

### 地图服务
- 高德地图API

## 📁 项目结构

```
├── backend/          # 后端服务
│   ├── index.js     # 主服务器文件
│   ├── deepseek.js  # DeepSeek API集成
│   ├── gaode-proxy.js # 高德地图代理
│   ├── package.json # 后端依赖
│   └── .env         # 环境变量配置
├── src/             # 前端代码
│   ├── components/  # 通用组件
│   │   ├── ChatWindow.vue  # 聊天窗口组件
│   │   ├── MapView.vue     # 地图组件
│   │   └── TodoItem.vue    # 待办事项组件
│   ├── views/       # 页面组件
│   │   ├── AIVIew.vue      # AI聊天页面
│   │   ├── TourGuideView.vue # 旅游导览页面
│   │   ├── MapInfoView.vue   # 地图信息页面
│   │   ├── TodoView.vue      # 待办事项页面
│   │   └── AboutView.vue     # 关于页面
│   ├── router/      # 路由配置
│   ├── stores/      # Pinia状态管理
│   │   ├── todo.js  # 待办事项状态
│   │   └── tour.js  # 旅游相关状态
│   ├── main.js      # 前端入口
│   └── App.vue      # 根组件
├── index.html       # HTML模板
├── package.json     # 前端依赖
└── vite.config.js   # Vite配置
```

## 🚀 快速开始

### 1. 前置条件

- Node.js 16+ 环境
- DeepSeek API 密钥
- 高德地图 API 密钥 (可选)
- Git

### 2. 克隆项目

```bash
git clone <repository-url>
cd AI-chat
```

### 3. 配置环境变量

在 `backend/` 目录下创建 `.env` 文件：

```env
# DeepSeek API密钥
API_KEY=your-deepseek-api-key

# 服务器端口
PORT=3000

# 高德地图API密钥（可选）
AMAP_KEY=your-amap-api-key
```

### 4. 安装依赖

#### 前端依赖
```bash
npm install
```

#### 后端依赖
```bash
cd backend
npm install
cd ..
```

### 5. 启动服务

#### 启动后端服务
```bash
cd backend
npm run dev
```

后端服务将运行在 `http://localhost:3000`

#### 启动前端服务
在新的终端窗口中：
```bash
npm run dev
```

前端应用将运行在 `http://localhost:5173`

### 6. 访问应用

打开浏览器访问 `http://localhost:5173`，即可开始使用智能旅游导览系统！

## 📖 功能使用指南

### AI聊天功能
1. 在聊天输入框中输入您的旅游需求
2. 点击发送按钮或按Enter键
3. 观看AI的实时流式回复
4. 点击停止按钮可中断AI生成
5. 聊天历史会自动保存

### 旅游规划功能
- **路线规划**：输入"我想去北京玩三天"获取详细行程
- **景点推荐**：输入"推荐一些历史文化景点"获取景点建议
- **周边搜索**：输入"找附近的餐厅"获取周边设施信息
- **导航功能**：输入"去故宫"获取导航路线

### 地图功能
- 查看景点位置标记
- 获取景点详细信息
- 支持地图缩放和拖动

## 🔧 核心功能实现

### 1. 流式AI对话
- 使用 AbortController 实现请求中断
- 基于 ReadableStream 处理流式响应
- 实时更新UI，逐字显示回复内容

### 2. 智能旅游规划
- 基于AI理解用户需求
- 结合地图数据提供精准推荐
- 支持多轮对话，持续优化推荐

### 3. 自动滚动
- 使用 Vue 3 watch 监听消息变化
- 结合 nextTick 实现平滑滚动
- 确保新消息总是可见

### 4. 数据持久化
- 使用 localStorage 存储聊天历史
- Pinia 状态管理，自动同步数据
- 页面刷新后自动恢复会话

### 5. 错误处理
- 网络错误捕获和提示
- 友好的用户反馈
- 系统稳定性保障

## 📱 界面特色

- **寻梦环游记主题**：金色万寿菊元素，温暖的色彩搭配
- **现代化设计**：渐变背景，流畅动画效果
- **响应式布局**：适配桌面和移动设备
- **直观的用户界面**：清晰的消息气泡，易于使用的控制按钮

## 🎨 技术亮点

- **Vue 3 Composition API**：更灵活的代码组织
- **Pinia 状态管理**：轻量级且强大的状态管理
- **流式API处理**：实时响应，提升用户体验
- **模块化设计**：清晰的代码结构，易于维护
- **组件化开发**：高复用性，降低代码冗余

## 🌐 部署建议

### 开发环境
- 使用 `npm run dev` 启动服务
- 前端支持热重载，开发体验流畅

### 生产环境
1. 构建前端生产版本：
```bash
npm run build
```

2. 配置Nginx反向代理：
```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /path/to/AI-chat/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 使用PM2管理后端进程：
```bash
cd backend
npm install pm2 -g
pm start
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: <repository-issues-url>
- 电子邮件: 1948739075@qq.com

---

**开启您的智能旅游之旅！** 🌟�