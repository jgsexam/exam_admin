<template>
  <div>
    <el-table
      v-loading="this.$store.getters.loading"
      :data="logList"
      border
      stripe
      style="width: 100%"
      size="mini"
      @sort-change="sortHandler"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="logCreateBy" label="创作人" />
      <el-table-column prop="logRoom" label="考场名" />
      <el-table-column prop="logDate" label="日志时间" />
      <el-table-column prop="logPaperTitle" label="试卷标题" />
      <el-table-column prop="logStudentNum" label="考试人数" />
      <el-table-column prop="logPass" label="通过率" />
    </el-table>
  </div>
</template>

<script>
import examApi from '@/api/exam'

export default {
  data() {
    return {
      logs: null,
      logList: []
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    getLogs() {
      examApi.getLogs().then(res => {
        if (res.code === 200) {
          this.logs = res.data
          this.logList = res.data.list
        }
      });
    }
  }
};
</script>

<style>
</style>