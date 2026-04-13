<script setup>
// 【Vue核心概念：Props】
// 定义组件的props，用于接收父组件传递的数据
// 这里我们定义了两个prop：
// 1. todo: 待办事项对象，必须提供
// 2. is-selected: 是否被选中，默认值为false
const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

// 【Vue核心概念：Emits】
// 定义组件的事件，用于向父组件发送消息
// 这里我们定义了三个事件：delete、toggle和toggle-selection
const emit = defineEmits(['delete', 'toggle', 'toggle-selection'])

// 【Vue核心概念：事件处理】
// 删除待办事项的方法
// 当点击删除按钮时，通过emit向父组件发送delete事件，并传递todo的id
const handleDelete = () => {
  emit('delete', props.todo.id)
}

// 切换待办事项完成状态的方法
// 当点击完成状态复选框时，通过emit向父组件发送toggle事件，并传递todo的id
const handleToggle = () => {
  emit('toggle', props.todo.id)
}

// 【新增功能：切换选中状态】
// 切换待办事项的选中状态
// 当点击选中复选框时，通过emit向父组件发送toggle-selection事件，并传递todo的id
const handleToggleSelection = () => {
  emit('toggle-selection', props.todo.id)
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed, selected: isSelected }">
    <!-- 【新增功能：选中复选框】使用Element Plus的Checkbox组件 -->
    <el-checkbox 
      :checked="isSelected" 
      @change="handleToggleSelection"
      style="margin-right: 10px;"
    />
    
    <!-- 完成状态复选框 使用Element Plus的Checkbox组件 -->
    <el-checkbox 
      :checked="todo.completed" 
      @change="handleToggle"
      style="margin-right: 10px;"
    />
    
    <span class="todo-text">{{ todo.text }}</span>
    <!-- 使用Element Plus的Button组件 -->
    <el-button 
      type="danger" 
      size="small" 
      @click="handleDelete"
      style="margin-left: auto;"
    >
      删除
    </el-button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 2px solid rgba(255, 184, 77, 0.2);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(45, 27, 105, 0.3) 0%, rgba(26, 15, 61, 0.3) 100%);
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.todo-item.selected {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
  border-left: 4px solid #FFB84D;
  animation: selectedPulse 0.3s ease-out;
}

@keyframes selectedPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(255, 105, 180, 0.15) 100%);
  transform: translateX(5px) scale(1.01);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: rgba(255, 184, 77, 0.6);
  animation: completedFade 0.3s ease-out;
}

@keyframes completedFade {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.todo-item.completed .todo-text::before {
  content: '✓ ';
  color: #FFB84D;
  font-weight: bold;
  animation: checkmark 0.3s ease-out;
}

@keyframes checkmark {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.todo-text {
  flex: 1;
  margin: 0 15px;
  font-size: 15px;
  color: #E0D4F7;
  line-height: 1.5;
  transition: all 0.3s;
}

.todo-text::before {
  content: '🌸 ';
  display: inline-block;
  transition: transform 0.3s;
}

.todo-item:hover .todo-text::before {
  transform: scale(1.2) rotate(10deg);
}

:deep(.el-checkbox) {
  font-size: 16px;
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

:deep(.el-button) {
  margin-left: auto;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #FF69B4 0%, #FF6B35 100%);
  border-color: #FF69B4;
  border-radius: 8px;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #FF6B35 0%, #FF69B4 100%);
  border-color: #FF6B35;
  box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
}
</style>