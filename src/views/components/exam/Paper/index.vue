<template>
  <div v-if="paperData">
    <h1>{{ paperData.bank.bankName }} - {{ paperData.paperTitle }}</h1>
    <div class="paper-content">
      <template v-for="(config, index) in paperData.configList">
        <SingleQuestions :qIndex="index" :config="config" v-if="config.type.typeName === '单项选择题'" :key="index" />
        <MultiQuestions :qIndex="index" :config="config" v-if="config.type.typeName === '单项选择题'" :key="index" />
        <TFQuestion :qIndex="index" :config="config" v-if="config.type.typeName === '判断题'" :key="index" />
        <SubjectiveQuestion :paperData="paperData" :qIndex="index" :config="config" v-if="config.type.typeName === '编程题'" :key="index" />

      </template>
    </div>
    <div class="commit-div">
      <el-button @click="handleCommitBtn" type="success">提交</el-button>
    </div>
  </div>
  

</template>

<script>

import examApi from '@/api/exam'

import MultiQuestions from './MultiQuestions'
import SingleQuestions from './SingleQuestions'
import SubjectiveQuestion from './SubjectiveQuestion'
import TFQuestion from './TFQuestion'

export default {
  components: {
    MultiQuestions,
    SingleQuestions,
    SubjectiveQuestion,
    TFQuestion
  },
  data() {
    return {
      paperData: null
    }
  },
  methods: {
    handleCommitBtn() {
      examApi.commitPaper(this.paperData.paperId)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('提交成功');
            this.$router.back();
          } else {
            this.$message.error('提交失败');
          }

        })

    }
  },
  created() {
    const paperId = this.$route.params.id
    examApi.getPaperDetail(paperId).then(res => {
      if (res.code === 200) {
        this.paperData = res.data
        console.log('123')
      }
    })
  }
}
</script>

<style>
.commit-div {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>