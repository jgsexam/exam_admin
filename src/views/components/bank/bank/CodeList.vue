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
        <el-form-item label="编译器">
          <el-select v-model="page.params.compileId" filterable placeholder="请选择" clearable>
            <el-option
              v-for="compile in compileList"
              :key="compile.compileId"
              :label="compile.compileName"
              :value="compile.compileId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd" v-if="this.$store.getters.auths.indexOf('question:add') >= 0">添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 题目卡片列表 -->
    <div v-loading="this.$store.getters.loading">
      <el-row v-for="(code, index) in page.list" :key="code.codeId">
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
                  <el-button size="mini" type="success" @click="toUpdate(code.codeId)" v-if="this.$store.getters.auths.indexOf('question:update') >= 0">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button size="mini" type="primary" @click="lookResolve(code)">解析</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button size="mini" type="danger" @click="deleteById(code.codeId)" v-if="this.$store.getters.auths.indexOf('question:delete') >= 0">删除</el-button>
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
      <el-form :model="code" label-width="80px" size="mini" v-loading="this.$store.getters.loading">
        <el-form-item label="题目">
          <el-input type="textarea" v-model="code.codeTitle"></el-input>
        </el-form-item>
        <el-form-item label="编译器">
          <el-select v-model="code.codeCompile" filterable placeholder="请选择" clearable>
            <el-option
              v-for="compile in compileList"
              :key="compile.compileId"
              :label="compile.compileName"
              :value="compile.compileId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate
            v-model="code.codeDifficulty"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-form-item>
        <el-form-item
          :inline="true"
          v-for="answer in code.answerList"
          :label="'小题' + answer.answerNumber"
          :key="answer.answerNumber"
        >
          <div class="input-div">
            <el-input
              v-model="answer.answerProblem"
              placeholder="请输入问题"
              type="textarea"
              style="max-width: 80%;"
              clearable
            ></el-input>
            <el-input v-model="answer.answerScore" clearable placeholder="请输入分值"></el-input>
            <el-input
              v-model="answer.answerContent"
              placeholder="请输入答案"
              type="textarea"
              style="max-width: 80%;"
              clearable
            ></el-input>
          </div>
          <div class="delete-div">
            <el-button @click.prevent="removeAnswer(answer)" type="danger">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" v-model="code.codeResolve"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="addAnswer">添加小题</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹窗结束 -->
  </div>
</template>

<script>

import codeApi from '@/api/code'
import compileApi from '@/api/compile'

export default {
  data() {
    return {
      dialogTitle: "添加题目", // 添加修改弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      answerKey: 1,
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
          compileId: '', // 编译器Id
        },
        list: []
      },
      compileList: [], // 编译器列表
      code: { // 题目对象
        codeId: '', // id
        codeTitle: '', // 题干
        codeImg: '', // 题目图片
        codeType: this.$route.query.typeId, // 题型
        codeScore: 0, // 分值
        codeCompile: null, // 编译器
        codeDifficulty: 1, // 难度系数
        codeBank: this.$route.query.bankId, // 题库id
        codeKnow: this.$route.query.knowId, // 知识点id
        codeResolve: '', // 解析
        answerList: [ // 问题/答案列表
          {
            answerId: '', // id
            answerNumber: 1, // 小题编号
            answerProblem: '', // 问题
            answerContent: '', // 答案
            answerScore: 0, // 分值
          }
        ]
      }
    }
  },
  methods: {
    toAdd() {
      // 打开添加弹窗
      this.code.codeId = ''
      this.dialogTitle = '添加题目'
      this.dialogFormVisible = true
    },
    save() {
      if (this.code.codeId == '') {
        // 保存
        this.$store.commit("SET_LOADING", true)
        codeApi.save(this.code).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        // 更新
        this.$store.commit("SET_LOADING", true)
        codeApi.update(this.code).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }
    },
    removeAnswer(item) {
      // 删除选项
      var index = this.code.answerList.indexOf(item)
      if (index !== -1) {
        if (index == this.answerKey) {
          // 删掉的是最后一个
          this.answerKey = this.answerKey - 1
          this.code.answerList.splice(index, 1)
        } else {
          // 删掉的不是最后一个，key设置为1，遍历重新给number赋值
          let key = 1
          this.code.answerList.splice(index, 1)
          this.code.answerList.forEach(item => {
            item.answerNumber = key++
          })
          key--
          this.answerKey = key
        }
      }
    },
    addAnswer() {
      // 添加选项
      this.answerKey = this.answerKey + 1
      let key = this.answerKey
      this.code.answerList.push({
        "answerId": key,
        "answerContent": '',
        "answerNumber": key,
        "answerScore": 0
      });
    },
    list() {
      // 分页查询
      this.$store.commit("SET_LOADING", true)
      codeApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    lookResolve(code) {
      // 查看解析
      let answerList = code.answerList
      let content = '';
      answerList.forEach(e => {
        content += '<div style="margin-bottom: 10px;">'
          + '<p>（' + e.answerNumber + '）' + e.answerProblem + '</p>'
          + '<p>答案：' + e.answerContent + '</p>'
          + '</div>'
      })
      content += '<p>题目解析：' + code.codeResolve + '</p>'
      this.$alert(content, '小题与解析', {
        dangerouslyUseHTMLString: true
      });
    },
    handleSizeChange(val) {
      // 改变每页大小
      this.page.currentCount = val;
      this.list();
    },
    handleCurrentChange(val) {
      // 改变页数
      this.page.currentPage = val;
      this.list();
    },
    deleteById(codeId) {
      // 根据id删除
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        codeApi.delete(codeId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    },
    toUpdate(codeId) {
      codeApi.get(codeId).then(res => {
        if (res.code == 200) {
          this.code = res.data
          this.dialogTitle = '修改题目'
          this.dialogFormVisible = true
          this.answerKey = res.data.answerList.length
        }
      })
    },
    getCompile() {
      compileApi.all().then(res => {
        this.compileList = res.data
      })
    }
  },
  created() {
    this.list()
    this.getCompile()
  }
}
</script>

<style scoped>
.el-input {
  width: 80%;
}

.item {
  margin-bottom: 18px;
}

.compile-item {
  margin-bottom: 18px;
  color: #409eff;
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

.input-div {
  display: inline;
}

.delete-div {
  display: inline;
  position: absolute;
  top: 0;
  margin-left: 10px;
}
</style>