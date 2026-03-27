<!--
  首页组件 - Home.vue
  
  本组件是应用的仪表盘首页，展示：
  - 数据统计卡片（总题目数、收藏数、练习数、正确率）
  - 功能入口（面试题库、随机练习）
  - 分类统计（各技术分类的题目数量）
  
  数据来源于 interviewStore，页面加载时自动初始化
-->

<template>
  <!-- 首页容器 -->
  <div class="home-page">
    
    <!-- 
      ========================================
      统计卡片区域
      ========================================
      el-row: 行容器，:gutter="20" 设置列间距为20px
      el-col: 列容器，:span="6" 表示占6/24（即1/4）宽度
    -->
    <el-row :gutter="20" class="stats-row">
      
      <!-- 总题目数卡片 -->
      <el-col :span="6">
        <!-- 
          el-card: 卡片组件
          shadow="hover": 鼠标悬停时显示阴影
        -->
        <el-card class="stat-card" shadow="hover">
          <!-- 图标区域 - 蓝色主题 -->
          <div class="stat-icon blue">
            <el-icon><Collection /></el-icon>
          </div>
          <!-- 数据信息 -->
          <div class="stat-info">
            <!-- 数值：从 store 获取题目总数 -->
            <div class="stat-value">{{ interviewStore.questionList.length }}</div>
            <div class="stat-label">总题目数</div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 已收藏卡片 -->
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <!-- 图标区域 - 橙色主题 -->
          <div class="stat-icon orange">
            <el-icon><StarFilled /></el-icon>
          </div>
          <div class="stat-info">
            <!-- 数值：从 store 获取收藏题目数 -->
            <div class="stat-value">{{ interviewStore.favoriteQuestions.length }}</div>
            <div class="stat-label">已收藏</div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 今日练习卡片（静态数据） -->
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <!-- 图标区域 - 绿色主题 -->
          <div class="stat-icon green">
            <el-icon><View /></el-icon>
          </div>
          <div class="stat-info">
            <!-- 静态数值，后续可对接真实数据 -->
            <div class="stat-value">12</div>
            <div class="stat-label">今日练习</div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 正确率卡片（静态数据） -->
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <!-- 图标区域 - 紫色主题 -->
          <div class="stat-icon purple">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <!-- 静态数值，后续可对接真实数据 -->
            <div class="stat-value">85%</div>
            <div class="stat-label">正确率</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 
      ========================================
      功能入口区域
      ========================================
      提供主要功能的快捷入口
    -->
    <el-row :gutter="20" class="feature-row">
      
      <!-- 面试题库入口 -->
      <el-col :span="12">
        <!-- 
          @click="$router.push('/interview')": 点击跳转到题库页面
          cursor: pointer 样式在 CSS 中定义
        -->
        <el-card class="feature-card" shadow="hover" @click="$router.push('/interview')">
          <div class="feature-content">
            <!-- 功能图标 - 渐变色背景 -->
            <div class="feature-icon primary">
              <el-icon size="48"><Collection /></el-icon>
            </div>
            <div class="feature-info">
              <h3>面试题库</h3>
              <p>海量前端面试题，涵盖 Vue、React、JavaScript 等热门技术栈</p>
              <!-- 主要操作按钮 -->
              <el-button type="primary">进入题库</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 随机练习入口 -->
      <el-col :span="12">
        <el-card class="feature-card" shadow="hover" @click="handleRandomPractice">
          <div class="feature-content">
            <!-- 功能图标 - 绿色渐变色 -->
            <div class="feature-icon success">
              <el-icon size="48"><VideoPlay /></el-icon>
            </div>
            <div class="feature-info">
              <h3>随机练习</h3>
              <p>随机抽题模拟面试场景，检验你的知识掌握程度</p>
              <!-- 成功样式按钮 -->
              <el-button type="success">开始练习</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 
      ========================================
      分类统计区域
      ========================================
      展示各技术分类的题目数量统计
    -->
    <el-card class="category-card" shadow="never">
      <!-- 卡片头部：标题 + 操作按钮 -->
      <template #header>
        <div class="card-header">
          <span>分类统计</span>
          <!-- link 类型按钮，纯文字样式 -->
          <el-button type="primary" link @click="$router.push('/interview')">
            查看全部
          </el-button>
        </div>
      </template>
      
      <!-- 分类列表 -->
      <el-row :gutter="16">
        <!-- 
          v-for: 遍历分类统计数据
          interviewStore.getCategoryStats 返回 { category: count } 对象
        -->
        <el-col
          v-for="(count, category) in interviewStore.getCategoryStats"
          :key="category"
          :span="4"
        >
          <!-- 分类项，点击可筛选该分类 -->
          <div class="category-item" @click="goToCategory(category)">
            <!-- 分类名称：通过映射转换为中文 -->
            <div class="category-name">{{ getCategoryLabel(category) }}</div>
            <!-- 题目数量 -->
            <div class="category-count">{{ count }} 题</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页组件脚本
 * 
 * 功能：
 * - 页面加载时初始化题目数据
 * - 提供分类标签映射
 * - 处理页面跳转和功能入口点击
 */

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Collection,
  StarFilled,
  View,
  TrendCharts,
  VideoPlay
} from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'

// ========================================
// Store 和 Router
// ========================================

/**
 * 面试题库状态管理 Store
 * 用于获取题目统计数据
 */
const interviewStore = useInterviewStore()

/**
 * Vue Router 实例
 * 用于页面跳转
 */
const router = useRouter()

// ========================================
// 数据定义
// ========================================

/**
 * 分类标签映射表
 * 将英文分类标识转换为中文显示名称
 * 
 * @example
 * getCategoryLabel('javascript') // 返回 'JavaScript'
 */
const categoryLabels: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  vue: 'Vue',
  react: 'React',
  css: 'CSS',
  html: 'HTML',
  browser: '浏览器',
  network: '网络',
  algorithm: '算法',
  engineering: '工程化',
  performance: '性能',
  security: '安全'
}

// ========================================
// 方法定义
// ========================================

/**
 * 获取分类的中文显示名称
 * 
 * @param category - 分类英文标识
 * @returns 分类中文名称，如果未找到映射则返回原值
 */
const getCategoryLabel = (category: string) => {
  return categoryLabels[category] || category
}

/**
 * 处理随机练习按钮点击
 * 
 * 目前显示开发中提示，后续实现随机抽题功能
 */
const handleRandomPractice = () => {
  ElMessage.info('随机练习功能开发中...')
}

/**
 * 跳转到指定分类的题目列表
 * 
 * @param category - 分类标识
 * 
 * 通过 query 参数传递分类，题库页面会自动筛选
 */
const goToCategory = (category: string) => {
  router.push({
    path: '/interview',
    query: { category }  // URL 会变成 /interview?category=vue
  })
}

// ========================================
// 生命周期钩子
// ========================================

/**
 * 组件挂载后执行
 * 
 * 调用 loadQuestions() 从 localStorage 或 mock 数据加载题目列表
 * 确保首页统计数据是最新的
 */
onMounted(() => {
  interviewStore.loadQuestions()
})
</script>

<style scoped>
/**
 * 首页样式
 * 使用 scoped 属性确保样式只作用于当前组件
 */

/* 页面容器 */
.home-page {
  padding: 0;
}

/* 统计卡片行间距 */
.stats-row {
  margin-bottom: 24px;
}

/* 
  统计卡片内容布局
  :deep(.el-card__body) - 深度选择器，穿透组件作用域修改 Element Plus 内部样式
  display: flex - 弹性布局，图标和文字水平排列
*/
.stats-row .stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  padding: 20px;
}

/* 统计图标容器 */
.stats-row .stat-card .stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

/* 蓝色主题 - 总题目数 */
.stats-row .stat-card .stat-icon.blue {
  background: #ecf5ff;  /* 浅蓝背景 */
  color: #409eff;       /* Element Plus 主题蓝 */
}

/* 橙色主题 - 已收藏 */
.stats-row .stat-card .stat-icon.orange {
  background: #fdf6ec;  /* 浅橙背景 */
  color: #e6a23c;       /* Element Plus 警告色 */
}

/* 绿色主题 - 今日练习 */
.stats-row .stat-card .stat-icon.green {
  background: #f0f9eb;  /* 浅绿背景 */
  color: #67c23a;       /* Element Plus 成功色 */
}

/* 紫色主题 - 正确率 */
.stats-row .stat-card .stat-icon.purple {
  background: #f5f0ff;  /* 浅紫背景 */
  color: #9254de;
}

/* 统计图标大小 */
.stats-row .stat-card .stat-icon .el-icon {
  font-size: 28px;
}

/* 统计数值样式 */
.stats-row .stat-card .stat-info .stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;  /* 主要文字颜色 */
  line-height: 1;
}

/* 统计标签样式 */
.stats-row .stat-card .stat-info .stat-label {
  font-size: 14px;
  color: #909399;  /* 次要文字颜色 */
  margin-top: 8px;
}

/* 功能入口行间距 */
.feature-row {
  margin-bottom: 24px;
}

/* 功能卡片基础样式 */
.feature-row .feature-card {
  cursor: pointer;  /* 鼠标悬停显示手型 */
  transition: all 0.3s;  /* 过渡动画 */
}

/* 功能卡片悬停效果 - 上浮动画 */
.feature-row .feature-card:hover {
  transform: translateY(-4px);
}

/* 功能卡片内容区域 */
.feature-row .feature-card :deep(.el-card__body) {
  padding: 24px;
}

/* 功能内容布局 */
.feature-row .feature-card .feature-content {
  display: flex;
  align-items: center;
  gap: 24px;  /* 图标和文字间距 */
}

/* 功能图标容器 */
.feature-row .feature-card .feature-content .feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;  /* 不压缩 */
}

/* 题库入口图标 - 紫蓝渐变 */
.feature-row .feature-card .feature-content .feature-icon.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

/* 练习入口图标 - 青绿渐变 */
.feature-row .feature-card .feature-content .feature-icon.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
}

/* 功能信息区域 */
.feature-row .feature-card .feature-content .feature-info {
  flex: 1;  /* 占据剩余空间 */
}

/* 功能标题 */
.feature-row .feature-card .feature-content .feature-info h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 8px;
}

/* 功能描述 */
.feature-row .feature-card .feature-content .feature-info p {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
  line-height: 1.6;
}

/* 分类卡片头部布局 */
.category-card .card-header {
  display: flex;
  justify-content: space-between;  /* 两端对齐 */
  align-items: center;
}

/* 分类项容器 */
.category-card .category-item {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

/* 分类项悬停效果 */
.category-card .category-item:hover {
  background: #ecf5ff;  /* 浅蓝背景 */
  transform: translateY(-2px);  /* 轻微上浮 */
}

/* 分类名称 */
.category-card .category-item .category-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

/* 分类题目数量 */
.category-card .category-item .category-count {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;  /* 主题蓝色 */
}
</style>
