<script setup>
// 导入Element Plus图标
import { 
  List, 
  Document, 
  Setting,
  MapLocation
} from '@element-plus/icons-vue'
</script>

<template>
  <div class="app-container">
    <!-- 使用Element Plus的Container布局组件 -->
    <el-container style="height: 100vh;">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar-aside">
        <!-- 系统标题 -->
        <div class="logo-container">
          <div class="logo-icon">🎸</div>
          <h1 class="logo-text">寻梦环游记</h1>
          <div class="logo-decoration">✨</div>
        </div>
        
        <!-- 使用Element Plus的Menu组件实现导航菜单 -->
        <el-menu
          default-active="/tour"
          class="sidebar-menu"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#FFE0B2"
          router
        >
          <el-menu-item index="/tour">
            <template #title>
              <el-icon><MapLocation /></el-icon>
              <span>旅游导览</span>
            </template>
          </el-menu-item>
          
          <el-menu-item index="/todo">
            <template #title>
              <el-icon><List /></el-icon>
              <span>心愿清单</span>
            </template>
          </el-menu-item>
          
          <el-menu-item index="/about">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>关于系统</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header style="background: linear-gradient(90deg, #FFF8E1 0%, #FFE0B2 100%); border-bottom: 2px solid #FFB74D; display: flex; align-items: center; padding: 0 20px;">
          <!-- 左侧占位元素 -->
          <div style="flex: 1;"></div>
          
          <!-- 标题居中 -->
          <h2 style="color: #FFB84D; font-weight: 600;">🎸 寻梦环游记 🌸</h2>
          
          <!-- 右侧占位元素 -->
          <div style="flex: 1;"></div>
          
          <!-- 恢复系统设置下拉菜单 -->
          <div class="user-info">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right"><Setting /></el-icon>
                系统设置
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 路由视图区域 -->
        <el-main style="padding: 20px;">
          <!-- 万寿菊花瓣飘落效果 -->
          <div class="marigold-petals">
            <div class="petal petal-1"></div>
            <div class="petal petal-2"></div>
            <div class="petal petal-3"></div>
            <div class="petal petal-4"></div>
            <div class="petal petal-5"></div>
            <div class="petal petal-6"></div>
            <div class="petal petal-7"></div>
            <div class="petal petal-8"></div>
            <div class="petal petal-9"></div>
            <div class="petal petal-10"></div>
          </div>
          
          <!-- 使用RouterView组件显示当前路由对应的组件 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, sans-serif;
}

.app-container {
  height: 100%;
}

/* 侧边栏样式 */
.sidebar-aside {
  background: linear-gradient(180deg, #2D1B69 0%, #1A0F3D 50%, #0D0820 100%);
  position: relative;
  overflow: hidden;
}

.sidebar-aside::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 184, 77, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.logo-container {
  padding: 10px;
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid rgba(255, 184, 77, 0.3);
  position: relative;
  z-index: 1;
}

.logo-icon {
  font-size: 32px;
  margin-bottom: 5px;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { 
    filter: drop-shadow(0 0 5px rgba(255, 184, 77, 0.5));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 0 15px rgba(255, 184, 77, 0.8));
    transform: scale(1.1);
  }
}

.logo-text {
  color: #FFB84D;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
  animation: text-glow 3s ease-in-out infinite alternate;
}

@keyframes text-glow {
  from { 
    text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
    color: #FFB84D;
  }
  to { 
    text-shadow: 0 0 20px rgba(255, 107, 53, 0.8), 0 0 30px rgba(255, 105, 180, 0.5);
    color: #FFD700;
  }
}

.logo-decoration {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 16px;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(0.8) rotate(0deg);
    filter: drop-shadow(0 0 2px rgba(255, 184, 77, 0.5));
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2) rotate(180deg);
    filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.8));
  }
}

.sidebar-menu {
  border-right: none;
  position: relative;
  z-index: 1;
}

.sidebar-menu .el-menu-item {
  transition: all 0.3s;
  color: #E0D4F7 !important;
}

.sidebar-menu .el-menu-item:hover {
  background: linear-gradient(90deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%) !important;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
  color: #FFB84D !important;
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 105, 180, 0.3) 100%) !important;
  border-left: 4px solid #FFB84D;
  color: #FFD700 !important;
  animation: active-glow 2s ease-in-out infinite;
}

@keyframes active-glow {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 184, 77, 0.4);
  }
  50% { 
    box-shadow: 0 0 15px 5px rgba(255, 107, 53, 0.3);
  }
}

.sidebar-menu .el-menu-item .el-icon {
  transition: all 0.3s;
}

.sidebar-menu .el-menu-item:hover .el-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 0 5px rgba(255, 184, 77, 0.8));
}

/* 顶部导航栏样式 */
.el-header {
  background: linear-gradient(90deg, #2D1B69 0%, #1A0F3D 100%);
  border-bottom: 1px solid rgba(255, 184, 77, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 主内容区域样式 */
.el-main {
  background: linear-gradient(135deg, #1A0F3D 0%, #2D1B69 50%, #1A0F3D 100%);
  position: relative;
  overflow: hidden;
}

.el-main::before {
  content: '🌸';
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 40px;
  opacity: 0.15;
  pointer-events: none;
  animation: float-petal 4s ease-in-out infinite;
}

@keyframes float-petal {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.15;
  }
  50% { 
    transform: translateY(-15px) rotate(180deg);
    opacity: 0.25;
  }
}

.el-main::after {
  content: '✨';
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 30px;
  opacity: 0.15;
  pointer-events: none;
  animation: sparkle-move 3s ease-in-out infinite;
}

@keyframes sparkle-move {
  0%, 100% { 
    transform: translateX(0) scale(1);
    opacity: 0.15;
  }
  50% { 
    transform: translateX(15px) scale(1.2);
    opacity: 0.25;
  }
}

/* 万寿菊花瓣飘落效果 */
.marigold-petals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.petal {
  position: absolute;
  width: 12px;
  height: 25px;
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), inset 0 0 5px rgba(255, 255, 255, 0.3);
  animation: fall linear infinite;
}

.petal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
  border-radius: inherit;
}

.petal-1 { left: 5%; animation-duration: 10s; animation-delay: 0s; width: 10px; height: 22px; }
.petal-2 { left: 12%; animation-duration: 12s; animation-delay: 1s; width: 14px; height: 28px; }
.petal-3 { left: 20%; animation-duration: 11s; animation-delay: 2s; width: 11px; height: 24px; }
.petal-4 { left: 28%; animation-duration: 13s; animation-delay: 0.5s; width: 13px; height: 26px; }
.petal-5 { left: 36%; animation-duration: 10.5s; animation-delay: 1.5s; width: 10px; height: 22px; }
.petal-6 { left: 44%; animation-duration: 12.5s; animation-delay: 2.5s; width: 15px; height: 30px; }
.petal-7 { left: 52%; animation-duration: 11.5s; animation-delay: 0.8s; width: 12px; height: 25px; }
.petal-8 { left: 60%; animation-duration: 13.5s; animation-delay: 1.8s; width: 11px; height: 23px; }
.petal-9 { left: 68%; animation-duration: 10.8s; animation-delay: 2.8s; width: 14px; height: 27px; }
.petal-10 { left: 76%; animation-duration: 12.8s; animation-delay: 0.3s; width: 10px; height: 21px; }

@keyframes fall {
  0% {
    top: -5%;
    transform: translateX(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    top: 105%;
    transform: translateX(80px) rotate(720deg) scale(0.8);
    opacity: 0;
  }
}
</style>

<style scoped>
/* 组件特定样式 */
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
