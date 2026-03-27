<template>
  <el-dialog
    :title="dialogTitle"
    v-model="visible"
    width="700px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="题目标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入题目标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="题目分类" prop="category">
            <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="题目类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="难度等级" prop="difficulty">
            <el-select v-model="formData.difficulty" placeholder="请选择难度" style="width: 100%">
              <el-option
                v-for="item in difficultyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="题目内容" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="4"
          placeholder="请输入题目详细内容"
        />
      </el-form-item>

      <!-- 选择题选项 -->
      <template v-if="isChoiceType">
        <el-form-item label="选项配置">
          <div class="options-wrapper">
            <div
              v-for="(option, index) in formData.options"
              :key="index"
              class="option-item"
            >
              <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
              <el-input v-model="(formData.options as string[])[index]" placeholder="请输入选项内容" />
              <el-button
                v-if="(formData.options as string[]).length > 2"
                type="danger"
                link
                @click="removeOption(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button v-if="(formData.options as string[]).length < 6" type="primary" link @click="addOption">
              <el-icon><Plus /></el-icon>添加选项
            </el-button>
          </div>
        </el-form-item>
      </template>

      <el-form-item label="参考答案" prop="answer">
        <el-input
          v-model="formData.answer"
          type="textarea"
          :rows="3"
          placeholder="请输入参考答案"
        />
      </el-form-item>

      <el-form-item label="答案解析" prop="explanation">
        <el-input
          v-model="formData.explanation"
          type="textarea"
          :rows="3"
          placeholder="请输入答案解析（可选）"
        />
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tags"
          multiple
          filterable
          allow-create
          placeholder="请输入或选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useInterviewStore } from '@/stores/interview'
import type { QuestionFormData, InterviewQuestion, QuestionCategory, QuestionType, DifficultyLevel } from '@/types/interview'

// Props & Emits
const props = defineProps<{
  visible: boolean
  type: 'add' | 'edit'
  data: InterviewQuestion | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

// 计算属性：双向绑定 visible
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 计算属性：对话框标题
const dialogTitle = computed(() => (props.type === 'add' ? '新增题目' : '编辑题目'))

// 计算属性：是否为选择题类型
const isChoiceType = computed(() => {
  return ['single_choice', 'multiple_choice'].includes(formData.type)
})

// Store
const interviewStore = useInterviewStore()

// Refs
const formRef = ref()

// 选项数据
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

const commonTags = ['vue3', 'react', 'javascript', 'typescript', 'css', '性能优化', '原理', '手写代码']

// 表单数据
const defaultFormData: QuestionFormData = {
  title: '',
  category: 'javascript' as QuestionCategory,
  type: 'short_answer' as QuestionType,
  difficulty: 'medium' as DifficultyLevel,
  content: '',
  options: ['', '', '', ''],
  answer: '',
  explanation: '',
  tags: []
}

const formData = reactive<QuestionFormData>({ ...defaultFormData })

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入题目标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择题目分类', trigger: 'change' }],
  type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度等级', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入参考答案', trigger: 'blur' }]
}

// 方法
const addOption = () => {
  formData.options?.push('')
}

const removeOption = (index: number) => {
  formData.options?.splice(index, 1)
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 选择题验证选项
  if (isChoiceType.value) {
    const validOptions = formData.options?.filter(o => o.trim())
    if (!validOptions || validOptions.length < 2) {
      ElMessage.warning('选择题至少需要 2 个有效选项')
      return
    }
  }

  try {
    if (props.type === 'add') {
      interviewStore.addQuestion(formData)
      ElMessage.success('新增成功')
    } else if (props.data) {
      interviewStore.updateQuestion(props.data.id, formData)
      ElMessage.success('更新成功')
    }
    emit('success')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 监听数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        title: newData.title,
        category: newData.category,
        type: newData.type,
        difficulty: newData.difficulty,
        content: newData.content,
        options: newData.options?.length ? [...newData.options] : ['', '', '', ''],
        answer: newData.answer,
        explanation: newData.explanation || '',
        tags: [...newData.tags]
      })
    } else {
      Object.assign(formData, defaultFormData)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.options-wrapper {
  width: 100%;
}

.options-wrapper .option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.options-wrapper .option-item .option-label {
  font-weight: 600;
  color: #606266;
  min-width: 24px;
}

.options-wrapper .option-item .el-input {
  flex: 1;
}
</style>
