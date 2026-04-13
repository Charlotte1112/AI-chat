<template>
  <div class="tour-guide-container">
    <!-- 左侧景点列表 -->
    <div class="left-sidebar" :style="{ width: leftWidth + 'px' }">
      <div class="sidebar-header">
        <h3>推荐景点</h3>
        <div class="coco-decoration">💀🎸</div>
      </div>
      <div class="attractions-list">
        <div 
          v-for="attraction in attractions" 
          :key="attraction.id"
          class="attraction-item"
          :class="{ 'no-location': !attraction.location }"
        >
          <div class="attraction-name">
            {{ attraction.name }}
            <span v-if="!attraction.location" class="location-warning" title="无法定位">⚠️</span>
          </div>
          <div class="attraction-desc">{{ attraction.description }}</div>
          <div class="attraction-actions">
            <button class="action-btn" @click="goToAttraction(attraction)" title="导航">📍</button>
            <button class="action-btn" @click="addToTodo(attraction)" title="添加到心愿清单">➕</button>
          </div>
        </div>
        <div v-if="attractions.length === 0" class="empty-tip">
          暂无推荐景点，请与AI助手对话获取推荐
        </div>
      </div>
      <!-- 左侧拖拽手柄 -->
      <div 
        class="resize-handle resize-handle-right"
        @mousedown="startResizeLeft"
      ></div>
    </div>

    <!-- 中间地图区 -->
    <div class="map-container">
      <div id="tour-map" ref="mapRef"></div>
    </div>

    <!-- 右侧聊天窗口 -->
    <div class="right-sidebar" :style="{ width: rightWidth + 'px' }">
      <div class="chat-header">
        <h3>智能导览助手</h3>
        <div class="coco-decoration">🎵🌸</div>
      </div>
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.type">
          <div class="message-content">
            <div class="message-sender">{{ msg.type === 'user' ? '您' : '助手' }}</div>
            <div class="message-text">{{ msg.content }}</div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input 
          v-model="inputMessage" 
          type="text" 
          placeholder="输入指令，例如：我想去北京玩三天、推荐一些历史文化景点、把故宫添加到心愿清单"
          @keyup.enter="sendMessage"
        />
        <button 
          @click="sendMessage" 
          :disabled="isLoading"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
      <!-- 右侧拖拽手柄 -->
      <div 
        class="resize-handle resize-handle-left"
        @mousedown="startResizeRight"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useTodoStore } from '../stores/todo'
import { useTourStore } from '../stores/tour'

export default {
  setup() {
    const todoStore = useTodoStore()
    const tourStore = useTourStore()
    const mapRef = ref(null)
    const map = ref(null)
    const markers = ref([])
    const polyline = ref(null)
    const distanceLabels = ref([])
    const inputMessage = ref('')
    const isLoading = ref(false)
    
    // 使用storeToRefs获取store中的响应式状态
    const { messages, attractions, currentCity, currentProvince, conversationHistory } = storeToRefs(tourStore)
    
    // 添加到待办列表
    const addToTodo = (attraction) => {
      const todoText = `去${attraction.name}旅游 - ${attraction.description}`
      todoStore.addTodo(todoText)
      tourStore.addMessage({ 
        type: 'assistant', 
        content: `已将 ${attraction.name} 添加到心愿清单` 
      })
    }
    
    // 布局宽度
    const leftWidth = ref(250)
    const rightWidth = ref(300)
    const isResizing = ref(false)
    const resizeType = ref(null)
    
    // 开始调整左侧宽度
    const startResizeLeft = (e) => {
      isResizing.value = true
      resizeType.value = 'left'
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      e.preventDefault()
    }
    
    // 开始调整右侧宽度
    const startResizeRight = (e) => {
      isResizing.value = true
      resizeType.value = 'right'
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
      e.preventDefault()
    }
    
    // 处理拖拽
    const handleResize = (e) => {
      if (!isResizing.value) return
      
      if (resizeType.value === 'left') {
        const newWidth = e.clientX
        if (newWidth >= 200 && newWidth <= 400) {
          leftWidth.value = newWidth
        }
      } else if (resizeType.value === 'right') {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth >= 250 && newWidth <= 500) {
          rightWidth.value = newWidth
        }
      }
      
      // 触发地图重新调整大小
      if (map.value) {
        map.value.resize()
      }
    }
    
    // 停止调整
    const stopResize = () => {
      isResizing.value = false
      resizeType.value = null
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }

    // 初始化地图
    const initMap = async () => {
      try {
        console.log('开始初始化地图...')
        
        // 设置安全密钥
        window._AMapSecurityConfig = {
          securityJsCode: '9df3343dead5783221c252e9e268745c'
        }
        
        // 加载高德地图API
        const AMap = await AMapLoader.load({
          key: 'e799cf6e6e0203b12bb0150a495dab3d',
          version: '2.0',
          plugins: ['AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.DistrictSearch', 'AMap.GeometryUtil']
        })
        
        console.log('地图API加载成功')
        window.AMap = AMap
        
        // 创建地图实例
        map.value = new AMap.Map('tour-map', {
          center: [116.397428, 39.90923],
          zoom: 12
        })
        
        console.log('地图实例创建成功')
      } catch (error) {
        console.error('地图初始化失败:', error)
      }
    }

    // 创建带数字的自定义标记
    const createNumberedMarker = (position, number, title) => {
      // 创建自定义图标
      const markerContent = `
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
        ">
          <div style="
            position: absolute;
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            border: 3px solid white;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 16px;
            z-index: 1;
          ">${number}</div>
        </div>
      `
      
      const marker = new window.AMap.Marker({
        position: position,
        content: markerContent,
        offset: new window.AMap.Pixel(-18, -36),
        title: title
      })
      
      return marker
    }

    // 计算两点之间的距离（米）
    const calculateDistance = (point1, point2) => {
      const lng1 = point1[0]
      const lat1 = point1[1]
      const lng2 = point2[0]
      const lat2 = point2[1]
      
      const distance = window.AMap.GeometryUtil.distance(
        new window.AMap.LngLat(lng1, lat1),
        new window.AMap.LngLat(lng2, lat2)
      )
      
      return distance
    }

    // 格式化距离显示
    const formatDistance = (distance) => {
      if (distance < 1000) {
        return `${Math.round(distance)}米`
      } else {
        return `${(distance / 1000).toFixed(1)}公里`
      }
    }

    // 绘制景点之间的连接线和距离标注
    const drawConnections = () => {
      // 清除之前的折线和距离标注
      if (polyline.value) {
        map.value.remove(polyline.value)
      }
      distanceLabels.value.forEach(label => map.value.remove(label))
      distanceLabels.value = []
      
      // 过滤出有位置的景点
      const validAttractions = attractions.value.filter(a => a.location)
      
      if (validAttractions.length < 2) return
      
      // 创建路径点数组
      const path = validAttractions.map(a => a.location)
      
      // 绘制折线
      polyline.value = new window.AMap.Polyline({
        path: path,
        strokeColor: '#FF6B6B',
        strokeWeight: 4,
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
        lineJoin: 'round',
        lineCap: 'round',
        showDir: true,
        dirColor: '#FF6B6B',
        dirImg: 'https://webapi.amap.com/images/dir-marker.png'
      })
      
      map.value.add(polyline.value)
      
      // 添加距离标注
      for (let i = 0; i < path.length - 1; i++) {
        const distance = calculateDistance(path[i], path[i + 1])
        const distanceText = formatDistance(distance)
        
        // 计算中点位置
        const midLng = (path[i][0] + path[i + 1][0]) / 2
        const midLat = (path[i][1] + path[i + 1][1]) / 2
        
        // 创建距离标注
        const labelContent = `
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            white-space: nowrap;
          ">
            ${distanceText}
          </div>
        `
        
        const label = new window.AMap.Marker({
          position: [midLng, midLat],
          content: labelContent,
          offset: new window.AMap.Pixel(-30, -10)
        })
        
        map.value.add(label)
        distanceLabels.value.push(label)
      }
    }

    // 更新地图标记
    const updateMapMarkers = () => {
      // 清除之前的标记
      markers.value.forEach(marker => map.value.remove(marker))
      markers.value = []
      
      // 过滤出有位置的景点
      const validAttractions = attractions.value.filter(a => a.location)
      
      // 添加带数字的标记
      validAttractions.forEach((attraction, index) => {
        const marker = createNumberedMarker(
          attraction.location,
          index + 1,
          attraction.name
        )
        map.value.add(marker)
        markers.value.push(marker)
      })
      
      // 绘制连接线和距离标注
      drawConnections()
      
      // 调整地图视野以包含所有标记
      if (validAttractions.length > 0) {
        map.value.setFitView()
      }
    }

    // 导航到景点
    const goToAttraction = (attraction) => {
      if (!map.value) {
        tourStore.addMessage({ type: 'assistant', content: '地图尚未初始化，请稍后再试' })
        return
      }
      
      if (!attraction.location) {
        tourStore.addMessage({ type: 'assistant', content: `抱歉，无法定位"${attraction.name}"的精确位置，可能该景点在地图数据库中不存在或位置信息不完整` })
        return
      }
      
      map.value.setCenter(attraction.location)
      map.value.setZoom(16)
      
      // 添加标记
      const marker = new window.AMap.Marker({
        position: attraction.location,
        title: attraction.name
      })
      map.value.add(marker)
      markers.value.push(marker)
      
      tourStore.addMessage({ type: 'assistant', content: `已为您导航到${attraction.name}` })
    }

    // 解析自然语言指令（流式输出）
    const parseIntentStream = async (message, history, onChunk) => {
      try {
        console.log('开始调用API...')
        
        // 构建消息数组，包含历史对话
        const messagesArray = [
          {
            role: 'system',
            content: `你是一个专业的旅游规划助手，能够根据用户的需求提供个性化的旅游规划建议。

重要：你必须按照以下格式返回内容：

第一部分：友好的文字回复（直接显示给用户）
[你的详细回复内容，可以是景点介绍、旅游建议等]

---JSON---
第二部分：JSON格式的指令（用于系统处理）
{
  "action": "动作类型",
  "attractions": [...],
  ...其他字段
}

动作类型说明：
- plan: 旅游规划
- recommend: 景点推荐
- navigate: 导航到景点
- search: 搜索周边设施
- addMarker: 添加标记
- detail: 景点详情
- addToTodo: 添加景点到心愿清单
- chat: 一般对话

JSON字段要求：
- attractions: 景点列表，每个景点必须包含name、description、city、province字段
- city: 准确的城市名称（县级市或县）
- province: 准确的省份名称
- 例如：甘肃省临洮县的景点，city填"临洮县"，province填"甘肃省"

示例输出：
推荐以下北京的历史文化景点：

1. 故宫博物院 - 明清两代皇家宫殿，世界文化遗产
2. 天坛公园 - 明清皇帝祭天的场所
3. 颐和园 - 清代皇家园林

这些景点都位于北京市内，交通便利，建议安排2-3天游览。

---JSON---
{
  "action": "recommend",
  "type": "历史文化",
  "attractions": [
    {"name": "故宫博物院", "description": "明清两代皇家宫殿", "city": "北京", "province": "北京市"},
    {"name": "天坛公园", "description": "明清皇帝祭天的场所", "city": "北京", "province": "北京市"},
    {"name": "颐和园", "description": "清代皇家园林", "city": "北京", "province": "北京市"}
  ]
}

注意：
- 第一部分的文字回复要详细、友好
- ---JSON---标记必须单独一行
- JSON部分要完整、格式正确
- 只推荐用户指定地区内的景点`
          },
          ...history, // 添加历史对话
          {
            role: 'user',
            content: message
          }
        ]
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-7023955465504970895a82e78e5fe5a6`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: messagesArray,
            temperature: 0.7,
            stream: true
          })
        })
        
        console.log('API响应状态:', response.status)
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''
        let jsonStarted = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          console.log('收到数据块:', chunk.substring(0, 100))
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0]?.delta?.content || ''
                if (content) {
                  fullContent += content
                  
                  // 检查是否遇到JSON标记
                  if (!jsonStarted && fullContent.includes('---JSON---')) {
                    jsonStarted = true
                  }
                  
                  // 只在遇到JSON标记之前流式输出
                  if (!jsonStarted) {
                    onChunk(content)
                  }
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        console.log('AI返回完整内容:', fullContent)

        // 提取JSON部分
        const jsonMatch = fullContent.match(/---JSON---\s*([\s\S]*)/)
        if (jsonMatch) {
          const jsonStr = jsonMatch[1].trim()
          console.log('提取的JSON:', jsonStr)
          
          try {
            const intent = JSON.parse(jsonStr)
            return intent
          } catch (parseError) {
            console.error('JSON解析失败:', parseError)
            return {
              action: 'chat',
              response: fullContent.split('---JSON---')[0].trim()
            }
          }
        } else {
          // 如果没有JSON标记，返回一般对话
          return {
            action: 'chat',
            response: fullContent
          }
        }
      } catch (error) {
        console.error('API调用失败:', error)
        console.error('错误堆栈:', error.stack)
        return {
          action: 'chat',
          response: '抱歉，我遇到了一些技术问题，请稍后再试。'
        }
      }
    }

    // 发送消息
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return
      
      const message = inputMessage.value.trim()
      console.log('发送消息:', message)
      
      tourStore.addMessage({ type: 'user', content: message })
      inputMessage.value = ''
      isLoading.value = true
      
      // 将用户消息添加到对话历史
      tourStore.addConversationHistory({
        role: 'user',
        content: message
      })
      
      // 创建一个空的助手消息用于流式输出
      const assistantMessage = { type: 'assistant', content: '' }
      tourStore.addMessage(assistantMessage)
      const messageIndex = messages.value.length - 1
      console.log('创建助手消息，索引:', messageIndex)
      
      try {
        // 调用API时传入对话历史
        let currentContent = ''
        const intent = await parseIntentStream(message, conversationHistory.value, (chunk) => {
          // 流式输出文字回复内容
          currentContent += chunk
          console.log('收到chunk:', chunk, '当前内容:', currentContent)
          tourStore.updateMessage(messageIndex, currentContent)
        })
        
        console.log('解析到的intent:', intent)
        
        if (intent) {
          // 将AI回复添加到对话历史（只保存文字部分，不保存JSON）
          const assistantReply = messages.value[messageIndex].content
          // 提取---JSON---之前的内容
          const textReply = assistantReply.split('---JSON---')[0].trim()
          tourStore.addConversationHistory({
            role: 'assistant',
            content: textReply
          })
          
          // 流式输出完成后，执行相应的操作
          switch (intent.action) {
            case 'plan':
              await handleTravelPlan(intent)
              break
            case 'recommend':
              await handleRecommend(intent)
              break
            case 'navigate':
              await navigateToLocation(intent.location, intent.description, intent.city, intent.province)
              break
            case 'search':
              await searchNearby(intent.keyword, intent.radius || 1000)
              break
            case 'addMarker':
              addMarkerAtCenter()
              break
            case 'detail':
              await showAttractionDetail(intent.location, intent.description, intent.city, intent.province)
              break
            case 'addToTodo':
              await handleAddToTodo(intent)
              break
            case 'chat':
              // 已经在上面显示了回复，不需要额外操作
              break
            default:
              if (!messages.value[messageIndex].content) {
                tourStore.updateMessage(messageIndex, '抱歉，我无法理解您的请求。')
              }
          }
        } else {
          tourStore.updateMessage(messageIndex, '抱歉，我遇到了一些问题，请稍后再试。')
        }
      } catch (error) {
        console.error('处理指令失败:', error)
        tourStore.updateMessage(messageIndex, '处理请求时出错，请重试。')
      } finally {
        isLoading.value = false
      }
    }

    // 处理旅游规划
    const handleTravelPlan = async (intent) => {
      if (intent.attractions && intent.attractions.length > 0) {
        // 清除之前的景点列表和标记
        tourStore.clearAttractions()
        markers.value.forEach(marker => map.value.remove(marker))
        markers.value = []
        if (polyline.value) {
          map.value.remove(polyline.value)
        }
        distanceLabels.value.forEach(label => map.value.remove(label))
        distanceLabels.value = []
        
        // 更新当前城市和省份
        if (intent.attractions[0].city) {
          tourStore.updateCity(intent.attractions[0].city, intent.attractions[0].province)
        }
        
        // 添加新的景点
        for (const attraction of intent.attractions) {
          await addAttractionToList(attraction.name, attraction.description, attraction.city, attraction.province)
        }
        
        // 更新地图标记（带数字和连接线）
        updateMapMarkers()
      } else if (intent.destination) {
        await navigateToLocation(intent.destination, '', intent.destination)
      }
    }

    // 处理添加到待办列表
    const handleAddToTodo = async (intent) => {
      if (intent.attractions && intent.attractions.length > 0) {
        for (const attraction of intent.attractions) {
          const todoText = `去${attraction.name}旅游 - ${attraction.description}`
          todoStore.addTodo(todoText)
        }
      }
    }

    // 处理景点推荐
    const handleRecommend = async (intent) => {
      if (intent.attractions && intent.attractions.length > 0) {
        // 清除之前的景点列表和标记
        tourStore.clearAttractions()
        markers.value.forEach(marker => map.value.remove(marker))
        markers.value = []
        if (polyline.value) {
          map.value.remove(polyline.value)
        }
        distanceLabels.value.forEach(label => map.value.remove(label))
        distanceLabels.value = []
        
        // 更新当前城市和省份
        if (intent.attractions[0].city) {
          tourStore.updateCity(intent.attractions[0].city, intent.attractions[0].province)
        }
        
        // 添加新的景点
        for (const attraction of intent.attractions) {
          await addAttractionToList(attraction.name, attraction.description, attraction.city, attraction.province)
        }
        
        // 更新地图标记（带数字和连接线）
        updateMapMarkers()
      }
    }

    // 验证POI是否在指定城市范围内
    const isPOIInCity = (poi, targetCity, targetProvince) => {
      if (!poi.pname || !poi.cityname || !poi.adname) {
        return false
      }
      
      // 检查省份
      const poiProvince = poi.pname.replace('省', '').replace('市', '')
      const targetProvinceClean = (targetProvince || '').replace('省', '').replace('市', '')
      
      if (targetProvince && poiProvince !== targetProvinceClean) {
        return false
      }
      
      // 检查城市/县
      const poiCity = poi.cityname.replace('市', '').replace('县', '')
      const poiAdname = poi.adname.replace('市', '').replace('县', '')
      const targetCityClean = (targetCity || '').replace('市', '').replace('县', '')
      
      return poiCity === targetCityClean || poiAdname === targetCityClean || 
             poi.cityname === targetCity || poi.adname === targetCity
    }

    // 使用精确的POI搜索添加景点到列表
    const addAttractionToList = async (name, description, city, province) => {
      return new Promise((resolve) => {
        const searchCity = city || currentCity.value
        const searchProvince = province || currentProvince.value
        console.log(`搜索景点: ${name}, 城市: ${searchCity}, 省份: ${searchProvince}`)
        
        window.AMap.plugin('AMap.PlaceSearch', function() {
          const placeSearch = new window.AMap.PlaceSearch({
            pageSize: 20,
            pageIndex: 1,
            extensions: 'all',
            city: searchCity,
            citylimit: true,
            type: '110100|110200|110300|110400|110500'
          })
          
          placeSearch.search(name, function(status, result) {
            console.log('POI搜索结果:', status, result)
            
            if (status === 'complete' && result.poiList && result.poiList.pois.length) {
              const pois = result.poiList.pois
              
              // 优先选择在指定城市范围内的景点
              let bestMatch = null
              for (const poi of pois) {
                console.log(`检查POI: ${poi.name}, 省份: ${poi.pname}, 城市: ${poi.cityname}, 区县: ${poi.adname}`)
                
                if (isPOIInCity(poi, searchCity, searchProvince)) {
                  if (poi.name === name || poi.name.includes(name) || name.includes(poi.name)) {
                    bestMatch = poi
                    break
                  }
                  if (!bestMatch) {
                    bestMatch = poi
                  }
                }
              }
              
              // 如果没有找到匹配的，选择第一个结果
              if (!bestMatch && pois.length > 0) {
                bestMatch = pois[0]
                // 再次验证是否在正确城市
                if (!isPOIInCity(bestMatch, searchCity, searchProvince)) {
                  console.log(`第一个结果不在指定城市: ${bestMatch.pname} ${bestMatch.cityname}`)
                  bestMatch = null
                }
              }
              
              if (bestMatch) {
                const position = bestMatch.location
                
                console.log(`找到景点: ${bestMatch.name}, 地址: ${bestMatch.address}, 坐标: ${position.lng}, ${position.lat}`)
                
                // 添加到景点列表
                tourStore.addAttraction({
                  name: bestMatch.name,
                  description: description || bestMatch.address || bestMatch.type,
                  location: [position.lng, position.lat],
                  address: bestMatch.address
                })
                
                resolve()
                return
              }
            }
            
            // 如果在城市限定下找不到，尝试使用省份+城市组合搜索
            console.log(`在城市${searchCity}未找到景点: ${name}，尝试组合搜索`)
            
            const fullLocation = searchProvince ? `${searchProvince}${searchCity}` : searchCity
            const placeSearchFull = new window.AMap.PlaceSearch({
              pageSize: 20,
              pageIndex: 1,
              extensions: 'all',
              city: fullLocation,
              citylimit: true,
              type: '110100|110200|110300|110400|110500'
            })
            
            placeSearchFull.search(name, function(status2, result2) {
              console.log('组合搜索结果:', status2, result2)
              
              if (status2 === 'complete' && result2.poiList && result2.poiList.pois.length) {
                const pois = result2.poiList.pois
                
                let bestMatch = null
                for (const poi of pois) {
                  console.log(`检查POI: ${poi.name}, 省份: ${poi.pname}, 城市: ${poi.cityname}, 区县: ${poi.adname}`)
                  
                  if (isPOIInCity(poi, searchCity, searchProvince)) {
                    if (poi.name === name || poi.name.includes(name) || name.includes(poi.name)) {
                      bestMatch = poi
                      break
                    }
                    if (!bestMatch) {
                      bestMatch = poi
                    }
                  }
                }
                
                if (!bestMatch && pois.length > 0) {
                  bestMatch = pois[0]
                  if (!isPOIInCity(bestMatch, searchCity, searchProvince)) {
                    console.log(`组合搜索第一个结果不在指定城市: ${bestMatch.pname} ${bestMatch.cityname}`)
                    bestMatch = null
                  }
                }
                
                if (bestMatch) {
                  const position = bestMatch.location
                  
                  console.log(`组合搜索找到景点: ${bestMatch.name}, 地址: ${bestMatch.address}`)
                  
                  tourStore.addAttraction({
                    name: bestMatch.name,
                    description: description || bestMatch.address || bestMatch.type,
                    location: [position.lng, position.lat],
                    address: bestMatch.address
                  })
                  
                  resolve()
                  return
                }
              }
              
              // 最后尝试地理编码
              console.log(`POI搜索失败，尝试地理编码: ${name}`)
              geocodeLocation(name, searchCity, searchProvince, description, resolve)
            })
          })
        })
      })
    }

    // 使用地理编码作为最后的备选方案
    const geocodeLocation = (name, city, province, description, resolve) => {
      const fullLocation = province ? `${province}${city}${name}` : `${city}${name}`
      
      window.AMap.plugin('AMap.Geocoder', function() {
        const geocoder = new window.AMap.Geocoder({
          city: city
        })
        
        geocoder.getLocation(fullLocation, function(status, result) {
          console.log('地理编码结果:', status, result)
          
          if (status === 'complete' && result.geocodes.length) {
            const geocode = result.geocodes[0]
            const position = geocode.location
            
            // 验证地理编码结果是否在正确城市
            const addressComponent = geocode.addressComponent
            if (addressComponent) {
              const geocodeCity = addressComponent.city || addressComponent.district
              const geocodeProvince = addressComponent.province
              
              const geocodeCityClean = geocodeCity.replace('市', '').replace('县', '')
              const cityClean = city.replace('市', '').replace('县', '')
              
              if (geocodeCityClean !== cityClean) {
                console.log(`地理编码结果不在指定城市: ${geocodeProvince} ${geocodeCity}`)
                tourStore.addAttraction({
                  name: name,
                  description: description || '暂无描述',
                  location: null
                })
                resolve()
                return
              }
            }
            
            console.log(`地理编码找到: ${name}, 坐标: ${position.lng}, ${position.lat}`)
            
            tourStore.addAttraction({
              name: name,
              description: description || geocode.formattedAddress || '暂无描述',
              location: [position.lng, position.lat],
              address: geocode.formattedAddress
            })
          } else {
            console.log(`无法找到景点位置：${name}`)
            tourStore.addAttraction({
              name: name,
              description: description || '暂无描述',
              location: null
            })
          }
          resolve()
        })
      })
    }

    // 显示景点详情
    const showAttractionDetail = async (location, description, city, province) => {
      await navigateToLocation(location, description, city, province)
    }

    // 使用精确的POI搜索导航到指定位置
    const navigateToLocation = async (location, description, city, province) => {
      return new Promise((resolve) => {
        const searchCity = city || currentCity.value
        const searchProvince = province || currentProvince.value
        console.log(`导航到景点: ${location}, 城市: ${searchCity}, 省份: ${searchProvince}`)
        
        window.AMap.plugin('AMap.PlaceSearch', function() {
          const placeSearch = new window.AMap.PlaceSearch({
            pageSize: 20,
            pageIndex: 1,
            extensions: 'all',
            city: searchCity,
            citylimit: true,
            type: '110100|110200|110300|110400|110500'
          })
          
          placeSearch.search(location, function(status, result) {
            console.log('导航POI搜索结果:', status, result)
            
            if (status === 'complete' && result.poiList && result.poiList.pois.length) {
              const pois = result.poiList.pois
              
              let bestMatch = null
              for (const poi of pois) {
                console.log(`检查POI: ${poi.name}, 省份: ${poi.pname}, 城市: ${poi.cityname}, 区县: ${poi.adname}`)
                
                if (isPOIInCity(poi, searchCity, searchProvince)) {
                  if (poi.name === location || poi.name.includes(location) || location.includes(poi.name)) {
                    bestMatch = poi
                    break
                  }
                  if (!bestMatch) {
                    bestMatch = poi
                  }
                }
              }
              
              if (!bestMatch && pois.length > 0) {
                bestMatch = pois[0]
                if (!isPOIInCity(bestMatch, searchCity, searchProvince)) {
                  console.log(`第一个结果不在指定城市: ${bestMatch.pname} ${bestMatch.cityname}`)
                  bestMatch = null
                }
              }
              
              if (bestMatch) {
                const position = bestMatch.location
                
                console.log(`导航到: ${bestMatch.name}, 地址: ${bestMatch.address}, 坐标: ${position.lng}, ${position.lat}`)
                
                map.value.setCenter([position.lng, position.lat])
                map.value.setZoom(16)
                
                const marker = new window.AMap.Marker({
                  position: [position.lng, position.lat],
                  title: bestMatch.name
                })
                map.value.add(marker)
                markers.value.push(marker)
                
                // 添加到景点列表（如果不存在）
                const exists = attractions.value.find(a => a.name === bestMatch.name)
                if (!exists) {
                  tourStore.addAttraction({
                    name: bestMatch.name,
                    description: description || bestMatch.address || bestMatch.type,
                    location: [position.lng, position.lat],
                    address: bestMatch.address
                  })
                }
                
                resolve()
                return
              }
            }
            
            // 如果在城市限定下找不到，尝试组合搜索
            const fullLocation = searchProvince ? `${searchProvince}${searchCity}` : searchCity
            const placeSearchFull = new window.AMap.PlaceSearch({
              pageSize: 20,
              pageIndex: 1,
              extensions: 'all',
              city: fullLocation,
              citylimit: true,
              type: '110100|110200|110300|110400|110500'
            })
            
            placeSearchFull.search(location, function(status2, result2) {
              if (status2 === 'complete' && result2.poiList && result2.poiList.pois.length) {
                const pois = result2.poiList.pois
                
                let bestMatch = null
                for (const poi of pois) {
                  if (isPOIInCity(poi, searchCity, searchProvince)) {
                    if (poi.name === location || poi.name.includes(location) || location.includes(poi.name)) {
                      bestMatch = poi
                      break
                    }
                    if (!bestMatch) {
                      bestMatch = poi
                    }
                  }
                }
                
                if (!bestMatch && pois.length > 0) {
                  bestMatch = pois[0]
                  if (!isPOIInCity(bestMatch, searchCity, searchProvince)) {
                    bestMatch = null
                  }
                }
                
                if (bestMatch) {
                  const position = bestMatch.location
                  
                  console.log(`组合搜索导航到: ${bestMatch.name}, 地址: ${bestMatch.address}`)
                  
                  map.value.setCenter([position.lng, position.lat])
                  map.value.setZoom(16)
                  
                  const marker = new window.AMap.Marker({
                    position: [position.lng, position.lat],
                    title: bestMatch.name
                  })
                  map.value.add(marker)
                  markers.value.push(marker)
                  
                  const exists = attractions.value.find(a => a.name === bestMatch.name)
                  if (!exists) {
                    tourStore.addAttraction({
                      name: bestMatch.name,
                      description: description || bestMatch.address || bestMatch.type,
                      location: [position.lng, position.lat],
                      address: bestMatch.address
                    })
                  }
                  
                  resolve()
                  return
                }
              }
              
              tourStore.addMessage({ type: 'assistant', content: `无法在${searchCity}找到地点：${location}` })
              resolve()
            })
          })
        })
      })
    }

    // 搜索周边设施
    const searchNearby = async (keyword, radius) => {
      return new Promise((resolve) => {
        // 清除之前的标记
        markers.value.forEach(marker => map.value.remove(marker))
        markers.value = []
        
        window.AMap.plugin('AMap.PlaceSearch', function() {
          const placeSearch = new window.AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
            extensions: 'all'
          })
          
          const center = map.value.getCenter()
          placeSearch.searchNearBy(keyword, center, radius, function(status, result) {
            if (status === 'complete' && result.poiList && result.poiList.pois.length) {
              const pois = result.poiList.pois
              
              // 清空景点列表，添加搜索结果
              tourStore.clearAttractions()
              
              pois.forEach(poi => {
                const marker = new window.AMap.Marker({
                  position: [poi.location.lng, poi.location.lat],
                  title: poi.name
                })
                map.value.add(marker)
                markers.value.push(marker)
                
                // 添加到景点列表
                tourStore.addAttraction({
                  name: poi.name,
                  description: poi.address || poi.type,
                  location: [poi.location.lng, poi.location.lat],
                  address: poi.address
                })
              })
              
              // 调整地图视野
              map.value.setFitView()
            } else {
              tourStore.addMessage({ type: 'assistant', content: `未找到附近的${keyword}` })
            }
            resolve()
          })
        })
      })
    }

    // 在地图中心添加标记
    const addMarkerAtCenter = () => {
      const center = map.value.getCenter()
      const marker = new window.AMap.Marker({
        position: center,
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(25, 34),
          image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_red.png',
          imageSize: new window.AMap.Size(25, 34)
        })
      })
      map.value.add(marker)
      markers.value.push(marker)
    }

    onMounted(() => {
      initMap()
    })

    return {
      mapRef,
      messages,
      inputMessage,
      isLoading,
      attractions,
      sendMessage,
      goToAttraction,
      leftWidth,
      rightWidth,
      startResizeLeft,
      startResizeRight,
      addToTodo
    }
  }
}
</script>

<style scoped>
.tour-guide-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-sidebar {
  background: linear-gradient(180deg, rgba(45, 27, 105, 0.95) 0%, rgba(26, 15, 61, 0.95) 100%);
  border-right: 2px solid rgba(255, 184, 77, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 200px;
  max-width: 400px;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 2px solid rgba(255, 184, 77, 0.3);
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 105, 180, 0.3) 100%);
  color: #FFB84D;
  position: relative;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
}

.sidebar-header h3::before {
  content: '🌸 ';
}

.coco-decoration {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  font-size: 20px;
  animation: float-decoration 3s ease-in-out infinite;
}

@keyframes float-decoration {
  0%, 100% { 
    transform: translateY(-50%) scale(1);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-60%) scale(1.1);
    opacity: 1;
  }
}

.attractions-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.attraction-item {
  padding: 12px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.5) 0%, rgba(26, 15, 61, 0.5) 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid rgba(255, 184, 77, 0.3);
}

.attraction-item:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.attraction-item.no-location {
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 15, 61, 0.3) 100%);
  opacity: 0.8;
}

.attraction-item.no-location:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
}

.location-warning {
  margin-left: 5px;
  font-size: 12px;
}

.attraction-name {
  font-weight: bold;
  font-size: 14px;
  color: #FFB84D;
  margin-bottom: 4px;
  text-shadow: 0 0 5px rgba(255, 184, 77, 0.3);
}

.attraction-name::before {
  content: '✨ ';
}

.attraction-desc {
  font-size: 12px;
  color: #E0D4F7;
}

.attraction-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: 2px solid rgba(255, 184, 77, 0.3);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.5) 0%, rgba(26, 15, 61, 0.5) 100%);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  color: #FFB84D;
}

.action-btn:hover {
  border-color: #FFB84D;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 105, 180, 0.3) 100%);
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
}

.empty-tip {
  padding: 20px;
  text-align: center;
  color: rgba(255, 184, 77, 0.7);
  font-size: 14px;
}

.empty-tip::before {
  content: '🌸 ';
}

.map-container {
  flex: 1;
  position: relative;
}

#tour-map {
  width: 100%;
  height: 100%;
}

.right-sidebar {
  background: linear-gradient(180deg, rgba(45, 27, 105, 0.95) 0%, rgba(26, 15, 61, 0.95) 100%);
  border-left: 2px solid rgba(255, 184, 77, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 250px;
  max-width: 500px;
}

.chat-header {
  padding: 15px;
  border-bottom: 2px solid rgba(255, 184, 77, 0.3);
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 105, 180, 0.3) 100%);
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  color: #FFB84D;
  text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
}

.chat-header h3::before {
  content: '🎸 ';
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 15, 61, 0.3) 100%);
}

.message {
  margin-bottom: 15px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  margin-left: auto;
}

.message.assistant {
  align-self: flex-start;
}

.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.5) 0%, rgba(26, 15, 61, 0.5) 100%);
  border: 2px solid rgba(255, 184, 77, 0.3);
  color: #E0D4F7;
}

.message.user .message-content {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.5) 0%, rgba(255, 184, 77, 0.5) 100%);
  color: #FFFFFF;
  border: 2px solid rgba(255, 184, 77, 0.5);
}

.message-sender {
  font-size: 12px;
  margin-bottom: 4px;
  opacity: 0.7;
  color: #FFB84D;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 2px solid rgba(255, 184, 77, 0.3);
  background: linear-gradient(90deg, rgba(45, 27, 105, 0.5) 0%, rgba(26, 15, 61, 0.5) 100%);
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 2px solid rgba(255, 184, 77, 0.3);
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
  background-color: rgba(26, 15, 61, 0.5);
  transition: all 0.3s;
  color: #E0D4F7;
}

.chat-input input::placeholder {
  color: rgba(224, 212, 247, 0.5);
}

.chat-input input:focus {
  border-color: #FFB84D;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 184, 77, 0.2);
}

.chat-input button {
  padding: 0 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%);
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  font-weight: 500;
}

.chat-input button:hover {
  background: linear-gradient(135deg, #FFB84D 0%, #FFD700 100%);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 184, 77, 0.5);
}

.chat-input button:disabled {
  background: linear-gradient(135deg, rgba(255, 184, 77, 0.3) 0%, rgba(255, 107, 53, 0.3) 100%);
  cursor: not-allowed;
  transform: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
  transition: background-color 0.2s;
}

.resize-handle:hover {
  background: linear-gradient(180deg, #FF6B35 0%, #FFB84D 100%);
  opacity: 0.5;
}

.resize-handle-right {
  right: -3px;
}

.resize-handle-left {
  left: -3px;
}
</style>
