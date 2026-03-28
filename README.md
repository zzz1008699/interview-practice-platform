# 面试刷题平台

一个基于 Vue3 + TypeScript + Pinia 的前端面试题库管理系统，帮助前端开发者系统化准备面试。

## 在线预览

- **Vercel 部署**: https://interview-practice-platform-silk.vercel.app
- **GitHub 仓库**: https://github.com/ZZZ1008699/interview-practice-platform

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **开发语言**: TypeScript
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 功能特性

### 面试题库管理
- ✅ 题目增删改查（CRUD）
- ✅ 分类筛选（HTML/CSS、JavaScript、Vue、React、TypeScript 等）
- ✅ 难度筛选（简单、中等、困难）
- ✅ 收藏功能，快速标记重点题目
- ✅ 题目详情查看，支持代码高亮

### 用户管理
- ✅ 用户登录/注册
- ✅ 用户列表展示
- ✅ 用户信息编辑
- ✅ 权限控制

### 数据统计
- ✅ 分类题目数量统计
- ✅ 难度分布图表
- ✅ 收藏题目统计

### 其他特性
- ✅ 响应式布局，适配多端
- ✅ 数据持久化存储（LocalStorage）
- ✅ 路由守卫，权限验证
- ✅ 表单验证

## 项目结构

```
admin-project/
├── src/
│   ├── components/          # 公共组件
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── Login.vue        # 登录页
│   │   ├── User.vue         # 用户管理
│   │   ├── Layout.vue       # 布局组件
│   │   └── interview/       # 面试题库模块
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── public/                  # 静态资源
├── dist/                    # 构建输出
├── index.html               # HTML 模板
├── package.json             # 项目依赖
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目亮点

1. **Vue3 深度实践**
   - 使用 `<script setup>` 语法糖
   - Composition API 组织代码
   - 生命周期钩子的正确使用

2. **TypeScript 类型安全**
   - 完整的类型定义
   - 接口（Interface）和类型别名（Type）
   - 泛型应用

3. **Pinia 状态管理**
   - 替代 Vuex，更轻量
   - 数据持久化存储
   - 模块化组织

4. **组件化开发**
   - 封装可复用业务组件
   - Props / Emits 规范
   - 插槽（Slot）使用

5. **工程化实践**
   - ESLint + Prettier 代码规范
   - Git 版本管理
   - 自动化构建部署

## 学习收获

通过本项目，我掌握了：

- Vue3 + TypeScript 企业级开发流程
- 中后台管理系统的设计与实现
- 组件封装和复用的最佳实践
- 前端工程化和代码规范
- Git 版本管理和开源协作

## 待优化项

- [ ] 接入真实后端 API
- [ ] 添加单元测试
- [ ] 性能优化（懒加载、虚拟滚动）
- [ ] 暗黑模式支持
- [ ] 国际化支持

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

**如果觉得这个项目对你有帮助，欢迎 Star ⭐**
