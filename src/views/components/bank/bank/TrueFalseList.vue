<template>
  <div>
    <!-- 添加判断题组件 -->
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
        <el-form-item>
          <el-button type="primary" size="mini" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-button
        type="primary"
        size="mini"
        @click="toAdd"
        v-if="permission.indexOf('question:add') >= 0"
      >添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 题目卡片列表 -->
    <div v-loading="this.$store.getters.loading">
      <el-row v-for="(question, index) in page.list" :key="question.tfId">
        <el-card class="card-box">
          <div slot="header" class="clearfix">
            <div style="float: left; padding-top: 10px; line-height: 10px">
              <div class="num-div">{{ (index + 1) + '. ' }}</div>
              <div class="content-div" v-html="question.tfTitle"></div>
              <div class="point-div">{{ '. (' + question.tfScore + '分)' }}</div>
            </div>
            <el-dropdown style="float: right; margin-top: 8px">
              <el-button type="primary" size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="success"
                    @click="toUpdate(question.tfId)"
                    v-if="permission.indexOf('question:update') >= 0"
                  >编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteById(question.tfId)"
                    v-if="permission.indexOf('question:delete') >= 0"
                  >删除</el-button>
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
      <el-form
        :model="trueFalse"
        label-width="80px"
        size="mini"
        v-loading="this.$store.getters.loading"
      >
        <el-form-item label="题目">
          <el-input v-model="trueFalse.tfTitle">
            <el-button slot="append" @click="initTinymce(trueFalse, 1)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="trueFalse.tfScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否正确">
          <el-radio v-model="trueFalse.tfTrue" :label="1">正确</el-radio>
          <el-radio v-model="trueFalse.tfTrue" :label="0">错误</el-radio>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate
            v-model="trueFalse.tfDifficulty"
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="trueFalse.tfResolve">
            <el-button slot="append" @click="initTinymce(trueFalse, 2)">高级输入</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹窗结束 -->
    <!-- 富文本编辑 -->
    <el-dialog :visible.sync="tinymce.dialogTinymceVisible">
      <tinymce ref="editor" :height="300" v-model="tinymce.tempValue"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tinymce.dialogTinymceVisible = false">取消</el-button>
        <el-button type="primary" @click="updateTinymceData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import trueFalseApi from '@/api/trueFalse'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data () {
    return {
      tinymce: {
        type: 1, // 类型 1题目2解析
        dialogTinymceVisible: false,
        tempValue: '',
        tempObj: {}, // ；临时对象
      },
      permission: this.$store.getters.auths,
      dialogTitle: "添加题目", // 添加修改弹窗标题
      dialogFormVisible: false, // 控制弹窗显示隐藏
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          bankId: this.$route.query.bankId,
          knowId: this.$route.query.knowId,
        },
        list: []
      },
      trueFalse: { // 判断题
        tfBank: this.$route.query.bankId,
        tfKnow: this.$route.query.knowId,
        tfTitle: '', // 题干
        tfResolve: '', // 解析
      },
    }
  },
  methods: {
    toAdd () {
      // 打开添加弹窗
      this.trueFalse.tfId = ''
      this.dialogFormVisible = true
      this.dialogTitle = '添加题目'
    },
    save () {
      // 保存题目
      if (this.trueFalse.tfId == '') {
        // 是添加
        trueFalseApi.save(this.trueFalse).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        // 是修改
        trueFalseApi.update(this.trueFalse).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }

    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true)
      trueFalseApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    toUpdate (tfId) {
      trueFalseApi.get(tfId).then(res => {
        this.trueFalse = res.data
        this.dialogTitle = '修改题目'
        this.dialogFormVisible = true
      })
    },
    deleteById (tfId) {
      // 根据id删除
      this.$confirm('确定从题库中删除本题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        trueFalseApi.delete(tfId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    },
    lookResolve (question) {
      // 查看解析
      this.$alert(question.tfResolve, '答案解析', { dangerouslyUseHTMLString: true });
    },
    handleSizeChange (val) {
      // 改变每页大小
      this.page.currentCount = val;
      this.list();
    },
    handleCurrentChange (val) {
      // 改变页数
      this.page.currentPage = val;
      this.list();
    },
    initTinymce (obj, type) {
      // 富文本输入
      this.tinymce.type = type
      // 初始化富文本的内容
      let content = ''
      if (type === 1) {
        // 题目
        content = obj.tfTitle
      } else if (type === 2) {
        // 解析
        content = obj.tfResolve
      }
      this.tinymce.tempObj = obj
      this.tinymce.dialogTinymceVisible = true
      this.$refs.editor.setContent(content)
    },
    updateTinymceData () {
      // 富文本保存
      const content = this.$refs.editor.getContent()
      // 编辑类型
      const type = this.tinymce.type
      if (type === 1) {
        // 题目标题
        this.trueFalse.tfTitle = content
      } else if (type === 2) {
        this.trueFalse.tfResolve = content
      }
      this.tinymce.dialogTinymceVisible = false
    }
  },
  created () {
    this.list()
    this.tinymce.dialogTinymceVisible = true
  },
  mounted () {
    this.tinymce.dialogTinymceVisible = false
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

.num-div,
.content-div,
.point-div {
  display: inline-block;
  line-height: 16px;
  vertical-align: top;
}
</style>