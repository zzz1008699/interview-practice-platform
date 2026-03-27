<template>
  <el-drawer
    :title="question?.title || '题目详情'"
    v-model="visible"
    size="600px"
    destroy-on-close
  >
    <div v-if="question" class="detail-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <div class="info-row">
          <span class="label">分类：</span>
          <el-tag :type="getCategoryType(question.category)">
            {{ getCategoryLabel(question.category) }}
          </el-tag>
        </div>
        <div class="info-row">
          <span class="label">类型：</span>
          <span>{{ getTypeLabel(question.type) }}</span>
        </div>
        <div class="info-row">
          <span class="label">难度：</span>
          <el-tag :type="getDifficultyType(question.difficulty)" size="small">
            {{ getDifficultyLabel(question.difficulty) }}
          </el-tag>
        </div>
        <div class="info-row">
          <span class="label">标签：</span>
          <el-tag
            v-for="tag in question.tags"
            :key="tag"
            size="small"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <!-- 题目内容 -->
      <div class="content-section">
        <h4>题目内容</h4>
        <div class="content-text">{{ question.content }}</div>

        <!-- 选择题选项 -->
        <div v-if="question.options && question.options.length" class="options-list">
          <div
            v-for="(option, index) in question.options"
            :key="index"
            class="option-item"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <span>{{ option }}</span>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 参考答案 -->
      <div class="answer-section">
        <h4>参考答案</h4>
        <div class="answer-text">{{ question.answer }}</div>
      </div>

      <!-- 答案解析 -->
      <div v-if="question.explanation" class="explanation-section">
        <el-divider />
        <h4>答案解析</h4>
        <div class="explanation-text">{{ question.explanation }}</div>
      </div>

      <!-- 底部操作 -->
      <div class="drawer-footer">
        <el-button
          :type="question.isFavorite ? 'warning' : 'default'"
          @click="handleToggleFavorite"
        >
          <el-icon>
            <Star v-if="question.isFavorite" />
            <StarFilled v-else />
          </el-icon>
          {{ question.isFavorite ? '已收藏' : '收藏' }}
        </el-button>
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import type { InterviewQuestion } from '@/types/interview'

// Props & Emits
const props = defineProps<{
  visible: boolean
  question: InterviewQuestion | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// 计算属性：双向绑定 visible
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// Store
const interviewStore = useInterviewStore()

// 常量定义
const categoryOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: '浏览器原理', value: 'browser' },
  { label: '网络', value: 'network' },
  { label: '算法', value: 'algorithm' },
  { label: '工程化', value: 'engineering' },
  { label: '性能优化', value: 'performance' },
  { label: '安全', value: 'security' }
]

const typeOptions = [
  { label: '单选题', value: 'single_choice' },
  { label: '多选题', value: 'multiple_choice' },
  { label: '填空题', value: 'fill_blank' },
  { label: '简答题', value: 'short_answer' },
  { label: '编程题', value: 'code' }
]

const difficultyOptions = [
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' }
]

// 方法
const getCategoryLabel = (category: string) => {
  const item = categoryOptions.find(c => c.value === category)
  return item?.label || category
}

const getCategoryType = (category: string) => {
  const typeMap: Record<string, string> = {
    javascript: 'warning',
    typescript: 'primary',
    vue: 'success',
    react: 'info',
    css: 'danger'
  }
  return typeMap[category] || ''
}

const getTypeLabel = (type: string) => {
  const item = typeOptions.find(t => t.value === type)
  return item?.label || type
}

const getDifficultyLabel = (difficulty: string) => {
  const item = difficultyOptions.find(d => d.value === difficulty)
  return item?.label || difficulty
}

const getDifficultyType = (difficulty: string) => {
  const typeMap: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return typeMap[difficulty] || ''
}

const handleToggleFavorite = () => {
  if (!props.question) return
  const isFavorite = interviewStore.toggleFavorite(props.question.id)
  ElMessage.success(isFavorite ? '已收藏' : '已取消收藏')
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.detail-content {
  padding: 0 10px;
}

.info-section .info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-section .info-row .label {
  color: #606266;
  font-weight: 500;
  min-width: 60px;
}

.info-section .info-row .tag-item {
  margin-right: 8px;
}

.content-section h4,
.answer-section h4,
.explanation-section h4 {
  color: #303133;
  margin-bottom: 12px;
  font-size: 16px;
}

.content-section .content-text,
.answer-section .answer-text,
.explanation-section .explanation-text {
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
}

.options-list {
  margin-top: 16px;
}

.options-list .option-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.options-list .option-item .option-label {
  font-weight: 600;
  color: #409eff;
  min-width: 24px;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
