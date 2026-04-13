import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

// 高德 POI 搜索 API 基础 URL
const GAODE_POI_URL = 'https://restapi.amap.com/v3/place/text'

/**
 * 高德 POI 文本搜索
 * @param {string} keywords 搜索关键词（如“咖啡”）
 * @param {string} city 城市（如“北京”）
 * @param {string} location 中心点经纬度 "lng,lat"（可选，用于周边搜索）
 * @returns {Promise<Array>} POI 列表
 */
async function searchPOI(keywords, city, location = null) {
  const params = {
    key: process.env.GAODE_API_KEY,
    keywords: keywords,
    city: city || '全国',
    types: '',        // 可选：指定POI类型代码
    offset: 20,       // 每页记录数
    page: 1,
    extensions: 'all' // 返回详细信息
  }
  if (location) {
    params.location = location
    params.radius = 2000  // 周边搜索半径（米）
    params.sortrule = 'distance'
  }
  
  try {
    const response = await axios.get(GAODE_POI_URL, { params })
    if (response.data.status === '1' && response.data.infocode === '10000') {
      return response.data.pois || []
    } else {
      console.error('高德 API 错误:', response.data.info)
      return []
    }
  } catch (error) {
    console.error('请求高德 API 失败:', error.message)
    return []
  }
}

// 前端调用接口：POST /api/poi/search
router.post('/poi/search', async (req, res) => {
  const { keyword, city, location } = req.body
  if (!keyword) {
    return res.status(400).json({ error: 'keyword 不能为空' })
  }
  const pois = await searchPOI(keyword, city, location)
  res.json({ pois })
})

export default router