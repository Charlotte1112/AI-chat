<template>
  <div class="chat-window">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
        <div class="message-role">{{ msg.role }}</div>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="input-area">
      <input v-model="text" @keydown.enter.prevent="sendMessage" placeholder="输入消息后回车发送" />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentLocation: {   // 从父组件传入 { lng, lat }
    type: Object,
    default: () => ({ lng: 116.397428, lat: 39.90923 })
  }
})
const emit = defineEmits(['ai-action'])

const sendMessage = async () => {
  // ... 省略 UI 逻辑
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: inputText.value,
      currentLocation: `${props.currentLocation.lng},${props.currentLocation.lat}`
    })
  })
  const data = await response.json()
  // 如果 data.action 中有 pois 字段，说明需要渲染 POI 标记
  if (data.action && data.action.pois) {
    emit('ai-action', data.action)
  }
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}
.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
}
.message {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
}
.message.user {
  background: #e6f7ff;
  text-align: right;
}
.message.assistant {
  background: #f6ffed;
  text-align: left;
}
.message-role {
  font-size: 12px;
  color: #999;
}
.input-area {
  display: flex;
  gap: 6px;
}
input {
  flex: 1;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  padding: 6px 12px;
  border: none;
  background: #409eff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>