# 寻梦环游记智能旅游导览系统 - 后端服务

一个基于 Node.js 和 Express 构建的智能旅游导览后端服务，集成了 DeepSeek API 和高德地图 API，为前端应用提供 AI 聊天和地图服务。

## 🚀 功能特性

- ✅ **AI 聊天接口**：兼容 OpenAI API 格式，支持流式和非流式对话
- ✅ **DeepSeek API 集成**：使用先进的大语言模型提供智能旅游建议
- ✅ **高德地图代理**：处理地图相关请求，提供景点信息和导航
- ✅ **环境变量配置**：安全管理 API 密钥
- ✅ **跨域支持**：允许前端应用跨域访问
- ✅ **错误处理**：完善的异常捕获和友好的错误提示
- ✅ **实时流式响应**：支持 AI 回复的逐字显示

## 🛠️ 技术栈

- Node.js
- Express
- dotenv (环境变量管理)
- cors (跨域支持)
- OpenAI SDK (API 集成)
- WebSocket (实时通信)

## 📁 项目结构

```
backend/
├── index.js          # 主服务器文件
├── deepseek.js       # DeepSeek API 集成
├── gaode-proxy.js    # 高德地图代理
├── package.json      # 项目依赖
├── package-lock.json # 依赖锁定
└── .env              # 环境变量配置
```

## 🔧 安装和配置

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

在 `backend/` 目录下创建 `.env` 文件：

```env
# DeepSeek API 密钥
API_KEY=your-deepseek-api-key

# 服务器端口
PORT=3000

# 高德地图 API 密钥（可选）
AMAP_KEY=your-amap-api-key
```

**注意事项：**
- `API_KEY` 需要从 DeepSeek 官方获取
- `AMAP_KEY` 需要从高德地图开放平台获取（可选）

### 3. 启动服务

```bash
# 开发模式启动
npm run dev

# 生产模式启动
npm start
```

服务将在 `http://localhost:3000` 启动

## 📡 API 接口说明

### 1. AI 聊天接口

```
POST /api/chat
```

**请求参数：**

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| messages | Array | 是 | 对话消息列表 |
| stream | Boolean | 否 | 是否使用流式输出（默认：false） |
| temperature | Number | 否 | 温度参数（默认：0.7） |
| max_tokens | Number | 否 | 最大生成token数（默认：4000） |

**请求示例：**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "我想去北京玩三天，推荐一下行程"
    }
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 4000
}
```

**非流式响应示例：**

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1704386814,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "北京三日游行程推荐：..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 500,
    "total_tokens": 520
  }
}
```

**流式响应示例：**

```
data: {"id":"chatcmpl-123","object":"chat.completion","created":1704386814,"model":"deepseek-chat","choices":[{"index":0,"delta":{"role":"assistant","content":"北京"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion","created":1704386814,"model":"deepseek-chat","choices":[{"index":0,"delta":{"content":"三日游"},"finish_reason":null}]}

data: [DONE]
```

### 2. 健康检查接口

```
GET /health
```

**响应示例：**

```json
{
  "status": "ok",
  "message": "AI Chat API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3. 地图服务接口

```
GET /api/map/search
```

**查询参数：**
- `keyword`：搜索关键词（如"故宫"）
- `city`：城市名称（如"北京"）

**响应示例：**

```json
{
  "status": "ok",
  "data": [
    {
      "name": "故宫博物院",
      "location": {
        "lat": 39.916345,
        "lng": 116.397155
      },
      "address": "北京市东城区景山前街4号",
      "rating": 4.8
    }
  ]
}
```

## 💡 核心功能实现

### 1. 流式对话处理
- 使用 Express 处理 HTTP 请求
- 通过 ReadableStream 处理流式响应
- 支持 AbortController 中断请求

### 2. AI 旅游规划
- 基于 DeepSeek API 理解用户旅游需求
- 智能生成个性化旅游路线
- 结合地图数据提供精准推荐

### 3. 地图服务集成
- 高德地图 API 代理
- 景点搜索和信息获取
- 导航路线规划

## 🔍 开发和调试

### 查看日志

服务器运行时会输出详细的日志信息，包括：
- 请求参数和响应状态
- API 调用详情
- 错误信息和处理

### 测试 API

可以使用 curl 或 Postman 等工具测试 API：

```bash
# 测试 AI 聊天（流式）
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages": [{"role": "user", "content": "你好，推荐一些北京的景点"}], "stream": true}'

# 测试健康检查
curl http://localhost:3000/health

# 测试地图搜索
curl "http://localhost:3000/api/map/search?keyword=故宫&city=北京"
```

## 🛡️ 安全注意事项

1. **API 密钥管理**：使用环境变量存储 API 密钥，不要硬编码在代码中
2. **CORS 配置**：生产环境中建议限制允许的域名
3. **请求验证**：添加请求参数验证，防止恶意请求
4. **错误处理**：不要在响应中暴露敏感的错误信息
5. **依赖更新**：定期更新依赖包，修复安全漏洞

## 🚀 部署建议

### 开发环境
- 使用 `npm run dev` 启动服务
- 支持热重载，开发体验流畅

### 生产环境
1. **使用 PM2 管理进程**：
   ```bash
   npm install pm2 -g
   pm2 start index.js --name "tour-guide-backend"
   ```

2. **配置 Nginx 反向代理**：
   ```nginx
   server {
       listen 80;
       server_name api.example.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **启用 HTTPS**：使用 Let's Encrypt 获取免费 SSL 证书

## 🌟 未来改进计划

- [ ] 添加更多 AI 模型支持（如 GPT-4、Claude 等）
- [ ] 实现用户认证和会话管理
- [ ] 添加请求缓存机制，提升性能
- [ ] 支持更多地图服务和功能
- [ ] 增加 API 文档页面（使用 Swagger）
- [ ] 实现请求频率限制，防止滥用

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: <repository-issues-url>
- 电子邮件: 1948739075@qq.com

---

**为智能旅游导览系统提供强大的后端支持！** 🤖🗺️