<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <!-- <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="教室名">
          <el-input v-model="page.params.roomName" placeholder="教室名" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-input v-model="page.params.roomBuilding" placeholder="楼栋" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="page.params.roomState" filterable placeholder="请选择" clearable>
            <el-option key="1" label="空闲" value="1"></el-option>
            <el-option key="2" label="占用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="list">查询</el-button>
        </el-form-item>
      </el-form>-->
      <!-- 搜索部分结束 -->

      <hr />
      <el-button
        type="primary"
        size="mini"
        @click="toAdd"
        v-if="permission.indexOf('ex:exam:add') >= 0"
      >添加</el-button>
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="page.list"
      border
      stripe
      style="width: 100%"
      @sort-change="sortHandler"
      size="mini"
      v-loading="this.$store.getters.loading"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template class="paper-do" slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="success"
                  @click="toUpdate(scope.row.examId)"
                  v-if="permission.indexOf('ex:exam:update') >= 0"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteById(scope.row.examId)"
                  v-if="permission.indexOf('ex:exam:delete') >= 0"
                >删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->

    <!-- 分页组件开始 -->
    <div class="page-div">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10,15,20,30]"
        :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      ></el-pagination>
    </div>
    <!-- 分页组件结束 -->

    <!-- 新增 编辑弹窗开始 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      v-loading="this.$store.getters.loading"
    >
      <el-form :model="exam" label-width="80px" size="mini">
        <el-form-item label="考场">
          <el-select v-model="exam.examRoom" filterable placeholder="请选择" clearable>
            <el-option
              v-for="room in roomList"
              :key="room.roomId"
              :label="room.roomName"
              :value="room.roomId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期">
          <el-date-picker
            type="datetime"
            placeholder="考试日期"
            v-model="exam.examDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间">
          <el-input v-model="exam.examTime" clearable>
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="试卷">
          <el-select v-model="exam.examPaper" filterable placeholder="请选择考试所用试卷" clearable>
            <el-option
              v-for="paper in paperList"
              :key="paper.paperId"
              :label="paper.paperTitle"
              :value="paper.paperId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="exam.examType" filterable placeholder="请选择" clearable>
            <el-option key="0" label="平常测试" value="0"></el-option>
            <el-option key="1" label="普通考试" value="1"></el-option>
            <el-option key="2" label="补考" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="exam.examComment" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增 编辑弹窗结束 -->
  </div>
</template>
<script>
import examApi from '@/api/exam'
import roomApi from '@/api/room'
import paperApi from '@/api/paper'
export default {
  data() {
    return {
      permission: this.$store.getters.auths,
      dialogFormVisible: false, // 弹出层隐藏
      dialogTitle: '新增教室',
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: '',
        sortOrder: 'asc',
        params: {
        },
        list: []
      },
      roomList: [], // 考场列表
      paperList: [], // 试卷列表
      exam: {
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.currentCount = val
      this.list()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.list()
    },
    sortHandler(column) { // 排序查询
      this.page.sortName = column.prop
      this.page.sortOrder = column.order
      this.list()
    },
    save() { // 保存或修改
      if (this.exam.examId == '') {
        examApi.save(this.exam).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        examApi.update(this.exam).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }
    },
    list() { // 分页查询
      this.exam.examId = ''
      this.$store.commit("SET_LOADING", true)
      examApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    getRoomList() {
      // 查询空闲教室
      roomApi.free().then(res => {
        this.roomList = res.data
      })
    },
    getPaperList() {
      // 获取所有的试卷
      paperApi.all().then(res => {
        this.paperList = res.data
      })
    },
    toUpdate(id) { // 打开弹窗，进行修改
      // 根据id查询
      this.getRoomList()
      examApi.get(id).then(res => {
        if (res.code == 200) {
          this.exam = res.data
          this.dialogTitle = '修改考试'
          this.dialogFormVisible = true
        }
      })
    },
    toAdd() {
      this.getRoomList()
      this.dialogTitle = '创建考试'
      this.dialogFormVisible = true
    },
    deleteById(id) {
      /* this.$confirm('确定删除这条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        roomApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message.error('删除失败')
          }
          this.list()
        })
      }) */
    },
  },
  created() {
    this.list()
    this.getPaperList()
  }
}
</script>

<style scoped>
.table-header {
  margin-bottom: 10px;
}

.page-div {
  margin-top: 10px;
}

.line {
  text-align: center;
}

.el-select {
  display: block !important;
}

.top {
  text-align: center;
}

.paper-question-div {
  color: #67c23a;
}

.read-dialog {
  height: 85%;
}

.dialog-content {
  height: 100%;
}

.input-div {
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 5px #ccc;
}

.delete-div {
  text-align: right;
  position: relative;
}
</style>