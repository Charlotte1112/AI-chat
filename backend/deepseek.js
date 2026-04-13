import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import { searchPOI } from './gaode-proxy.js'  // 复用上面的搜索函数
dotenv.config()

const router = express.Router()

const SYSTEM_PROMPT = `你是一个地图助手，能够帮助用户查找地点、控制地图。如果用户询问附近的地点或搜索某个类型的POI（如“咖啡馆”、“加油站”），你需要返回一个包含搜索指令的JSON。格式如下：
{
  "reply": "自然语言回复",
  "action": {
    "type": "searchPOI",
    "keyword": "搜索关键词",
    "city": "城市名称（可选）",
    "location": "中心点经纬度 lng,lat（可选，如当前地图中心）"
  }
}
如果用户只是询问某个地点的位置（如“天安门在哪里”），返回 flyTo 动作（与之前相同）。
如果用户闲聊，只返回 reply，不返回 action。

示例：
用户：附近有什么好吃的？
返回：{"reply": "正在为您搜索附近的美食", "action": {"type": "searchPOI", "keyword": "美食", "location": "116.397428,39.90923"}}
用户：北京的故宫在哪里？
返回：{"reply": "故宫位于北京市东城区", "action": {"type": "flyTo", "coordinates": [116.397428,39.90923], "zoom": 14}}
用户：你好
返回：{"reply": "你好！我可以帮你查找地点，试试说“附近的咖啡馆”"}`

router.post('/chat', async (req, res) => {
  const { message, currentLocation } = req.body  // currentLocation 为可选，前端可传当前地图中心
  if (!message) {
    return res.status(400).json({ error: '消息不能为空' })
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    )

    let aiContent = response.data.choices[0].message.content
    // 提取 JSON
    let parsed
    try {
      parsed = JSON.parse(aiContent)
    } catch (e) {
      const match = aiContent.match(/\{.*\}/s)
      if (match) parsed = JSON.parse(match[0])
      else throw new Error('非JSON')
    }

    let result = { reply: parsed.reply, action: parsed.action || null }

    // 如果 action 是 searchPOI，实际调用高德 API 获取 POI 数据，并附加到返回中
    if (result.action && result.action.type === 'searchPOI') {
      const { keyword, city, location } = result.action
      // 如果前端没有传 currentLocation，使用 action 中的 location 或默认坐标
      const searchLocation = location || currentLocation
      const pois = await searchPOI(keyword, city, searchLocation)
      result.action.pois = pois   // 把 POI 列表附加到 action 中返回给前端
    }

    res.json(result)
  } catch (error) {
    console.error('DeepSeek 错误:', error.message)
    res.status(500).json({ error: 'AI 服务出错', reply: '抱歉，出错了，请稍后重试。' })
  }
})

export default router