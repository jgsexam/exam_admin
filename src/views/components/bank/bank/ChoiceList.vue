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
      <el-row v-for="(question, index) in page.list" :key="question.choiceId">
        <el-card class="card-box">
          <div slot="header" class="clearfix">
            <div style="float: left; padding-top: 10px; line-height: 10px">
              <div class="num-div">{{ (index + 1) + '. ' }}</div>
              <div class="content-div" v-html="question.choiceTitle"></div>
              <div class="point-div">{{ '. (' + question.choiceScore + '分)' }}</div>
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
                    @click="toUpdate(question.choiceId)"
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
                    @click="deleteById(question.choiceId)"
                    v-if="permission.indexOf('question:delete') >= 0"
                  >删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-for="answer in question.choiceAnswer" :key="answer.answerId" class="item">
            <div class="num-div">{{ answer.answerNumber + '. ' }}</div>
            <div class="content-div" v-html="answer.answerContent"></div>
          </div>
          <div class="bottom clearfix">
            <div style="color: red">{{ '正确答案: ' + question.choiceTrue }}</div>
            <div style="margin-top: 8px;">
              <el-rate
                v-model="question.choiceDifficulty"
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
        :model="choice"
        label-width="80px"
        size="mini"
        v-loading="this.$store.getters.loading"
      >
        <el-form-item label="题目">
          <el-input v-model="choice.choiceTitle">
            <el-button slot="append" @click="initTinymce(choice, 1)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="choice.choiceScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate
            v-model="choice.choiceDifficulty"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-form-item>
        <el-form-item
          v-for="answer in choice.choiceAnswer"
          :label="'选项' + answer.answerNumber"
          :key="answer.answerNumber"
        >
          <el-input v-model="answer.answerContent" clearable class="radio-input">
            <el-button slot="append" @click="initTinymce(answer, 2)">高级输入</el-button>
          </el-input>
          <el-button @click.prevent="removeAnswer(answer)">删除</el-button>
          <el-tooltip :content="answer.answerTrue==1?'正确':'错误'" placement="top">
            <el-switch v-model="answer.answerTrue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="choice.choiceResolve">
            <el-button slot="append" @click="initTinymce(choice, 3)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="addAnswer">添加选项</el-button>
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

import choiceApi from '@/api/choice'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data () {
    return {
      tinymce: {
        type: 1, // 类型 1题目2选项3解析
        dialogTinymceVisible: false,
        tempValue: '',
        tempObj: {}, // ；临时对象
      },
      permission: this.$store.getters.auths,
      dialogTitle: "添加题目", // 添加修改弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      choice: { // 选择题对象
        choiceTitle: '', // 题干
        choiceType: this.$route.query.typeId, // 题型
        choiceBank: this.$route.query.bankId, // 所属题库
        choiceKnow: this.$route.query.knowId, // 所属知识点
        choiceScore: 0, // 分值
        choiceDifficulty: 1, // 难度系数
        choiceResolve: "", // 解析
        choiceAnswer: [ // 选项
          {
            answerId: 0,
            answerContent: "", // 选项内容
            answerTrue: null, // 是否正确
            answerNumber: 'A'
          }
        ],
      },
      answerKey: 0,
      choiceNumber: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
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
      }
    }
  },
  methods: {
    toAdd () {
      // 打开添加弹窗
      // 清空题目
      this.choice.choiceId = ''
      this.dialogTitle = '添加题目'
      this.dialogFormVisible = true
    },
    save () {
      // 保存题目
      this.$store.commit("SET_LOADING", true);
      choiceApi.save(this.choice).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
        }
        this.dialogFormVisible = false
        this.list()
      })
    },
    removeAnswer (item) {
      // 删除选项
      var index = this.choice.choiceAnswer.indexOf(item)
      if (index !== -1) {
        if (index == this.answerKey) {
          // 删掉的是最后一个
          this.answerKey = this.answerKey - 1
          this.choice.choiceAnswer.splice(index, 1)
        } else {
          // 删掉的不是最后一个，key设置为1，遍历重新给number赋值
          let key = 0
          this.choice.choiceAnswer.splice(index, 1)
          this.choice.choiceAnswer.forEach(item => {
            item.answerNumber = this.choiceNumber[key++]
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
      this.choice.choiceAnswer.push({
        "answerId": key,
        "answerContent": '',
        "answerTrue": 0,
        "answerNumber": this.choiceNumber[key]
      });
    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true);
      choiceApi.list(this.page).then(res => {
        this.page = res.data
      })
    },
    lookResolve (question) {
      // 查看解析
      this.$alert(question.choiceResolve, '答案解析', { dangerouslyUseHTMLString: true });
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
    deleteById (choiceId) {
      // 根据id删除
      this.$confirm('确定从题库中删除本题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        choiceApi.delete(choiceId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    },
    toUpdate (choiceId) {
      choiceApi.get(choiceId).then(res => {
        this.choice = res.data
        this.dialogTitle = '修改题目'
        this.dialogFormVisible = true
        this.answerKey = res.data.choiceAnswer.length - 1
      })
    },
    initTinymce (obj, type) {
      // 富文本输入
      this.tinymce.type = type
      // 初始化富文本的内容
      let content = ''
      if (type === 1) {
        // 题目
        content = obj.choiceTitle
      } else if (type === 2) {
        // 选项
        content = obj.answerContent
      } else if (type === 3) {
        // 解析
        content = obj.choiceResolve
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
        this.choice.choiceTitle = content
      } else if (type === 2) {
        // 是选项
        const tempAnswer = this.tinymce.tempObj
        const number = tempAnswer.answerNumber
        // 获取选择题的answer
        // 遍历
        let answer = this.choice.choiceAnswer.filter(item => item.answerNumber == number)
        answer[0].answerContent = content
      } else if (type === 3) {
        this.choice.choiceResolve = content
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
.radio-input {
  width: 60%;
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

.num-div,
.content-div,
.point-div {
  display: inline-block;
  line-height: 16px;
  vertical-align:top;
}
</style>