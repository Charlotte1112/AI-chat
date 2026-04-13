<script setup>
import { ref } from 'vue'
import TodoItem from '../components/TodoItem.vue'
// 导入待办事项的Pinia store
import { useTodoStore } from '../stores/todo'

// 【Pinia状态管理】
// 使用待办事项store
const todoStore = useTodoStore()

// 输入框的响应式数据
const newTodoText = ref('')

// 添加待办事项的方法
const addTodo = () => {
  // 输入验证：去除前后空格后检查是否为空
  const trimmedText = newTodoText.value.trim()
  if (trimmedText) {
    // 使用store的方法添加待办事项
    todoStore.addTodo(trimmedText)
    // 清空输入框
    newTodoText.value = ''
  }
}
</script>

<template>
  <div class="todo-app">
    <!-- 使用Element Plus的Card组件 -->
    <el-card shadow="hover" class="todo-card">
      <template #header>
        <div class="card-header">
          <h2>心愿清单</h2>
          <div class="header-decoration">✨</div>
          <!-- 彩色剪纸装饰 -->
          <div class="papel-picado">
            <div class="papel papel-1">🎨</div>
            <div class="papel papel-2">🎭</div>
            <div class="papel papel-3">🎨</div>
            <div class="papel papel-4">🎭</div>
          </div>
        </div>
      </template>
      
      <!-- 添加心愿 -->
      <div class="add-todo">
        <!-- 使用Element Plus的Input组件 -->
        <el-input 
          v-model="newTodoText" 
          placeholder="添加新的心愿..."
          @keyup.enter="addTodo"
          style="margin-right: 10px;"
        />
        <!-- 使用Element Plus的Button组件 -->
        <el-button type="primary" @click="addTodo">
          添加
        </el-button>
      </div>
      
      <el-divider />
      
      <!-- 心愿列表 -->
      <div class="todo-list">
        <!-- 【新增功能：批量操作栏】 -->
        <div class="batch-actions" v-if="todoStore.todos.length > 0">
          <!-- 使用Element Plus的Space组件 -->
          <el-space>
            <el-checkbox 
              :checked="todoStore.isAllSelected" 
              @change="todoStore.toggleAllSelection"
            >
              全选
            </el-checkbox>
            <el-button 
              type="danger" 
              @click="todoStore.batchDeleteTodos"
              :disabled="!todoStore.hasSelectedTodos"
              size="small"
            >
              删除选中 ({{ todoStore.selectedTodoIds.size }})
            </el-button>
          </el-space>
        </div>
        
        <!-- 使用Element Plus的Empty组件 -->
        <el-empty 
          v-if="todoStore.todos.length === 0" 
          description="暂无心愿"
        />
        
        <!-- 心愿列表 -->
        <div v-else class="todo-items-container">
          <TodoItem 
            v-for="todo in todoStore.todos" 
            :key="todo.id"
            :todo="todo"
            :is-selected="todoStore.selectedTodoIds.has(todo.id)"
            @delete="todoStore.deleteTodo"
            @toggle="todoStore.toggleTodo"
            @toggle-selection="todoStore.toggleTodoSelection"
          />
        </div>
      </div>
      
      <el-divider />
      
      <!-- 统计信息 -->
      <div class="stats">
        <el-space>
          <span>剩余 {{ todoStore.remainingCount }} 项心愿</span>
          <el-checkbox 
            :checked="todoStore.isAllCompleted" 
            @change="todoStore.toggleAllTodos"
          >
            全部标记为完成
          </el-checkbox>
        </el-space>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 900px;
  margin: 20px auto;
}

.todo-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 184, 77, 0.3);
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.95) 0%, rgba(26, 15, 61, 0.95) 100%);
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.card-header h2 {
  color: #FFB84D;
  font-weight: 600;
  margin: 0;
  font-size: 24px;
  animation: slideIn 0.5s ease-out;
  text-shadow: 0 0 10px rgba(255, 184, 77, 0.5);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card-header h2::before {
  content: '🌸 ';
  display: inline-block;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { 
    filter: drop-shadow(0 0 5px rgba(255, 184, 77, 0.5));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 0 15px rgba(255, 107, 53, 0.8));
    transform: scale(1.1);
  }
}

.header-decoration {
  position: absolute;
  top: -5px;
  right: 10px;
  font-size: 20px;
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

/* 彩色剪纸装饰 */
.papel-picado {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.papel {
  position: absolute;
  font-size: 18px;
  animation: swing 3s ease-in-out infinite;
}

.papel-1 { left: 5%; top: 20%; animation-delay: 0s; }
.papel-2 { left: 15%; top: 40%; animation-delay: 0.5s; }
.papel-3 { right: 15%; top: 30%; animation-delay: 1s; }
.papel-4 { right: 5%; top: 50%; animation-delay: 1.5s; }

@keyframes swing {
  0%, 100% { 
    transform: rotate(-5deg) translateY(0);
    opacity: 0.4;
  }
  50% { 
    transform: rotate(5deg) translateY(-5px);
    opacity: 0.7;
  }
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 5px;
}

.todo-list {
  margin-bottom: 20px;
}

.batch-actions {
  margin-bottom: 20px;
  padding: 0 5px;
}

.todo-items-container {
  border: 2px solid rgba(255, 184, 77, 0.3);
  border-radius: 12px;
  overflow: hidden;
  background-color: rgba(45, 27, 105, 0.3);
}

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFB84D;
  font-size: 14px;
  padding: 0 5px;
  font-weight: 500;
}

:deep(.el-input) {
  flex: 1;
}

:deep(.el-input__wrapper) {
  border: 2px solid rgba(255, 184, 77, 0.3);
  border-radius: 8px;
  transition: all 0.3s;
  background-color: rgba(26, 15, 61, 0.5);
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 107, 53, 0.5);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #FFB84D;
  box-shadow: 0 0 0 2px rgba(255, 184, 77, 0.2);
}

:deep(.el-input__inner) {
  color: #E0D4F7;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(224, 212, 247, 0.5);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #FF6B35 0%, #FFB84D 100%);
  border-color: #FFB84D;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #FFB84D 0%, #FFD700 100%);
  border-color: #FFD700;
  box-shadow: 0 0 15px rgba(255, 184, 77, 0.5);
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 2px solid rgba(255, 184, 77, 0.2);
  background: linear-gradient(90deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%);
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-divider) {
  margin: 16px 0;
  border-color: rgba(255, 184, 77, 0.2);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #FFB84D;
  border-color: #FF6B35;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #FFB84D;
}

:deep(.el-checkbox__label) {
  color: #E0D4F7;
}

:deep(.el-empty__description) {
  color: rgba(255, 184, 77, 0.7);
}

:deep(.el-empty__image) {
  filter: drop-shadow(0 0 10px rgba(255, 184, 77, 0.3));
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #FF69B4 0%, #FF6B35 100%);
  border-color: #FF69B4;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #FF6B35 0%, #FF69B4 100%);
  border-color: #FF6B35;
}
</style>