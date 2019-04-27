<template>
  <div v-loading="this.$store.getters.loading">
    <div class="paper-title">
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
              <pre style="float: left; padding-top: 10px; line-height: 10px">{{ (index + 1) + '. ' + question.choiceTitle + '. (' + question.choiceScore + '分)' }}</pre>
              <el-dropdown style="float: right; margin-top: 8px">
                <el-button type="primary" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="success" @click="toUpdate(question.choiceId)">编辑</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="danger" @click="deleteById(question.choiceId)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              v-for="answer in question.choiceAnswer"
              :key="answer.answerId"
              class="item"
            >{{ answer.answerNumber + '. ' + answer.answerContent }}</div>
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
              <pre style="float: left; padding-top: 10px; line-height: 10px">{{ (index + 1) + '. ' + question.tfTitle + '. (' + question.tfScore + '分)' }}</pre>
              <el-dropdown style="float: right; margin-top: 8px">
                <el-button type="primary" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="success" @click="toUpdate(question.tfId)">编辑</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="danger" @click="deleteById(question.tfId)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
              <pre
                class="question-content"
                v-html="(index + 1) + '. ' + question.compTitle + '. (' + question.compScore + '分)' "
              ></pre>
              <el-dropdown style="float: right; margin-top: 8px">
                <el-button type="primary" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="success" @click="toUpdate(question.compId)">编辑</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="danger" @click="deleteById(question.compId)">删除</el-button>
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
      <!-- 填空题列表结束 -->

      <!-- 编程题列表 -->
      <div class="code-div" v-if="config.configType == '5'">
        <el-row v-for="(code, index) in config.questionDetailList" :key="code.codeId">
          <el-card class="card-box">
            <div slot="header" class="clearfix">
              <pre style="float: left; padding-top: 10px; line-height: 10px">{{ (index + 1) + '. ' + code.codeTitle + '. (' + code.codeScore + '分)' }}</pre>
              <el-dropdown style="float: right; margin-top: 8px">
                <el-button type="primary" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="success" @click="toUpdate(code.codeId)">编辑</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="primary" @click="lookResolve(code)">解析</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="danger" @click="deleteById(code.codeId)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              v-for="answer in code.answerList"
              :key="answer.answerId"
              class="item"
            >{{ answer.answerNumber + '. ' + answer.answerProblem }}</div>
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
              <pre style="float: left; padding-top: 10px; line-height: 10px">{{ (index + 1) + '. ' + question.questionTitle + '. (' + question.questionScore + '分)' }}</pre>
              <el-dropdown style="float: right; margin-top: 8px">
                <el-button type="primary" size="mini">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button size="mini" type="success" @click="toUpdate(question.questionId)">编辑</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="primary" @click="lookResolve(question)">解析</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button size="mini" type="danger" @click="deleteById(question.questionId)">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              v-for="answer in question.answerList"
              :key="answer.answerId"
              class="item"
            >{{ answer.answerNumber + '. ' + answer.answerProblem }}</div>
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
  </div>
</template>

<script>
import paperApi from '@/api/paper'
export default {
  data() {
    return {
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
    list() {
      // 查询试卷中所有题目（不分页）
      this.$store.commit('SET_LOADING', true)
      paperApi.questionList(this.paperId).then(res => {
        if (res.code == 200) {
          this.paper = res.data
        }
      })
    }
  },
  created() {
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
</style>