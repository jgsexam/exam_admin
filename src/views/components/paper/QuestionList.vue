<template>
  <div v-loading="this.$store.getters.loading">
    <div class="paper-title" v-if="paper.paperStartYear!=undefined">
      {{
      paper.paperStartYear + '至' + paper.paperEndYear + '学年度' +
      '第' + paper.paperSeme + '学期'+paper.bank.bankName+'期末考试试卷 ' +
      '满分' + paper.paperScore + '分，难度系数为：' + paper.paperDifficulty
      }}
    </div>
    <el-card
      class="father-card"
      v-for="(config, configIndex) in paper.configList"
      :key="config.configId"
    >
      <div
        class="question-title-div"
      >{{ numberList[configIndex] + '.' + config.type.typeName + '（共'+ config.configQuestionNum +'题，总分' + config.configScore + '分）' }}</div>

      <!-- 选择题列表 -->
      <div class="choice-div" v-if="config.configType == '1' || config.configType == '2'">
        <el-row v-for="(question, index) in config.questionDetailList" :key="question.choiceId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <div
                style="float: left; padding-top: 10px; line-height: 10px"
                v-html="(index + 1) + '. ' + question.choiceTitle + '. (' + question.choiceScore + '分)'"
              ></div>
              <div style="float: right; margin-top: 8px">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteByPaperAndQuestionId(config.configPaper, question.choiceId)"
                >删除</el-button>
              </div>
            </div>
            <div
              v-for="answer in question.choiceAnswer"
              :key="answer.answerId"
              class="item"
              v-html="answer.answerNumber + '. ' + answer.answerContent"
            ></div>
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
      <!-- 选择题列表结束 -->

      <!-- 判断题列表 -->
      <div class="tf-div" v-if="config.configType == '3'">
        <el-row v-for="(question, index) in config.questionDetailList" :key="question.tfId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <div
                style="float: left; padding-top: 10px; line-height: 10px"
                v-html="(index + 1) + '. ' + question.tfTitle + '. (' + question.tfScore + '分)'"
              ></div>
              <div style="float: right; margin-top: 8px">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteByPaperAndQuestionId(config.configPaper, question.tfId)"
                >删除</el-button>
              </div>
            </div>
            <div class="bottom clearfix">
              <div style="color: red">答案：{{ question.tfTrue == 1 ? '正确' : '错误' }}</div>
              <div style="margin-top: 8px;">
                <el-rate
                  v-model="question.tfDifficulty"
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
      <!-- 判断题列表结束 -->

      <!-- 填空题列表 -->
      <div class="comp-div" v-if="config.configType == '4'">
        <el-row v-for="(question, index) in config.questionDetailList" :key="question.tfId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <div
                class="question-content"
                v-html="(index + 1) + '. ' + question.compTitle + '. (' + question.compScore + '分)' "
              ></div>
              <div style="float: right; margin-top: 8px">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteByPaperAndQuestionId(config.configPaper, question.compId)"
                >删除</el-button>
              </div>
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
      <!-- 填空题列表结束 -->

      <!-- 编程题列表 -->
      <div class="code-div" v-if="config.configType == '5'">
        <el-row v-for="(code, index) in config.questionDetailList" :key="code.codeId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <div
                style="float: left; padding-top: 10px; line-height: 10px"
                v-html="(index + 1) + '. ' + code.codeTitle + '. (' + code.codeScore + '分)'"
              ></div>
              <div style="float: right; margin-top: 8px">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteByPaperAndQuestionId(config.configPaper, question.codeId)"
                >删除</el-button>
              </div>
            </div>
            <div
              v-for="answer in code.answerList"
              :key="answer.answerId"
              class="item"
              v-html="answer.answerNumber + '. ' + answer.answerProblem"
            ></div>
            <div class="compile-item">编译器：{{ code.compileDO.compileName }}</div>
            <div class="bottom clearfix">
              <div style="margin-top: 8px;">
                <el-rate
                  v-model="code.codeDifficulty"
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
      <!-- 编程题列表结束 -->

      <!-- 主观题列表 -->
      <div class="other-div" v-if="config.configType.length > 2">
        <el-row v-for="(question, index) in config.questionDetailList" :key="question.questionId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <div
                style="float: left; padding-top: 10px; line-height: 10px"
                v-html="(index + 1) + '. ' + question.questionTitle + '. (' + question.questionScore + '分)'"
              ></div>
              <div style="float: right; margin-top: 8px">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteByPaperAndQuestionId(config.configPaper, question.questionId)"
                >删除</el-button>
              </div>
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
      <!-- 主观题列表结束 -->
    </el-card>
    <div style="position:fixed;bottom:50px;right:50px">
      <el-button type="primary">提交组卷</el-button>
    </div>
  </div>
</template>

<script>
import paperApi from '@/api/paper'
import paperConfigQuestionApi from '@/api/paperConfigQuestion'
export default {
  data () {
    return {
      permission: this.$store.getters.auths,
      paperId: this.$route.params.paperId, // 试卷id
      paper: { // 试卷数据
        bank: {
          bankName: '', // 题库名
        },
      },
      numberList: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'], // 汉字数组
    }
  },
  methods: {
    list () {
      // 查询试卷中所有题目（不分页）
      this.$store.commit('SET_LOADING', true)
      paperApi.questionList(this.paperId).then(res => {
        if (res.code == 200) {
          this.paper = res.data
        }
      })
    },
    deleteByPaperAndQuestionId (paperId, questionId) {
      this.$confirm("确定将此题从试卷中移除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.$store.commit("SET_LOADING", true)
        paperConfigQuestionApi.deleteByPaperAndQuestionId(paperId, questionId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    }
  },
  created () {
    this.list()
  }
}
</script>

<style scoped>
.card-box {
  margin-top: 15px;
}
.father-card {
  margin-bottom: 15px;
}
.question-title-div {
  font-size: 16px;
  color: #409eff;
}
.paper-title {
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
}

.num-div,
.content-div,
.point-div {
  display: inline-block;
  line-height: 16px;
  vertical-align: top;
}
</style>