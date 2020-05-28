<template>
  <div>
    <h2>{{ qIndex + 1 }} 判断题</h2>
    <div>
      <div :key="index" v-for="(question, index) in config.questionDetailList">
        <div>{{ `(${checkIsAnswerRight(question) ? '正确' : '错误'}) ${qIndex + 1}.${index + 1} ${question.tfTitle} (${question.tfScore}分)` }}</div>
        <br />
        <div>
          <el-radio
            :key="aindex + '-'"
            v-for="(answer, aindex) in question.choiceAnswer"
          >{{answer.answerNumber}}.{{answer.answerContent}}</el-radio>
          <el-radio :label="1">对</el-radio>
          <el-radio :label="0">错</el-radio>
        </div>
        <p>正确答案: {{question.tfTrue ? '对' : '错'}} 学生答案: {{checkIsAnswerRight(question) ? question.answerContent.answerContent : '未填写'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
    qIndex: Number
  },
  methods: {
    checkIsAnswerRight(question) {
      if (question.answerContent) {
        return question.answerContent.answerContent === question.tfTrue;
      }
      return false;
    }
  }
};
</script>

<style>
</style>