<template>
  <div>
    <h2>{{ qIndex + 1 }} 多选题</h2>
    <div>
      <div :key="index" v-for="(question, index) in config.questionDetailList">
        <div>{{ `(${checkIsAnswerRight(question) ? '正确' : '错误'}) ${qIndex + 1}.${index + 1} ${question.choiceTitle} (${question.choiceScore}分)` }}</div>
        <br />
        <div>
          <el-checkbox
            :key="aindex + '-'"
            v-for="(answer, aindex) in question.choiceAnswer"
          >{{answer.answerNumber}}.{{answer.answerContent}}</el-checkbox>
        </div>
        <p>正确答案: {{ question.choiceTrue }} 学生答案: {{checkIsAnswerRight(question) ? question.answerContent.answerContent : '未填写'}}</p>
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
        return question.answerContent.answerContent === question.choiceTrue;
      }
      return false;
    }
  }
};
</script>

<style>
</style>