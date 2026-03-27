<!--
  用户管理页面 - User.vue
  
  本组件提供完整的用户管理功能：
  - 用户列表展示（表格形式）
  - 搜索筛选（关键词、状态）
  - 分页功能
  - 用户增删改查
  - 用户状态切换（启用/禁用）
  - 用户详情查看
  
  使用模拟数据 mockUsers 进行演示
-->

<template>
  <!-- 页面容器 -->
  <div class="user-page">
    
    <!-- 
      ========================================
      页面头部
      ========================================
      包含页面标题、用户总数统计、新增按钮
    -->
    <div class="page-header">
      <div class="header-left">
        <span class="title">用户管理</span>
        <el-tag type="info">共 {{ total }} 人</el-tag>
      </div>
      <div class="header-right">
        <!-- 新增用户按钮 -->
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增用户
        </el-button>
      </div>
    </div>

    <!-- 
      ========================================
      搜索筛选区域
      ========================================
    -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <!-- 关键词搜索 -->
        <el-form-item label="关键词">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索姓名/邮箱/手机号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <!-- 状态筛选 -->
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 
      ========================================
      数据表格区域
      ========================================
    -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="userList"
        border
        stripe
        highlight-current-row
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <!-- 用户信息列 - 自定义渲染 -->
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info-cell">
              <!-- 头像，如果没有则显示名字首字母 -->
              <el-avatar :size="40" :src="row.avatar">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div class="user-details">
                <div class="user-name">{{ row.name }}</div>
                <div class="user-email">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 角色列 -->
        <el-table-column label="角色" width="120" align="center">
          <template #default="{ row }">
            <!-- 管理员显示红色标签，普通用户显示灰色 -->
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 状态列 - 使用开关组件 -->
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="disabled"
              @change="(val: string | number | boolean) => handleStatusChange(row, val as string)"
            />
          </template>
        </el-table-column>
        
        <!-- 创建时间列 -->
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        
        <!-- 最后登录时间列 -->
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" align="center" />
        
        <!-- 操作列 -->
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="primary" link @click="handleView(row)">
              <el-icon><View /></el-icon>查看
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
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
      复用同一个对话框，通过 dialogType 区分
    -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
      destroy-on-close
    >
      <!-- 
        用户表单
        ref="formRef": 用于获取表单实例进行验证
        :rules="formRules": 表单验证规则
      -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <!-- 对话框底部按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 
      ========================================
      用户详情抽屉
      ========================================
      从右侧滑出显示用户详细信息
    -->
    <el-drawer
      v-model="drawerVisible"
      title="用户详情"
      size="400px"
    >
      <div v-if="currentUser" class="user-detail">
        <!-- 头部：头像、姓名、角色 -->
        <div class="detail-header">
          <el-avatar :size="80" :src="currentUser.avatar">
            {{ currentUser.name.charAt(0) }}
          </el-avatar>
          <h3>{{ currentUser.name }}</h3>
          <el-tag :type="currentUser.role === 'admin' ? 'danger' : 'info'">
            {{ currentUser.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </div>
        
        <!-- 详细信息列表 -->
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentUser.status === 'active' ? 'success' : 'danger'">
              {{ currentUser.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentUser.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ currentUser.lastLoginTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户管理页面脚本
 * 
 * 功能：
 * - 用户列表的展示、筛选、分页
 * - 用户的增删改查操作
 * - 用户状态管理
 * - 表单验证
 */

import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Search, Edit, View, Delete } from '@element-plus/icons-vue'

// ========================================
// 类型定义
// ========================================

/**
 * 用户数据类型
 */
interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  role: 'admin' | 'user'
  status: 'active' | 'disabled'
  createTime: string
  lastLoginTime: string
}

/**
 * 筛选表单类型
 */
interface FilterForm {
  keyword: string
  status: string
}

// ========================================
// 响应式数据
// ========================================

/** 加载状态 */
const loading = ref(false)

/** 用户列表数据 */
const userList = ref<User[]>([])

/** 用户总数 */
const total = ref(0)

/**
 * 筛选表单数据
 */
const filterForm = reactive<FilterForm>({
  keyword: '',
  status: ''
})

/**
 * 分页参数
 */
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ========================================
// 对话框相关数据
// ========================================

/** 对话框显示状态 */
const dialogVisible = ref(false)

/** 对话框类型：add=新增, edit=编辑 */
const dialogType = ref<'add' | 'edit'>('add')

/** 表单实例引用，用于表单验证 */
const formRef = ref<FormInstance>()

/**
 * 表单数据
 * 用于新增和编辑用户
 */
const formData = reactive({
  id: 0,
  name: '',
  email: '',
  phone: '',
  role: 'user' as 'admin' | 'user',
  status: 'active' as 'active' | 'disabled'
})

/**
 * 表单验证规则
 */
const formRules: FormRules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// ========================================
// 抽屉相关数据
// ========================================

/** 抽屉显示状态 */
const drawerVisible = ref(false)

/** 当前查看的用户详情 */
const currentUser = ref<User | null>(null)

// ========================================
// 模拟数据
// ========================================

/**
 * 模拟用户数据
 * 实际项目中应从后端 API 获取
 */
const mockUsers: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: '',
    role: 'admin',
    status: 'active',
    createTime: '2024-01-15 10:30:00',
    lastLoginTime: '2024-03-27 09:15:00'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: '',
    role: 'user',
    status: 'active',
    createTime: '2024-01-20 14:20:00',
    lastLoginTime: '2024-03-26 16:45:00'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    avatar: '',
    role: 'user',
    status: 'disabled',
    createTime: '2024-02-01 09:00:00',
    lastLoginTime: '2024-03-20 11:30:00'
  }
]

// ========================================
// 方法定义
// ========================================

/**
 * 加载用户列表数据
 * 
 * 根据当前筛选条件和分页参数处理数据
 */
const loadData = () => {
  loading.value = true
  // 复制一份数据，避免修改原始数据
  let result = [...mockUsers]
  
  // 关键词筛选：匹配姓名、邮箱、手机号
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase()
    result = result.filter(u =>
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword) ||
      u.phone.includes(keyword)
    )
  }
  
  // 状态筛选
  if (filterForm.status) {
    result = result.filter(u => u.status === filterForm.status)
  }
  
  // 更新总数
  total.value = result.length
  
  // 分页处理
  const start = (pagination.page - 1) * pagination.pageSize
  userList.value = result.slice(start, start + pagination.pageSize)
  
  loading.value = false
}

/**
 * 搜索按钮点击处理
 */
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

/**
 * 重置筛选条件
 */
const handleReset = () => {
  filterForm.keyword = ''
  filterForm.status = ''
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
 * 新增用户按钮点击
 */
const handleAdd = () => {
  dialogType.value = 'add'
  // 重置表单数据
  Object.assign(formData, {
    id: 0,
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  })
  dialogVisible.value = true
}

/**
 * 编辑用户按钮点击
 * 
 * @param row - 要编辑的用户对象
 */
const handleEdit = (row: User) => {
  dialogType.value = 'edit'
  // 将用户数据复制到表单
  Object.assign(formData, row)
  dialogVisible.value = true
}

/**
 * 查看用户详情
 * 
 * @param row - 要查看的用户对象
 */
const handleView = (row: User) => {
  currentUser.value = row
  drawerVisible.value = true
}

/**
 * 删除用户
 * 
 * @param row - 要删除的用户对象
 */
const handleDelete = async (row: User) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(`确定删除用户"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    // 从数组中删除
    const index = mockUsers.findIndex(u => u.id === row.id)
    if (index > -1) {
      mockUsers.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  } catch {
    // 用户取消删除
  }
}

/**
 * 用户状态切换
 * 
 * @param row - 要切换状态的用户
 * @param val - 新状态值
 */
const handleStatusChange = (row: User, val: string) => {
  const status = val as 'active' | 'disabled'
  row.status = status
  ElMessage.success(status === 'active' ? '已启用' : '已禁用')
}

/**
 * 表单提交
 * 
 * 验证表单数据，根据 dialogType 执行新增或编辑操作
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  // 表单验证
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 新增用户
        const newUser: User = {
          ...formData,
          id: Date.now(),  // 使用时间戳作为唯一ID
          avatar: '',
          createTime: new Date().toLocaleString(),
          lastLoginTime: '-'
        }
        mockUsers.unshift(newUser)  // 添加到数组开头
        ElMessage.success('新增成功')
      } else {
        // 编辑用户
        const index = mockUsers.findIndex(u => u.id === formData.id)
        if (index > -1) {
          const user = mockUsers[index]
          if (user) {
            Object.assign(user, formData)
            ElMessage.success('编辑成功')
          }
        }
      }
      dialogVisible.value = false
      loadData()
    }
  })
}

// ========================================
// 生命周期钩子
// ========================================

/**
 * 组件挂载后执行
 * 
 * 加载初始数据
 */
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/**
 * 用户管理页面样式
 */

/* 页面容器 */
.user-page {
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

/* 头部左侧 */
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

/* 头部右侧 */
.page-header .header-right {
  display: flex;
  gap: 12px;
}

/* 筛选卡片 */
.filter-card {
  margin-bottom: 16px;
}

/* 用户信息单元格布局 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 用户详情区域 */
.user-info-cell .user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 用户姓名 */
.user-info-cell .user-details .user-name {
  font-weight: 500;
  color: #303133;
}

/* 用户邮箱 */
.user-info-cell .user-details .user-email {
  font-size: 12px;
  color: #909399;
}

/* 分页容器 */
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 用户详情抽屉 */
.user-detail {
  padding: 20px;
}

/* 详情头部 */
.user-detail .detail-header {
  text-align: center;
  margin-bottom: 24px;
}

/* 详情头部标题 */
.user-detail .detail-header h3 {
  margin: 12px 0;
  color: #303133;
}
</style>
