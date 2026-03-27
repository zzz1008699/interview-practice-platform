/**
 * 面试题库类型定义模块
 * 
 * 本模块定义了面试题库系统中使用的所有 TypeScript 类型、接口和枚举
 * 包括题目类型、分类、难度等级以及各种数据结构
 * 
 * @module types/interview
 */

// ============================================
// 枚举类型定义
// ============================================

/**
 * 题目类型枚举
 * 
 * 定义了面试题目的各种题型
 */
export enum QuestionType {
  /** 单选题 */
  SINGLE_CHOICE = 'single_choice',
  /** 多选题 */
  MULTIPLE_CHOICE = 'multiple_choice',
  /** 填空题 */
  FILL_BLANK = 'fill_blank',
  /** 简答题 */
  SHORT_ANSWER = 'short_answer',
  /** 编程题 */
  CODE = 'code',
}

/**
 * 题目分类枚举
 * 
 * 定义了面试题目所属的技术分类
 */
export enum QuestionCategory {
  /** JavaScript */
  JAVASCRIPT = 'javascript',
  /** TypeScript */
  TYPESCRIPT = 'typescript',
  /** Vue */
  VUE = 'vue',
  /** React */
  REACT = 'react',
  /** CSS */
  CSS = 'css',
  /** HTML */
  HTML = 'html',
  /** 浏览器原理 */
  BROWSER = 'browser',
  /** 网络 */
  NETWORK = 'network',
  /** 算法 */
  ALGORITHM = 'algorithm',
  /** 工程化 */
  ENGINEERING = 'engineering',
  /** 性能优化 */
  PERFORMANCE = 'performance',
  /** 安全 */
  SECURITY = 'security',
}

/**
 * 难度等级枚举
 * 
 * 定义了面试题目的难度级别
 */
export enum DifficultyLevel {
  /** 简单 */
  EASY = 'easy',
  /** 中等 */
  MEDIUM = 'medium',
  /** 困难 */
  HARD = 'hard',
}

// ============================================
// 接口类型定义
// ============================================

/**
 * 面试题目接口
 * 
 * 定义了面试题目的完整数据结构
 * 
 * @example
 * const question: InterviewQuestion = {
 *   id: 1,
 *   title: 'Vue3 响应式原理',
 *   category: QuestionCategory.VUE,
 *   type: QuestionType.SHORT_ANSWER,
 *   difficulty: DifficultyLevel.MEDIUM,
 *   content: '请说明 Vue3 响应式原理...',
 *   answer: 'Vue3 使用 Proxy...',
 *   tags: ['vue3', '响应式'],
 *   isFavorite: false,
 *   createTime: '2024-01-15 10:00:00',
 *   updateTime: '2024-01-15 10:00:00'
 * }
 */
export interface InterviewQuestion {
  /** 题目唯一标识 */
  id: number;
  /** 题目标题 */
  title: string;
  /** 题目分类 */
  category: QuestionCategory;
  /** 题目类型 */
  type: QuestionType;
  /** 难度等级 */
  difficulty: DifficultyLevel;
  /** 题目内容 */
  content: string;
  /** 选项（选择题使用） */
  options?: string[];
  /** 参考答案 */
  answer: string;
  /** 解析说明 */
  explanation?: string;
  /** 标签数组 */
  tags: string[];
  /** 是否收藏 */
  isFavorite: boolean;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 创建/编辑题目的表单数据类型
 * 
 * 用于新增或编辑题目时提交的数据结构
 * 不包含 id、createTime、updateTime、isFavorite 等自动生成的字段
 */
export interface QuestionFormData {
  /** 题目标题 */
  title: string;
  /** 题目分类 */
  category: QuestionCategory;
  /** 题目类型 */
  type: QuestionType;
  /** 难度等级 */
  difficulty: DifficultyLevel;
  /** 题目内容 */
  content: string;
  /** 选项（选择题使用） */
  options?: string[];
  /** 参考答案 */
  answer: string;
  /** 解析说明 */
  explanation?: string;
  /** 标签数组 */
  tags: string[];
}

/**
 * 搜索筛选条件类型
 * 
 * 用于题目列表的筛选查询
 * 所有字段都是可选的
 */
export interface QuestionFilter {
  /** 关键词搜索（匹配标题、内容、标签） */
  keyword?: string;
  /** 分类筛选 */
  category?: QuestionCategory;
  /** 类型筛选 */
  type?: QuestionType;
  /** 难度筛选 */
  difficulty?: DifficultyLevel;
  /** 仅显示收藏的题目 */
  isFavorite?: boolean;
}

/**
 * 分页参数类型
 * 
 * 用于列表数据的分页查询
 */
export interface PaginationParams {
  /** 当前页码（从1开始） */
  page: number;
  /** 每页条数 */
  pageSize: number;
}

/**
 * 分页响应数据类型
 * 
 * 泛型接口，可用于任何列表数据的分页返回
 * 
 * @template T - 列表项的数据类型
 * 
 * @example
 * // 面试题目分页结果
 * const result: PaginatedResult<InterviewQuestion> = {
 *   list: [...],
 *   total: 100,
 *   page: 1,
 *   pageSize: 10
 * }
 */
export interface PaginatedResult<T> {
  /** 数据列表 */
  list: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
}
