<template>
  <div>
    <div class="login-user">
      <el-badge is-dot class="item" type="success"></el-badge>
      当前登录：{{ name }}
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>各题库试卷数量</span>
            </div>
            <div class="text item">
              <ve-histogram :data="bankPaper" :settings="bankPaperSetting" :extend="extend"></ve-histogram>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>各题库题目数量</span>
            </div>
            <div class="text item">
              <ve-histogram :data="bankQuestion" :settings="bankQuestionSetting" :extend="extend"></ve-histogram>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import consoleApi from '@/api/console'

export default {
  name: 'Dashboard',
  data () {
    this.extend = {
      series: {
        label: { show: true, position: "top" }
      },
      // x轴字体斜显示
      xAxis: {
        axisLabel: {
          interval: 0,
        },
        triggerEvent: true
      }
    }
    return {
      bankList: [], // 题库列表
      bankPaper: { // 题库试卷数
        columns: ['bankName', 'paperNum'],
        rows: [
        ]
      },
      bankPaperSetting: {
        labelMap: {
          'bankName': '题库名',
          'paperNum': '试卷数量'
        },
      },
      bankQuestion: { // 题库题目数
        columns: ['bankName', 'questionNum'],
        rows: [
        ]
      },
      bankQuestionSetting: {
        labelMap: {
          'bankName': '题库名',
          'questionNum': '题目数量'
        },
      },
    }
  },
  created () {
    this.getBankInfo()
  },
  methods: {
    getBankInfo () {
      // 获取题库相关信息
      consoleApi.bankInfo().then(res => {
        this.bankPaper.rows = res.data
        this.bankQuestion.rows = res.data
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.login-user {
  font-size: 14px;
  height: 20px;
  display: table-cell;
  vertical-align: middle;
}

.item {
  margin-top: 10px;
}
</style>
