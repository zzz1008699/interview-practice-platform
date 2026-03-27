<!--
  面试题库列表页面 - QuestionList.vue
  
  本组件是面试题库的核心页面，提供：
  - 题目列表展示（表格形式）
  - 多维度筛选（关键词、分类、类型、难度）
  - 分页功能
  - 题目增删改查
  - 收藏功能
  - 随机抽题入口
  
  依赖组件：
  - QuestionFormDialog: 新增/编辑题目的对话框
  - QuestionDetailDrawer: 题目详情抽屉
-->

<template>
  <!-- 页面容器 -->
  <div class="question-page">
    
    <!-- 
      ========================================
      页面头部
      ========================================
      包含页面标题、题目总数统计、主要操作按钮
    -->
    <div class="page-header">
      <div class="header-left">
        <span class="title">面试题库</span>
        <!-- 显示题目总数 -->
        <el-tag type="info" class="count-tag">共 {{ total }} 题</el-tag>
      </div>
      <div class="header-right">
        <!-- 新增题目按钮 -->
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增题目
        </el-button>
        <!-- 随机抽题按钮 -->
        <el-button type="success" @click="handleRandom">
          <el-icon><VideoPlay /></el-icon>随机抽题
        </el-button>
      </div>
    </div>

    <!-- 
      ========================================
      搜索筛选区域
      ========================================
      提供多维度筛选功能
    -->
    <el-card class="filter-card" shadow="never">
      <!-- 
        el-form: 表单组件
        :model="filterForm": 绑定筛选表单数据
        inline: 行内表单布局
      -->
      <el-form :model="filterForm" inline>
        <!-- 关键词搜索 -->
        <el-form-item label="关键词">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索标题/内容/标签"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <!-- 分类筛选下拉框 -->
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="全部分类" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <!-- 类型筛选下拉框 -->
        <el-form-item label="类型">
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <!-- 难度筛选下拉框 -->
        <el-form-item label="难度">
          <el-select v-model="filterForm.difficulty" placeholder="全部难度" clearable>
            <el-option
              v-for="item in difficultyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 
      ========================================
      数据表格区域
      ========================================
      展示题目列表，支持排序、操作等
    -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="questionList"
        border
        stripe
        highlight-current-row
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <!-- 题目列 -->
        <el-table-column label="题目" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="question-title">
              <!-- 可点击的标题链接 -->
              <el-link type="primary" @click="handleView(row)">{{ row.title }}</el-link>
              <!-- 显示前两个标签 -->
              <el-tag
                v-for="tag in row.tags.slice(0, 2)"
                :key="tag"
                size="small"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <!-- 分类列 -->
        <el-table-column label="分类" width="100" align="center">
          <template #default="{ row }">
            <!-- 根据分类显示不同颜色的标签 -->
            <el-tag :type="getCategoryType(row.category)">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 类型列 -->
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            {{ getTypeLabel(row.type) }}
          </template>
        </el-table-column>
        
        <!-- 难度列 -->
        <el-table-column label="难度" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getDifficultyType(row.difficulty)" size="small">
              {{ getDifficultyLabel(row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 收藏列 -->
        <el-table-column label="收藏" width="80" align="center">
          <template #default="{ row }">
            <!-- 收藏/取消收藏按钮 -->
            <el-button
              link
              :type="row.isFavorite ? 'warning' : 'info'"
              @click="handleToggleFavorite(row)"
            >
              <el-icon size="18">
                <!-- 根据收藏状态显示不同图标 -->
                <Star v-if="row.isFavorite" />
                <StarFilled v-else />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        
        <!-- 操作列 - 固定在右侧 -->
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 
        分页组件
        v-model:current-page: 双向绑定当前页
        v-model:page-size: 双向绑定每页条数
        :page-sizes: 可选的每页条数
        layout: 分页组件布局
      -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 
      ========================================
      新增/编辑对话框
      ========================================
      复用同一个组件，通过 type 区分是新增还是编辑
    -->
    <QuestionFormDialog
      v-model:visible="dialogVisible"
      :type="dialogType"
      :data="currentQuestion"
      @success="handleFormSuccess"
    />

    <!-- 
      ========================================
      题目详情抽屉
      ========================================
      从右侧滑出显示题目详情
    -->
    <QuestionDetailDrawer
      v-model:visible="detailVisible"
      :question="currentQuestion"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 面试题库列表页面脚本
 * 
 * 功能：
 * - 题目列表的展示、筛选、分页
 * - 题目的增删改查操作
 * - 收藏功能
 * - 与 Store 交互获取数据
 */

import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, VideoPlay, Star, StarFilled } from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import type { InterviewQuestion, QuestionFilter } from '@/types/interview'
import QuestionFormDialog from './components/QuestionFormDialog.vue'
import QuestionDetailDrawer from './components/QuestionDetailDrawer.vue'

// ========================================
// 常量定义 - 下拉选项
// ========================================

/**
 * 分类选项列表
 * 用于分类筛选下拉框和标签显示
 */
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

/**
 * 题目类型选项列表
 */
const typeOptions = [
  { label: '单选题', value: 'single_choice' },
  { label: '多选题', value: 'multiple_choice' },
  { label: '填空题', value: 'fill_blank' },
  { label: '简答题', value: 'short_answer' },
  { label: '编程题', value: 'code' }
]

/**
 * 难度选项列表
 */
const difficultyOptions = [
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' }
]

// ========================================
// Store
// ========================================

/**
 * 面试题库状态管理 Store
 */
const interviewStore = useInterviewStore()

// ========================================
// 响应式数据
// ========================================

/** 加载状态 */
const loading = ref(false)

/** 题目列表数据 */
const questionList = ref<InterviewQuestion[]>([])

/** 题目总数 */
const total = ref(0)

/**
 * 筛选表单数据
 * reactive: 创建响应式对象
 */
const filterForm = reactive<QuestionFilter>({
  keyword: '',
  category: undefined,
  type: undefined,
  difficulty: undefined
})

/**
 * 分页参数
 */
const pagination = reactive({
  page: 1,
  pageSize: 10
})

/** 对话框显示状态 */
const dialogVisible = ref(false)

/** 对话框类型：add=新增, edit=编辑 */
const dialogType = ref<'add' | 'edit'>('add')

/** 当前操作的题目对象 */
const currentQuestion = ref<InterviewQuestion | null>(null)

/** 详情抽屉显示状态 */
const detailVisible = ref(false)

// ========================================
// 方法定义
// ========================================

/**
 * 加载题目列表数据
 * 
 * 根据当前筛选条件和分页参数从 Store 获取数据
 */
const loadData = () => {
  loading.value = true
  const result = interviewStore.getPaginatedQuestions(filterForm, pagination)
  questionList.value = result.list
  total.value = result.total
  loading.value = false
}

/**
 * 搜索按钮点击处理
 * 
 * 重置到第一页并重新加载数据
 */
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

/**
 * 重置筛选条件
 * 
 * 清空所有筛选条件并重新加载数据
 */
const handleReset = () => {
  filterForm.keyword = ''
  filterForm.category = undefined
  filterForm.type = undefined
  filterForm.difficulty = undefined
  pagination.page = 1
  loadData()
}

/**
 * 每页条数改变处理
 * 
 * @param size - 新的每页条数
 */
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadData()
}

/**
 * 页码改变处理
 * 
 * @param page - 新的页码
 */
const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

/**
 * 新增题目按钮点击
 * 
 * 打开新增对话框，清空当前题目数据
 */
const handleAdd = () => {
  dialogType.value = 'add'
  currentQuestion.value = null
  dialogVisible.value = true
}

/**
 * 编辑题目按钮点击
 * 
 * @param row - 要编辑的题目对象
 */
const handleEdit = (row: InterviewQuestion) => {
  dialogType.value = 'edit'
  currentQuestion.value = row
  dialogVisible.value = true
}

/**
 * 查看题目详情
 * 
 * @param row - 要查看的题目对象
 */
const handleView = (row: InterviewQuestion) => {
  currentQuestion.value = row
  detailVisible.value = true
}

/**
 * 删除题目
 * 
 * @param row - 要删除的题目对象
 * 
 * 流程：
 * 1. 显示确认对话框
 * 2. 用户确认后调用 Store 删除
 * 3. 显示成功提示
 * 4. 刷新列表
 */
const handleDelete = async (row: InterviewQuestion) => {
  try {
    await ElMessageBox.confirm(`确定删除题目"${row.title}"吗？`, '提示', {
      type: 'warning'
    })
    interviewStore.deleteQuestion(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 用户取消删除，不做任何操作
  }
}

/**
 * 切换收藏状态
 * 
 * @param row - 要切换收藏状态的题目
 */
const handleToggleFavorite = (row: InterviewQuestion) => {
  const isFavorite = interviewStore.toggleFavorite(row.id)
  ElMessage.success(isFavorite ? '已收藏' : '已取消收藏')
}

/**
 * 表单提交成功回调
 * 
 * 关闭对话框并刷新列表
 */
const handleFormSuccess = () => {
  dialogVisible.value = false
  loadData()
}

/**
 * 随机抽题按钮点击
 * 
 * 后续实现跳转或弹窗
 */
const handleRandom = () => {
  ElMessage.info('随机抽题功能开发中...')
}

// ========================================
// 辅助方法 - 标签显示转换
// ========================================

/**
 * 获取分类的中文显示名称
 * 
 * @param category - 分类英文标识
 * @returns 中文名称
 */
const getCategoryLabel = (category: string) => {
  const item = categoryOptions.find(c => c.value === category)
  return item?.label || category
}

/**
 * 获取分类对应的标签类型（颜色）
 * 
 * @param category - 分类英文标识
 * @returns Element Plus 标签类型
 */
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

/**
 * 获取题目类型的中文显示名称
 * 
 * @param type - 类型标识
 * @returns 中文名称
 */
const getTypeLabel = (type: string) => {
  const item = typeOptions.find(t => t.value === type)
  return item?.label || type
}

/**
 * 获取难度的中文显示名称
 * 
 * @param difficulty - 难度标识
 * @returns 中文名称
 */
const getDifficultyLabel = (difficulty: string) => {
  const item = difficultyOptions.find(d => d.value === difficulty)
  return item?.label || difficulty
}

/**
 * 获取难度对应的标签类型（颜色）
 * 
 * @param difficulty - 难度标识
 * @returns Element Plus 标签类型
 */
const getDifficultyType = (difficulty: string) => {
  const typeMap: Record<string, string> = {
    easy: 'success',    // 绿色 - 简单
    medium: 'warning',  // 橙色 - 中等
    hard: 'danger'      // 红色 - 困难
  }
  return typeMap[difficulty] || ''
}

// ========================================
// 生命周期钩子
// ========================================

/**
 * 组件挂载后执行
 * 
 * 1. 初始化题目数据（从 localStorage 或 mock 数据加载）
 * 2. 加载第一页列表数据
 */
onMounted(() => {
  interviewStore.loadQuestions()
  loadData()
})
</script>

<style scoped>
/**
 * 题库页面样式
 */

/* 页面容器 */
.question-page {
  padding: 0;
}

/* 页面头部 */
.page-header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

/* 头部左侧布局 */
.page-header .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 页面标题 */
.page-header .header-left .title {
  font-size: 20px;
  font-weight: 600;
}

/* 头部右侧按钮组 */
.page-header .header-right {
  display: flex;
  gap: 12px;
}

/* 筛选卡片间距 */
.filter-card {
  margin-bottom: 16px;
}

/* 题目标题行布局 */
.table-card .question-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 标签间距 */
.table-card .question-title .tag-item {
  margin-left: 4px;
}

/* 分页容器 */
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;  /* 右对齐 */
}
</style>
