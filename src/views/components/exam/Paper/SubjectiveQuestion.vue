<template>
  <div>
    <h2>{{ qIndex + 1 }} 主观题</h2>
    <div>
      <div :key="index" v-for="(question, index) in config.questionDetailList">
        <div class="sub-header">
          <div class="sub-header-title" >{{ `${qIndex + 1}.${index + 1} ${question.codeTitle} (${question.codeScore}分)` }}</div>
          <el-input :value="scores[index]" @input="handleInputChange($event, question, index)"  :min="0" :max="question.codeScore" type="number" placeholder="评分"></el-input>
        </div>
        <br />
        <div>
          <el-radio
            :key="aindex + '-'"
            v-for="(answer, aindex) in question.choiceAnswer"
            :label="answer.answerContent"
          >{{answer.answerNumber}}.{{answer.answerContent}}</el-radio>
        </div>
        <p>学生答案:</p>
        <el-input v-if="question.answerContent" type="textarea" :rows="4"  v-model="question.answerContent.question.answerContent"></el-input>
        <el-input v-else type="textarea" :rows="2" placeholder="学生没有填写答案" value=""></el-input>
      </div>
    </div>
  </div>
</template>

<script>

import { Message } from 'element-ui';

import examApi from '@/api/exam'

export default {
  props: {
    config: Object,
    qIndex: Number,
    paperData: Object
  },
  data() {

    return {
      scores: [],
    }
  },
  methods: {
    checkIsAnswerRight(question) {
      if (question.answerContent) {
        return question.answerContent.answerContent === question.choiceTrue;
      }
      return false;
    },
    handleInputChange(value, question, index) {
      const score = Number(value);
      if (score > question.codeScore || score < 0) {
        this.$message(`本题目分数区间在${0}-${question.codeScore}`);
        console.log('this.$message', this.$message);
        return;
      }
      this.$set(this.scores, index, score);
      examApi.commitQuestionScore({
          paperId: this.paperData.paperId,
          configId: this.config.configId,
          stuId: this.paperData.paperStudent,
          questionId: question.codeId,
          grade: score,
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('已经自动提交到服务器');
        } else {
          this.$message.warn('自动保存失败');
        }
      });
      this.$message()
    }
  }
};
</script>

<style>
  .sub-header {
    display: flex;
    flex-flow: row nowrap;
  }
  .sub-header .sub-header-title {
    flex: 1;
  }

  .sub-header .el-input {
    flex: 0 0 80px;
    margin-right: 10px;
  }


</style>