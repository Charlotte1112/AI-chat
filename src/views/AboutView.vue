<script setup>
// 关于页面视图组件
</script>

<template>
  <div class="about-container">
    <h2>🎸 关于应用 🌸</h2>
    <div class="about-content">
      <h3>技术栈</h3>
      <ul>
        <li>Vue 3</li>
        <li>Vue Router</li>
        <li>Pinia (状态管理)</li>
        <li>Element Plus</li>
        <li>Vite</li>
      </ul>
      
      <h3>功能特点</h3>
      <ul>
        <li>心愿清单管理</li>
        <li>多选批量删除</li>
        <li>响应式布局</li>
        <li>路由切换</li>
        <li>智能旅游导览</li>
      </ul>
      
      <div class="decoration">
        <div class="decoration-item">🐕</div>
        <div class="decoration-item">🎸</div>
        <div class="decoration-item">🎵</div>
        <div class="decoration-item">🌸</div>
        <div class="decoration-item">✨</div>
      </div>
      
      <!-- 灵兽装饰 -->
      <div class="spirit-animals">
        <div class="spirit-animal alebrije-1">🦋</div>
        <div class="spirit-animal alebrije-2">🐱</div>
        <div class="spirit-animal alebrije-3">🦅</div>
      </div>
      
      <!-- 音乐音符装饰 -->
      <div class="music-notes">
        <div class="note note-1">🎵</div>
        <div class="note note-2">🎶</div>
        <div class="note note-3">🎵</div>
        <div class="note note-4">🎶</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  padding: 20px;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.95) 0%, rgba(26, 15, 61, 0.95) 100%);
  border-radius: 12px;
  border: 2px solid rgba(255, 184, 77, 0.3);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.about-container h2 {
  color: #FFB84D;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-content {
  margin-top: 20px;
}

.about-content h3 {
  margin-top: 20px;
  color: #FFB84D;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 184, 77, 0.3);
  text-shadow: 0 0 5px rgba(255, 184, 77, 0.3);
}

.about-content h3::before {
  content: '✨ ';
}

.about-content ul {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 10px;
}

.about-content li {
  margin-bottom: 10px;
  color: #E0D4F7;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.5) 0%, rgba(26, 15, 61, 0.5) 100%);
  border-radius: 8px;
  border-left: 4px solid rgba(255, 184, 77, 0.3);
  transition: all 0.3s;
  animation: slideInRight 0.3s ease-out;
  animation-fill-mode: both;
}

.about-content li:nth-child(1) { animation-delay: 0.1s; }
.about-content li:nth-child(2) { animation-delay: 0.2s; }
.about-content li:nth-child(3) { animation-delay: 0.3s; }
.about-content li:nth-child(4) { animation-delay: 0.4s; }
.about-content li:nth-child(5) { animation-delay: 0.5s; }

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.about-content li:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.about-content li::before {
  content: '✓ ';
  color: #FFB84D;
  font-weight: bold;
  margin-right: 5px;
}

.decoration {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid rgba(255, 184, 77, 0.3);
}

.decoration-item {
  font-size: 40px;
  opacity: 0.5;
  animation: glow-pulse 2s ease-in-out infinite;
}

.decoration-item:nth-child(1) {
  animation-delay: 0s;
}

.decoration-item:nth-child(2) {
  animation-delay: 0.3s;
}

.decoration-item:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes glow-pulse {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(255, 184, 77, 0.3));
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px rgba(255, 107, 53, 0.6));
  }
}

/* 灵兽装饰 */
.spirit-animals {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(255, 184, 77, 0.3);
}

.spirit-animal {
  font-size: 35px;
  animation: spirit-float 4s ease-in-out infinite;
}

.alebrije-1 { animation-delay: 0s; }
.alebrije-2 { animation-delay: 1s; }
.alebrije-3 { animation-delay: 2s; }

@keyframes spirit-float {
  0%, 100% { 
    transform: translateY(0) rotate(-5deg);
    opacity: 0.5;
    filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
  }
  50% { 
    transform: translateY(-15px) rotate(5deg);
    opacity: 0.9;
    filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.8));
  }
}

/* 音乐音符装饰 */
.music-notes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.note {
  position: absolute;
  font-size: 24px;
  animation: float-note 6s ease-in-out infinite;
}

.note-1 { left: 10%; top: 20%; animation-delay: 0s; }
.note-2 { right: 10%; top: 30%; animation-delay: 1.5s; }
.note-3 { left: 20%; bottom: 30%; animation-delay: 3s; }
.note-4 { right: 20%; bottom: 20%; animation-delay: 4.5s; }

@keyframes float-note {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  50% { 
    transform: translateY(-20px) rotate(360deg);
    opacity: 0.5;
  }
}
</style>