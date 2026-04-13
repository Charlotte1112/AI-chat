import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTourStore = defineStore('tour', () => {
  // 对话消息
  const messages = ref([
    { type: 'assistant', content: '您好！我是智能旅游规划助手，可以帮您：\n1. 规划旅游路线（如：我想去北京玩三天）\n2. 推荐景点（如：推荐一些历史文化景点）\n3. 导航到景点（如：去故宫）\n4. 搜索周边设施（如：找附近的餐厅）\n5. 添加标记点（如：在这里加个标记）\n6. 添加到心愿清单（如：把故宫添加到心愿清单）\n\n告诉我您的旅游需求，我会为您推荐合适的景点！' }
  ])
  
  // 景点列表
  const attractions = ref([])
  
  // 当前城市和省份
  const currentCity = ref('北京')
  const currentProvince = ref('北京市')
  
  // 对话历史（用于上下文记忆）
  const conversationHistory = ref([])
  
  // 景点ID计数器
  let attractionIdCounter = 1
  
  // 添加消息
  const addMessage = (message) => {
    messages.value.push(message)
  }
  
  // 更新消息内容
  const updateMessage = (index, content) => {
    if (index >= 0 && index < messages.value.length) {
      messages.value[index].content = content
    }
  }
  
  // 清空消息
  const clearMessages = () => {
    messages.value = [
      { type: 'assistant', content: '您好！我是智能旅游规划助手，可以帮您：\n1. 规划旅游路线（如：我想去北京玩三天）\n2. 推荐景点（如：推荐一些历史文化景点）\n3. 导航到景点（如：去故宫）\n4. 搜索周边设施（如：找附近的餐厅）\n5. 添加标记点（如：在这里加个标记）\n6. 添加到心愿清单（如：把故宫添加到心愿清单）\n\n告诉我您的旅游需求，我会为您推荐合适的景点！' }
    ]
  }
  
  // 添加景点
  const addAttraction = (attraction) => {
    attractions.value.push({
      id: attractionIdCounter++,
      ...attraction
    })
  }
  
  // 清空景点
  const clearAttractions = () => {
    attractions.value = []
    attractionIdCounter = 1
  }
  
  // 更新当前城市
  const updateCity = (city, province) => {
    currentCity.value = city
    currentProvince.value = province
  }
  
  // 添加对话历史
  const addConversationHistory = (message) => {
    conversationHistory.value.push(message)
    
    // 限制对话历史长度
    if (conversationHistory.value.length > 20) {
      conversationHistory.value = conversationHistory.value.slice(-20)
    }
  }
  
  // 清空对话历史
  const clearConversationHistory = () => {
    conversationHistory.value = []
  }
  
  return {
    messages,
    attractions,
    currentCity,
    currentProvince,
    conversationHistory,
    addMessage,
    updateMessage,
    clearMessages,
    addAttraction,
    clearAttractions,
    updateCity,
    addConversationHistory,
    clearConversationHistory
  }
})
