<template>
  <div>
    <el-card class="header-card">
      <div>
        <el-badge is-dot class="item" type="success"></el-badge>
        当前登录：{{ name }}
      </div>
      <div v-show="showInfo">
        <div style="color: red">由于火狐浏览器和Chrome浏览器不支持多图上传</div>
        <div style="color: red">题目中如有图片、公式等，请不要一并复制，请单张上传</div>
        <div style="color: red">
          如想使用多图上传，请将IE浏览器
          <a
            style="color: #409eff;"
            href="http://downza.91speed.com.cn/2019/01/09/IE11Windows6.1.zip?ssig=1ed933d71b1cd8be2733a6604dac458592321d85&time_stamp=1558426485&fn=4dc63c16153fee452a7e625325e6f506"
          >升级至IE11版本</a>，
          改用IE浏览器或360浏览器兼容模式
        </div>
      </div>
    </el-card>
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
      showInfo: false, // 是否提示浏览器版本升级
    }
  },
  created () {
    this.getBankInfo()
    this.checkBrowser()
  },
  methods: {
    getBankInfo () {
      // 获取题库相关信息
      consoleApi.bankInfo().then(res => {
        this.bankPaper.rows = res.data
        this.bankQuestion.rows = res.data
      })
    },
    checkBrowser () {
      // 检查浏览器版本
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
      if (isIE) {
        this.showInfo = true
      }
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

.header-card {
  margin-bottom: 15px;
}
</style>
