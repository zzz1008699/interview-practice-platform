/**
 * 面试题库状态管理模块
 * 
 * 本模块使用 Pinia 管理面试题库的所有状态，包括：
 * - 题目列表的增删改查
 * - 收藏功能
 * - 分类统计
 * - 本地数据持久化
 * 
 * @module stores/interview
 */

import { defineStore } from 'pinia'
import type {
  InterviewQuestion,
  QuestionFormData,
  QuestionFilter,
  PaginationParams,
  PaginatedResult,
  QuestionCategory,
  QuestionType,
  DifficultyLevel
} from '@/types/interview'

// ============================================
// 模拟数据：初始面试题目
// ============================================

/**
 * 预设的面试题目数据
 * 用于首次访问时初始化题库
 */
const mockQuestions: InterviewQuestion[] = [
  {
    id: 1,
    title: 'Vue3 响应式原理是什么？',
    category: 'vue' as QuestionCategory,
    type: 'short_answer' as QuestionType,
    difficulty: 'medium' as DifficultyLevel,
    content: '请详细说明 Vue3 中响应式系统的实现原理，包括 ref 和 reactive 的区别。',
    answer: 'Vue3 使用 Proxy 替代 Object.defineProperty 实现响应式。ref 用于基本类型，返回包装对象；reactive 用于对象类型，返回代理对象。',
    explanation: 'Proxy 可以监听对象属性的增删改查，比 Object.defineProperty 更强大。',
    tags: ['vue3', '响应式', 'proxy'],
    isFavorite: false,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    title: 'JavaScript 中闭包的理解',
    category: 'javascript' as QuestionCategory,
    type: 'short_answer' as QuestionType,
    difficulty: 'medium' as DifficultyLevel,
    content: '什么是闭包？闭包有什么作用？请举例说明。',
    answer: '闭包是指有权访问另一个函数作用域中变量的函数。作用：数据私有化、缓存、实现模块化等。',
    explanation: '闭包会导致变量常驻内存，使用不当可能造成内存泄漏。',
    tags: ['闭包', '作用域', '内存管理'],
    isFavorite: true,
    createTime: '2024-01-14 14:30:00',
    updateTime: '2024-01-14 14:30:00'
  },
  {
    id: 3,
    title: 'CSS 中 Flex 布局常用属性',
    category: 'css' as QuestionCategory,
    type: 'multiple_choice' as QuestionType,
    difficulty: 'easy' as DifficultyLevel,
    content: '以下哪些是 Flex 布局的常用属性？',
    options: ['display: flex', 'justify-content', 'align-items', 'position: absolute'],
    answer: 'A,B,C',
    explanation: 'position: absolute 是定位属性，不属于 Flex 布局。',
    tags: ['flex', '布局', 'css3'],
    isFavorite: false,
    createTime: '2024-01-13 09:15:00',
    updateTime: '2024-01-13 09:15:00'
  }
]

// ============================================
// Store 定义
// ============================================

/**
 * 面试题库 Store
 * 
 * 提供完整的题目管理功能，包括：
 * - 状态管理：题目列表、加载状态
 * - 计算属性：收藏列表、分类统计
 * - 操作方法：增删改查、筛选分页、收藏切换
 * 
 * @example
 * // 在组件中使用
 * const interviewStore = useInterviewStore()
 * 
 * // 加载题目
 * await interviewStore.loadQuestions()
 * 
 * // 获取分页数据
 * const result = interviewStore.getPaginatedQuestions(filter, pagination)
 * 
 * // 添加题目
 * interviewStore.addQuestion({ title: '...', content: '...' })
 */
export const useInterviewStore = defineStore('interview', {
  // -----------------------------------------
  // State: 状态定义
  // -----------------------------------------
  state: () => ({
    /**
     * 题目列表
     * 存储所有面试题目的数组
     */
    questionList: [] as InterviewQuestion[],

    /**
     * 当前编辑/查看的题目
     * 用于编辑或详情页面的临时存储
     */
    currentQuestion: null as InterviewQuestion | null,

    /**
     * 加载状态
     * 用于显示加载动画
     */
    loading: false,

    /**
     * 分类统计
     * 记录每个分类的题目数量
     */
    categoryCount: {} as Record<string, number>
  }),

  // -----------------------------------------
  // Getters: 计算属性
  // -----------------------------------------
  getters: {
    /**
     * 获取收藏的题目列表
     * @param state - 当前状态
     * @returns 收藏的题目数组
     */
    favoriteQuestions: (state) => {
      return state.questionList.filter(q => q.isFavorite)
    },

    /**
     * 按分类获取题目
     * @param state - 当前状态
     * @returns 函数，传入分类名称返回对应题目数组
     * 
     * @example
     * const vueQuestions = interviewStore.getQuestionsByCategory('vue')
     */
    getQuestionsByCategory: (state) => {
      return (category: string) => {
        return state.questionList.filter(q => q.category === category)
      }
    },

    /**
     * 获取各分类的题目数量统计
     * @param state - 当前状态
     * @returns 分类统计对象，如 { vue: 10, react: 5 }
     */
    getCategoryStats: (state) => {
      const stats: Record<string, number> = {}
      state.questionList.forEach(q => {
        stats[q.category] = (stats[q.category] || 0) + 1
      })
      return stats
    }
  },

  // -----------------------------------------
  // Actions: 操作方法
  // -----------------------------------------
  actions: {
    /**
     * 初始化加载题目列表
     * 
     * 优先从 localStorage 读取已保存的数据，
     * 如果没有则使用 mock 数据初始化
     * 
     * @async
     * @returns Promise<void>
     */
    async loadQuestions() {
      this.loading = true
      try {
        // 尝试从 localStorage 读取已保存的题目数据
        const stored = localStorage.getItem('interview_questions')
        if (stored) {
          // 解析并恢复保存的数据
          this.questionList = JSON.parse(stored)
        } else {
          // 首次访问，使用 mock 数据初始化
          this.questionList = [...mockQuestions]
          this.saveToStorage()
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * 保存题目列表到 localStorage
     * 
     * 所有修改操作后都应调用此方法持久化数据
     */
    saveToStorage() {
      localStorage.setItem('interview_questions', JSON.stringify(this.questionList))
    },

    /**
     * 获取分页筛选后的题目列表
     * 
     * 支持多种筛选条件和分页功能
     * 
     * @param filter - 筛选条件对象
     * @param filter.keyword - 关键词搜索（标题、内容、标签）
     * @param filter.category - 分类筛选
     * @param filter.type - 题目类型筛选
     * @param filter.difficulty - 难度筛选
     * @param filter.isFavorite - 收藏状态筛选
     * @param pagination - 分页参数
     * @param pagination.page - 当前页码（从1开始）
     * @param pagination.pageSize - 每页数量
     * @returns 分页结果对象，包含列表和总数
     * 
     * @example
     * const result = interviewStore.getPaginatedQuestions(
     *   { keyword: 'vue', category: 'vue' },
     *   { page: 1, pageSize: 10 }
     * )
     * // result = { list: [...], total: 100, page: 1, pageSize: 10 }
     */
    getPaginatedQuestions(
      filter: QuestionFilter = {},
      pagination: PaginationParams = { page: 1, pageSize: 10 }
    ): PaginatedResult<InterviewQuestion> {
      // 复制一份列表，避免修改原始数据
      let result = [...this.questionList]

      // 关键词搜索：匹配标题、内容、标签
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase()
        result = result.filter(q =>
          q.title.toLowerCase().includes(keyword) ||
          q.content.toLowerCase().includes(keyword) ||
          q.tags.some(tag => tag.toLowerCase().includes(keyword))
        )
      }

      // 分类筛选
      if (filter.category) {
        result = result.filter(q => q.category === filter.category)
      }

      // 类型筛选
      if (filter.type) {
        result = result.filter(q => q.type === filter.type)
      }

      // 难度筛选
      if (filter.difficulty) {
        result = result.filter(q => q.difficulty === filter.difficulty)
      }

      // 收藏状态筛选
      if (filter.isFavorite !== undefined) {
        result = result.filter(q => q.isFavorite === filter.isFavorite)
      }

      // 按创建时间倒序排列（最新的在前面）
      result.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

      // 计算分页
      const total = result.length
      const start = (pagination.page - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      const list = result.slice(start, end)

      return {
        list,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize
      }
    },

    /**
     * 添加新题目
     * 
     * @param data - 题目表单数据
     * @returns 新创建的题目对象
     * 
     * @example
     * const newQuestion = interviewStore.addQuestion({
     *   title: 'Vue3 生命周期',
     *   content: '请说明 Vue3 的生命周期钩子...',
     *   category: 'vue',
     *   type: 'short_answer',
     *   difficulty: 'medium',
     *   answer: '...',
     *   explanation: '...',
     *   tags: ['vue3', '生命周期']
     * })
     */
    addQuestion(data: QuestionFormData) {
      const now = new Date().toLocaleString()
      const newQuestion: InterviewQuestion = {
        ...data,
        id: Date.now(), // 使用时间戳作为唯一ID
        isFavorite: false, // 新题目默认未收藏
        createTime: now,
        updateTime: now
      }
      // 添加到列表开头
      this.questionList.unshift(newQuestion)
      this.saveToStorage()
      return newQuestion
    },

    /**
     * 更新题目
     * 
     * 根据题目ID更新指定题目的信息
     * 只更新传入的字段，未传入的字段保持原值
     * 
     * @param id - 题目ID
     * @param data - 要更新的字段（Partial 表示可选）
     * @returns 更新后的题目对象，如果未找到返回 null
     * 
     * @example
     * interviewStore.updateQuestion(1, { title: '新标题', difficulty: 'hard' })
     */
    updateQuestion(id: number, data: Partial<QuestionFormData>) {
      const existing = this.questionList.find(q => q.id === id)
      if (existing) {
        // 构建更新后的题目对象，使用 ?? 运算符保持原值
        const updatedQuestion: InterviewQuestion = {
          id: existing.id,
          title: data.title ?? existing.title,
          category: data.category ?? existing.category,
          type: data.type ?? existing.type,
          difficulty: data.difficulty ?? existing.difficulty,
          content: data.content ?? existing.content,
          options: data.options ?? existing.options,
          answer: data.answer ?? existing.answer,
          explanation: data.explanation ?? existing.explanation,
          tags: data.tags ?? existing.tags,
          isFavorite: existing.isFavorite,
          createTime: existing.createTime,
          updateTime: new Date().toLocaleString() // 更新时间
        }
        const index = this.questionList.findIndex(q => q.id === id)
        this.questionList[index] = updatedQuestion
        this.saveToStorage()
        return updatedQuestion
      }
      return null
    },

    /**
     * 删除题目
     * 
     * @param id - 要删除的题目ID
     * @returns 删除成功返回 true，未找到返回 false
     */
    deleteQuestion(id: number) {
      const index = this.questionList.findIndex(q => q.id === id)
      if (index > -1) {
        this.questionList.splice(index, 1)
        this.saveToStorage()
        return true
      }
      return false
    },

    /**
     * 切换题目的收藏状态
     * 
     * @param id - 题目ID
     * @returns 切换后的收藏状态（true=已收藏，false=未收藏）
     * 
     * @example
     * const isFav = interviewStore.toggleFavorite(1)
     * console.log(isFav ? '已收藏' : '已取消收藏')
     */
    toggleFavorite(id: number) {
      const question = this.questionList.find(q => q.id === id)
      if (question) {
        question.isFavorite = !question.isFavorite
        this.saveToStorage()
        return question.isFavorite
      }
      return false
    },

    /**
     * 根据ID获取题目详情
     * 
     * @param id - 题目ID
     * @returns 题目对象，未找到返回 null
     */
    getQuestionById(id: number): InterviewQuestion | null {
      return this.questionList.find(q => q.id === id) || null
    },

    /**
     * 随机获取指定数量的题目
     * 
     * 用于模拟面试功能，随机抽取题目
     * 
     * @param count - 要获取的题目数量，默认5道
     * @returns 随机题目数组
     * 
     * @example
     * // 随机抽取10道题目
     * const randomQuestions = interviewStore.getRandomQuestions(10)
     */
    getRandomQuestions(count: number = 5): InterviewQuestion[] {
      // 使用 Fisher-Yates 洗牌算法的简化版
      const shuffled = [...this.questionList].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, Math.min(count, shuffled.length))
    }
  }
})
