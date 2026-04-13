<template>
  <div class="app-container">
    <!-- 左侧功能栏 -->
    <div class="left-sidebar">
      <div class="sidebar-header">
        <h2>地图助手</h2>
      </div>
      <ul class="menu-list">
        <li 
          :class="{ active: activeMenu === 'home' }" 
          @click="activeMenu = 'home'"
        >
          <span class="menu-icon">🏠</span>
          <span>首页</span>
        </li>
        <li 
          :class="{ active: activeMenu === 'todo' }" 
          @click="activeMenu = 'todo'"
        >
          <span class="menu-icon">📝</span>
          <span>待办清单</span>
        </li>
        <li 
          :class="{ active: activeMenu === 'about' }" 
          @click="activeMenu = 'about'"
        >
          <span class="menu-icon">ℹ️</span>
          <span>关于系统</span>
        </li>
      </ul>
    </div>

    <!-- 中间地图区 -->
    <div class="map-container">
      <div id="map" ref="mapRef"></div>
    </div>

    <!-- 右侧属性区 -->
    <div class="right-sidebar">
      <!-- 对话面板 -->
      <div v-if="activeMenu === 'home'" class="chat-panel">
        <div class="panel-header">
          <h3>对话助手</h3>
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
            placeholder="输入指令，例如：去天安门、找附近餐厅、在这里加个标记"
            @keyup.enter="sendMessage"
          />
          <button 
            @click="sendMessage" 
            :disabled="isLoading"
          >
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>

      <!-- 待办清单 -->
      <div v-else-if="activeMenu === 'todo'" class="todo-panel">
        <div class="panel-header">
          <h3>待办清单</h3>
        </div>
        <div class="todo-list">
          <div v-for="(todo, index) in todos" :key="index" class="todo-item">
            <input 
              type="checkbox" 
              v-model="todo.completed"
              @change="saveTodos"
            />
            <span :class="{ completed: todo.completed }">{{ todo.content }}</span>
            <button @click="deleteTodo(index)" class="delete-btn">删除</button>
          </div>
          <div v-if="todos.length === 0" class="empty-todo">
            暂无待办事项
          </div>
        </div>
        <div class="todo-input">
          <input 
            v-model="newTodo"
            type="text"
            placeholder="输入新的待办事项"
            @keyup.enter="addTodo"
          />
          <button @click="addTodo">添加</button>
        </div>
      </div>

      <!-- 关于系统 -->
      <div v-else-if="activeMenu === 'about'" class="about-panel">
        <div class="panel-header">
          <h3>关于系统</h3>
        </div>
        <div class="about-content">
          <h4>项目名称</h4>
          <p>地图对话助手</p>
          <h4>版本号</h4>
          <p>1.0.0</p>
          <h4>功能说明</h4>
          <p>通过自然语言控制地图，支持地点导航、周边搜索和标记添加功能。</p>
          <h4>技术栈</h4>
          <ul>
            <li>Vue 3 (Composition API)</li>
            <li>高德地图 JS API 2.0</li>
            <li>DeepSeek API</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 状态管理
const activeMenu = ref('home')
const mapRef = ref(null)
const map = ref(null)
const markers = ref([])
const messages = ref([
  { type: 'assistant', content: '您好！我是地图对话助手，您可以通过以下指令控制地图：\n1. "去天安门" - 地图移动到该地点\n2. "找附近餐厅" - 搜索周边餐厅并显示标记\n3. "在这里加个标记" - 在当前地图中心添加红色标记' }
])
const inputMessage = ref('')
const isLoading = ref(false)
const todos = ref([])
const newTodo = ref('')

// 初始化待办清单
const initTodos = () => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos)
  }
}

// 保存待办清单到localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value))
}

// 添加待办事项
const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({ content: newTodo.value.trim(), completed: false })
    newTodo.value = ''
    saveTodos()
  }
}

// 删除待办事项
const deleteTodo = (index) => {
  todos.value.splice(index, 1)
  saveTodos()
}

// 初始化地图
const initMap = async () => {
  try {
    await AMapLoader.load({
      key: 'YOUR_AMAP_KEY',
      version: '2.0',
      plugins: ['AMap.PlaceSearch']
    })
    
    map.value = new AMap.Map('map', {
      center: [116.397428, 39.90923],
      zoom: 12
    })
  } catch (error) {
    console.error('地图初始化失败:', error)
  }
}

// 清除所有标记
const clearMarkers = () => {
  markers.value.forEach(marker => {
    map.value.remove(marker)
  })
  markers.value = []
}

// 移动到指定地点
const moveToLocation = (location) => {
  AMap.plugin('AMap.Geocoder', function() {
    const geocoder = new AMap.Geocoder()
    geocoder.getLocation(location, function(status, result) {
      if (status === 'complete' && result.geocodes.length) {
        const position = result.geocodes[0].location
        map.value.setCenter(position)
        map.value.setZoom(15)
        
        // 添加标记
        const marker = new AMap.Marker({
          position: position,
          title: location
        })
        map.value.add(marker)
        markers.value.push(marker)
        
        messages.value.push({ type: 'assistant', content: `已移动到${location}` })
      } else {
        messages.value.push({ type: 'assistant', content: `无法找到地点：${location}` })
      }
    })
  })
}

// 搜索周边POI
const searchPOI = (keyword, radius = 1000) => {
  clearMarkers()
  
  AMap.plugin('AMap.PlaceSearch', function() {
    const placeSearch = new AMap.PlaceSearch({
      pageSize: 20,
      pageIndex: 1,
      extensions: 'base'
    })
    
    const center = map.value.getCenter()
    placeSearch.searchNearBy(keyword, center, radius, function(status, result) {
      if (status === 'complete' && result.poiList && result.poiList.pois.length) {
        const pois = result.poiList.pois
        const bounds = new AMap.Bounds()
        
        pois.forEach(poi => {
          const marker = new AMap.Marker({
            position: [poi.location.lng, poi.location.lat],
            title: poi.name
          })
          map.value.add(marker)
          markers.value.push(marker)
          bounds.extend([poi.location.lng, poi.location.lat])
        })
        
        // 调整视野
        map.value.setBounds(bounds, true)
        messages.value.push({ type: 'assistant', content: `已找到${pois.length}个${keyword}` })
      } else {
        messages.value.push({ type: 'assistant', content: `未找到附近的${keyword}` })
      }
    })
  })
}

// 添加标记
const addMarker = () => {
  const center = map.value.getCenter()
  const marker = new AMap.Marker({
    position: center,
    icon: new AMap.Icon({
      size: new AMap.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_red.png',
      imageSize: new AMap.Size(25, 34)
    })
  })
  map.value.add(marker)
  markers.value.push(marker)
  messages.value.push({ type: 'assistant', content: '已在当前位置添加标记' })
}

// 调用DeepSeek API解析意图
const parseIntent = async (message) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_DEEPSEEK_KEY`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个地图助手，只能返回JSON格式的指令。根据用户的输入，返回以下格式之一：\n1. 移动到指定地点：{"action":"moveTo","location":"地点名称"}\n2. 搜索周边POI：{"action":"searchPOI","keyword":"关键词","radius":1000}\n3. 在当前位置添加标记：{"action":"addMarker"}\n只返回JSON，不要返回其他内容。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.1
      })
    })
    
    const data = await response.json()
    const content = data.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('API调用失败:', error)
    return null
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const message = inputMessage.value.trim()
  messages.value.push({ type: 'user', content: message })
  inputMessage.value = ''
  isLoading.value = true
  
  try {
    const intent = await parseIntent(message)
    if (intent) {
      switch (intent.action) {
        case 'moveTo':
          moveToLocation(intent.location)
          break
        case 'searchPOI':
          searchPOI(intent.keyword, intent.radius || 1000)
          break
        case 'addMarker':
          addMarker()
          break
        default:
          messages.value.push({ type: 'assistant', content: '不支持的指令' })
      }
    } else {
      messages.value.push({ type: 'assistant', content: '解析指令失败，请重试' })
    }
  } catch (error) {
    console.error('处理指令失败:', error)
    messages.value.push({ type: 'assistant', content: '处理指令时出错，请重试' })
  } finally {
    isLoading.value = false
  }
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  setTimeout(() => {
    const chatMessages = document.querySelector('.chat-messages')
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }, 100)
}, { deep: true })

// 组件挂载时初始化
onMounted(() => {
  initMap()
  initTodos()
})
</script>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* 左侧功能栏 */
.left-sidebar {
  width: 260px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #4a90e2;
  color: white;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.menu-list li {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-list li:hover {
  background-color: #e8e8e8;
}

.menu-list li.active {
  background-color: #4a90e2;
  color: white;
}

.menu-icon {
  margin-right: 10px;
  font-size: 18px;
}

/* 中间地图区 */
.map-container {
  flex: 1;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

/* 右侧属性区 */
.right-sidebar {
  width: 280px;
  background-color: #f5f5f5;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

/* 对话面板 */
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: white;
  margin: 0 15px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  background-color: #f0f0f0;
}

.message.user .message-content {
  background-color: #4a90e2;
  color: white;
}

.message-sender {
  font-size: 12px;
  margin-bottom: 4px;
  opacity: 0.7;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
}

.chat-input button {
  padding: 0 20px;
  border: none;
  border-radius: 20px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.chat-input button:hover {
  background-color: #357abd;
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 待办清单 */
.todo-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.todo-list {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: white;
  margin: 0 15px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.todo-item span {
  flex: 1;
  font-size: 14px;
  transition: text-decoration 0.2s;
}

.todo-item span.completed {
  text-decoration: line-through;
  color: #999;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #fff1f0;
}

.empty-todo {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

.todo-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.todo-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
}

.todo-input button {
  padding: 0 20px;
  border: none;
  border-radius: 20px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.todo-input button:hover {
  background-color: #357abd;
}

/* 关于系统 */
.about-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.about-content {
  flex: 1;
  padding: 20px;
  background-color: white;
  margin: 0 15px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-y: auto;
}

.about-content h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.about-content p {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.about-content ul {
  margin: 0 0 20px 0;
  padding-left: 20px;
  font-size: 14px;
  color: #666;
}

.about-content li {
  margin-bottom: 5px;
}
</style>