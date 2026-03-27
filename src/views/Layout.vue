<!--
  布局组件 - Layout.vue
  
  本组件是整个应用的布局框架，提供：
  - 顶部固定导航栏（包含 Logo、菜单、用户信息）
  - 主内容区域（路由出口）
  - 响应式布局支持
  
  使用方式：在路由配置中作为父组件，子页面通过 <router-view /> 渲染
-->

<template>
  <!-- 
    布局容器
    el-container: Element Plus 布局容器组件
    class="layout-container": 自定义样式类
  -->
  <el-container class="layout-container">
    
    <!-- 
      ========================================
      顶部导航栏
      ========================================
      el-header: 顶部栏组件
      position: fixed - 固定定位，滚动时保持可见
      z-index: 1000 - 确保在最上层
    -->
    <el-header class="header">
      
      <!-- 
        Logo 区域
        点击可返回首页
      -->
      <div class="logo" @click="router.push('/home')">
        <!-- 
          el-icon: Element Plus 图标组件
          size="28": 图标大小 28px
          DocumentChecked: 文档勾选图标
        -->
        <el-icon size="28"><DocumentChecked /></el-icon>
        <span class="title">面试刷题平台</span>
      </div>
      
      <!-- 
        导航菜单区域
        el-menu: 菜单组件
        mode="horizontal": 水平模式
        router: 启用 Vue Router 模式，点击菜单项自动跳转
        :default-active: 当前激活的菜单项，高亮显示
      -->
      <div class="nav-menu">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-el-menu"
        >
          <!-- 
            首页菜单项
            index="/home": 路由路径
          -->
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <!-- 面试题库菜单项 -->
          <el-menu-item index="/interview">
            <el-icon><Collection /></el-icon>
            <span>面试题库</span>
          </el-menu-item>
          
          <!-- 用户管理菜单项 -->
          <el-menu-item index="/user">
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 
        用户信息区域
        el-dropdown: 下拉菜单组件
        @command: 点击菜单项时触发，传入 command 值
      -->
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <!-- 触发下拉的用户名区域 -->
          <span class="user-name">
            <el-icon><Avatar /></el-icon>
            <!-- 
              显示用户名，如果不存在显示'用户'
              ?. 是可选链操作符，避免 null/undefined 报错
            -->
            {{ userStore.userInfo?.name || '用户' }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          
          <!-- 下拉菜单内容 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <!-- divided: 显示分隔线 -->
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 
      ========================================
      主内容区 - 路由出口
      ========================================
      el-main: 主内容区域
      <router-view />: Vue Router 路由出口，子页面在这里渲染
      margin-top: 60px - 为固定导航栏留出空间
    -->
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
/**
 * 布局组件脚本
 * 
 * 提供全局布局功能和用户操作处理
 */

import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  Collection,
  UserFilled,
  DocumentChecked,
  Avatar,
  ArrowDown
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// ========================================
// 响应式数据与计算属性
// ========================================

/**
 * 用户状态管理 Store
 * 用于获取当前登录用户信息和执行登出操作
 */
const userStore = useUserStore()

/**
 * Vue Router 实例
 * 用于编程式导航（跳转页面）
 */
const router = useRouter()

/**
 * 当前路由信息
 * 用于获取当前路径，设置菜单高亮
 */
const route = useRoute()

/**
 * 当前激活的菜单项
 * 计算属性，根据当前路由路径自动更新
 * 用于高亮显示当前所在的导航菜单
 */
const activeMenu = computed(() => route.path)

// ========================================
// 事件处理方法
// ========================================

/**
 * 处理下拉菜单命令
 * 
 * @param command - 菜单项命令值
 *                'profile': 个人中心
 *                'settings': 系统设置
 *                'logout': 退出登录
 */
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // 功能开发中提示
      ElMessage.info('个人中心功能开发中...')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      // 执行登出操作
      logout()
      break
  }
}

/**
 * 用户登出
 * 
 * 1. 调用 Store 的 logout 方法清除登录状态
 * 2. 跳转到登录页面
 */
const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/**
 * 布局样式
 * 使用 scoped 属性，样式只作用于当前组件
 */

/* 布局容器 - 占满整个视口 */
.layout-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 
  顶部导航栏样式
  position: fixed - 固定定位
  z-index: 1000 - 确保在最上层
*/
.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Logo 区域样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer; /* 鼠标悬停显示手型 */
}

.logo .title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

/* 导航菜单区域 */
.nav-menu {
  flex: 1; /* 占据剩余空间 */
  margin: 0 40px;
}

/* 菜单组件样式覆盖 */
.nav-el-menu {
  border-bottom: none; /* 移除默认底部边框 */
}

/* 用户信息区域 */
.user-info .user-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
}

/* 用户名悬停效果 */
.user-info .user-name:hover {
  color: #409eff; /* Element Plus 主题蓝色 */
}

/* 
  主内容区域
  margin-top: 60px - 为固定导航栏留出空间（导航栏高度）
  min-height: calc(100vh - 60px) - 确保最小高度填满视口
*/
.main-content {
  padding: 24px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}
</style>
