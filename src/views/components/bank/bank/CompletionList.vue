<template>
  <div>
    <!-- 添加判断题组件 -->
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="题干">
          <el-input v-model="page.params.title" placeholder="题干" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-select clearable v-model="page.params.difficulty" filterable placeholder="请选择">
            <el-option v-for="diff in 5" :key="diff" :label="diff" :value="diff"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-button
        type="primary"
        size="mini"
        @click="toAdd"
        v-if="permission.indexOf('question:add') >= 0"
      >添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 题目卡片列表 -->
    <div v-loading="this.$store.getters.loading">
      <el-row v-for="(question, index) in page.list" :key="question.tfId">
        <el-card class="card-box">
          <div slot="header" class="clearfix">
            <div class="question-content">
              <div class="num-div">{{ (index + 1) + '. ' }}</div>
              <div class="content-div" v-html="question.compTitle"></div>
              <div class="point-div">{{ '. (' + question.compScore + '分)' }}</div>
            </div>
            <el-dropdown style="float: right; margin-top: 8px">
              <el-button type="primary" size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="success"
                    @click="toUpdate(question.compId)"
                    v-if="permission.indexOf('question:update') >= 0"
                  >编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteById(question.compId)"
                    v-if="permission.indexOf('question:delete') >= 0"
                  >删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="bottom clearfix">
            <div style="margin-top: 8px;">
              <el-rate
                v-model="question.compDifficulty"
                disabled
                show-score
                allow-half
                text-color="#ff9900"
                score-template="难度系数: {value}"
              ></el-rate>
            </div>
          </div>
        </el-card>
      </el-row>
    </div>
    <!-- 题目卡片列表结束 -->

    <!-- 分页插件 -->
    <div class="page-div banklist-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[5,10,15,20]"
        :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      ></el-pagination>
    </div>
    <!-- 分页插件结束 -->

    <!-- 添加弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="completion"
        label-width="80px"
        size="mini"
        v-loading="this.$store.getters.loading"
      >
        <el-form-item label="题目">
          <el-input v-model="completion.compTitle">
            <el-button slot="append" @click="initTinymce(completion, 1)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="completion.compScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate
            v-model="completion.compDifficulty"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-form-item>
        <el-form-item
          v-for="answer in completion.answerList"
          :label="'填空' + answer.answerNumber"
          :key="answer.answerNumber"
        >
          <el-input v-model="answer.answerContent" clearable></el-input>
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="completion.compResolve">
            <el-button slot="append" @click="initTinymce(completion, 2)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹窗结束 -->

    <!-- 富文本编辑 -->
    <el-dialog :visible.sync="tinymce.dialogTinymceVisible">
      <tinymce ref="editor" :height="300" v-model="tinymce.tempValue"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tinymce.dialogTinymceVisible = false">取消</el-button>
        <el-button type="primary" @click="updateTinymceData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import completionApi from '@/api/completion'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  watch: { // 使用这个属性，可以监视data中指令数据的变化，然后触发这个watch中对应的function处理函数
    'completion.compTitle': function (newVal, oldVal) {
      // 只要值变化了，就会触发
      this.checkComp()
    }
  },
  data () {
    return {
      tinymce: {
        type: 1, // 类型 1题目2解析
        dialogTinymceVisible: false,
        tempValue: '',
        tempObj: {}, // ；临时对象
      },
      permission: this.$store.getters.auths,
      dialogTitle: "添加题目", // 添加修改弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          bankId: this.$route.query.bankId,
          knowId: this.$route.query.knowId,
        },
        list: []
      },
      completion: { // 填空题
        compId: '', // id
        compTitle: '', // 题目内容
        compScore: 0, // 分值
        compDifficulty: 1, // 难度系数
        compBank: this.$route.query.bankId, // 所属tikuid
        compKnow: this.$route.query.knowId, // 所属知识点id
        compResolve: '', // 解析
        answerList: [ // 填空列表
        ],
      },
      answerKey: 0,
      answerCount: 0, // 填空题空的数量
    }
  },
  methods: {
    toAdd () {
      // 打开添加弹窗
      this.completion.compId = ''
      this.dialogFormVisible = true
      this.dialogTitle = '添加题目'
      // 弹窗提示一下
      this.$alert('填空题三个以上下划线为一个空，输入下划线的方法是在英文状态下按住shift+_，下划线键在键盘上方0右边')
    },
    save () {
      if (this.completion.compId == '') {
        // 保存题目
        this.$store.commit("SET_LOADING", true)
        completionApi.save(this.completion).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
            this.dialogFormVisible = false
          }
        })
      } else {
        // 修改题目
        this.$store.commit("SET_LOADING", true)
        completionApi.update(this.completion).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
            this.dialogFormVisible = false
          }
        })
      }
    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true)
      completionApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    toUpdate (compId) {
      this.dialogTitle = '修改题目'
      this.dialogFormVisible = true
      completionApi.get(compId).then(res => {
        if (res.code == 200) {
          this.completion = res.data
          this.answerCount = res.data.answerList.length
          this.answerKey = res.data.answerList.length
          console.log(res.data.answerList.length);
        }
      })
      // 弹窗提示一下
      this.$alert('填空题三个以上下划线为一个空，输入下划线的方法是在英文状态下按住shift+_，下划线键在键盘上方0右边')
    },
    deleteById (compId) {
      // 根据id删除
      // 根据id删除
      this.$confirm('确定从题库中删除本题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        completionApi.delete(compId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })

    },
    lookResolve (question) {
      // 查看解析
      this.$alert(question.compResolve, '答案解析', { dangerouslyUseHTMLString: true });
    },
    handleSizeChange (val) {
      // 改变每页大小
      this.page.currentCount = val;
      this.list();
    },
    handleCurrentChange (val) {
      // 改变页数
      this.page.currentPage = val;
      this.list();
    },
    removeAnswer () {
      // 删除填空
      this.answerKey = this.answerKey - 1
      this.completion.answerList.splice(this.completion.answerList.length - 1, 1)
    },
    addAnswer () {
      // 添加填空
      this.answerKey += 1
      let key = this.answerKey
      this.completion.answerList.push({
        "answerId": key,
        "answerContent": '',
        "answerNumber": key
      })
    },
    checkComp () {
      // 检查下划线
      let count = 0
      let str = this.completion.compTitle
      // 替换第一个空
      let index = str.indexOf('___')
      if (index > -1) {
        count++
        str = str.replace('___', '')
        str = str.substring(index, str.length)
      }
      // 循环这个字符串，替换每一个空
      while (index > -1) {
        index = str.indexOf('___')
        // 第一个空不替换，因为这样的是紧接着上一个的
        if (index > 0) {
          count++
        }
        str = str.replace('___', '')
        str = str.substring(index, str.length)
      }

      // 计算当前空与已存在的空的差，如果大于0，就添加这些数量的输入框，如果小于0，就减少这些数量的输入框
      let nodeCount = count - this.answerCount
      if (nodeCount > 0) {
        // 大于0，增加这些
        for (let i = 0; i < nodeCount; i++) {
          this.addAnswer()
        }
      } else {
        for (let i = 0; i > nodeCount; i--) {
          this.removeAnswer()
        }
      }
      // 最后，重新复制空的数量
      this.answerCount = count
    },
    initTinymce (obj, type) {
      // 富文本输入
      this.tinymce.type = type
      // 初始化富文本的内容
      let content = ''
      if (type === 1) {
        // 题目
        content = obj.compTitle
      } else if (type === 2) {
        // 解析
        content = obj.compResolve
      }
      this.tinymce.tempObj = obj
      this.tinymce.dialogTinymceVisible = true
      this.$refs.editor.setContent(content)
    },
    updateTinymceData () {
      // 富文本保存
      const content = this.$refs.editor.getContent()
      // 编辑类型
      const type = this.tinymce.type
      if (type === 1) {
        // 题目标题
        this.completion.compTitle = content
      } else if (type === 2) {
        this.completion.compResolve = content
      }
      this.tinymce.dialogTinymceVisible = false
    }
  },
  created () {
    this.list()
    this.tinymce.dialogTinymceVisible = true
  },
  mounted () {
    this.tinymce.dialogTinymceVisible = false
  }
}
</script>

<style scoped>
.el-input {
  width: 80%;
}

.item {
  margin-bottom: 18px;
}

.card-box {
  margin-top: 15px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.page-div {
  margin-top: 15px;
}

.question-content {
  float: left;
  padding-top: 10px;
  line-height: 10px;
}

.num-div,
.content-div,
.point-div {
  display: inline-block;
  line-height: 16px;
  vertical-align: top;
}
</style>