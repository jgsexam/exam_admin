<template>
  <div>
    <!-- 添加选择题组件 -->
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
      <el-row v-for="(question, index) in page.list" :key="question.questionId">
        <el-card class="card-box">
          <div slot="header" class="clearfix">
            <div style="float: left; padding-top: 10px; line-height: 10px">
              <div class="num-div">{{ (index + 1) + '. ' }}</div>
              <div class="content-div" v-html="question.questionTitle"></div>
              <div class="point-div">{{ '. (' + question.questionScore + '分)' }}</div>
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
                    @click="toUpdate(question.questionId)"
                    v-if="permission.indexOf('question:update') >= 0"
                  >编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button size="mini" type="primary" @click="lookResolve(question)">解析</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteById(question.questionId)"
                    v-if="permission.indexOf('question:delete') >= 0"
                  >删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div
            v-for="answer in question.answerList"
            :key="answer.answerId"
            class="item"
            v-html="answer.answerNumber + '. ' + answer.answerProblem"
          ></div>
          <div class="bottom clearfix">
            <!-- <div style="color: red">{{ '正确答案: ' + question.choiceTrue }}</div> -->
            <div style="margin-top: 8px;">
              <el-rate
                v-model="question.questionDifficulty"
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
        :model="question"
        label-width="80px"
        size="mini"
        v-loading="this.$store.getters.loading"
      >
        <el-form-item label="题目">
          <el-input v-model="question.questionTitle">
            <el-button slot="append" @click="initTinymce(question, 1)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate
            v-model="question.questionDifficulty"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-form-item>
        <el-form-item
          :inline="true"
          v-for="answer in question.answerList"
          :label="'小题' + answer.answerNumber"
          :key="answer.answerNumber"
        >
          <div class="input-div">
            <el-input
              v-model="answer.answerProblem"
              placeholder="请输入问题"
              style="max-width: 80%;"
              clearable
            >
              <el-button slot="append" @click="initTinymce(answer, 2)">高级输入</el-button>
            </el-input>
            <el-input v-model="answer.answerScore" clearable placeholder="请输入分值"></el-input>
            <el-input
              v-model="answer.answerContent"
              placeholder="请输入答案"
              style="max-width: 80%;"
              clearable
            >
              <el-button slot="append" @click="initTinymce(answer, 3)">高级输入</el-button>
            </el-input>
          </div>
          <div class="delete-div">
            <el-button @click.prevent="removeAnswer(answer)" type="danger">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="question.questionResolve">
            <el-button slot="append" @click="initTinymce(question, 4)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="addAnswer">添加小题</el-button>
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

import questionApi from '@/api/question'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data () {
    return {
      tinymce: {
        type: 1, // 类型 1题目2小题中的问题3小题中的答案4解析
        dialogTinymceVisible: false,
        tempValue: '',
        tempObj: {}, // ；临时对象
      },
      permission: this.$store.getters.auths,
      dialogTitle: "添加题目", // 添加修改弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      answerKey: 1,
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          typeId: this.$route.query.typeId,
          bankId: this.$route.query.bankId,
          knowId: this.$route.query.knowId,
        },
        list: []
      },
      question: { // 题目对象
        questionId: '', // id
        questionTitle: '', // 题干
        questionImg: '', // 题目图片
        questionType: this.$route.query.typeId, // 题型
        questionScore: 0, // 分值
        questionDifficulty: 1, // 难度系数
        questionBank: this.$route.query.bankId, // 题库id
        questionStyle: 6, // 题目类型，6表示其他题
        questionKnow: this.$route.query.knowId, // 知识点id
        questionResolve: '', // 解析
        answerList: [ // 问题/答案列表
          {
            answerId: '', // id
            answerNumber: 1, // 小题编号
            answerProblem: '', // 问题
            answerContent: '', // 答案
            answerScore: 0, // 分值
          }
        ]
      }
    }
  },
  methods: {
    toAdd () {
      // 打开添加弹窗
      this.question.questionId = ''
      this.dialogTitle = '添加题目'
      this.dialogFormVisible = true
    },
    save () {
      if (this.question.questionId == '') {
        // 保存题目
        this.$store.commit("SET_LOADING", true)
        questionApi.save(this.question).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        // 修改题目
        this.$store.commit("SET_LOADING", true)
        questionApi.update(this.question).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }
    },
    removeAnswer (item) {
      // 删除选项
      var index = this.question.answerList.indexOf(item)
      if (index !== -1) {
        if (index == this.answerKey) {
          // 删掉的是最后一个
          this.answerKey = this.answerKey - 1
          this.question.answerList.splice(index, 1)
        } else {
          // 删掉的不是最后一个，key设置为1，遍历重新给number赋值
          let key = 1
          this.question.answerList.splice(index, 1)
          this.question.answerList.forEach(item => {
            item.answerNumber = key++
          })
          key--
          this.answerKey = key
        }
      }
    },
    addAnswer () {
      // 添加选项
      this.answerKey = this.answerKey + 1
      let key = this.answerKey
      this.question.answerList.push({
        "answerId": key,
        "answerContent": '',
        "answerProblem": '',
        "answerNumber": key,
        "answerScore": 0
      });
    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true)
      questionApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    lookResolve (question) {
      // 查看解析
      let answerList = question.answerList
      let content = '';
      answerList.forEach(e => {
        content += '<div style="margin-bottom: 10px;">'
          + '<p>（' + e.answerNumber + '）' + e.answerProblem + '</p>'
          + '<p>答案：' + e.answerContent + '</p>'
          + '</div>'
      })
      content += '<p>题目解析：' + question.questionResolve + '</p>'
      this.$alert(content, '小题与解析', {
        dangerouslyUseHTMLString: true
      });
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
    deleteById (questionId) {
      // 根据id删除
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        questionApi.delete(questionId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list();
          }
        });
      });
    },
    toUpdate (questionId) {
      questionApi.get(questionId).then(res => {
        this.question = res.data
        this.dialogTitle = '修改题目'
        this.dialogFormVisible = true
        this.answerKey = res.data.answerList.length
      })
    },
    initTinymce (obj, type) {
      // 富文本输入
      this.tinymce.type = type
      // 初始化富文本的内容
      let content = ''
      if (type === 1) {
        // 题目
        content = obj.questionTitle
      } else if (type === 2) {
        // 小题题目
        content = obj.answerProblem
      } else if (type === 3) {
        // 小题答案
        content = obj.answerContent
      } else if (type === 4) {
        // 解析
        content = obj.questionResolve
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
        this.question.questionTitle = content
      } else if (type === 2) {
        // 是题目标题
        const tempAnswer = this.tinymce.tempObj
        const number = tempAnswer.answerNumber
        // 遍历
        let answer = this.question.answerList.filter(item => item.answerNumber == number)
        answer[0].answerProblem = content
      } else if (type === 3) {
        // 是题目答案
        const tempAnswer = this.tinymce.tempObj
        const number = tempAnswer.answerNumber
        // 遍历
        let answer = this.question.answerList.filter(item => item.answerNumber == number)
        answer[0].answerContent = content
      } else if (type === 4) {
        this.question.questionResolve = content
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

.input-div {
  display: inline;
}

.delete-div {
  display: inline;
  position: absolute;
  top: 0;
  margin-left: 10px;
}

.num-div,
.content-div,
.point-div {
  display: inline-block;
  line-height: 16px;
  vertical-align: top;
}
</style>