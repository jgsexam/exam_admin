<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
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
      </el-form>
      <!-- 搜索部分结束 -->

      <hr>
      <el-button
        type="primary"
        size="mini"
        @click="toAdd"
        v-if="permission.indexOf('ex:room:add') >= 0"
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
      <el-table-column prop="roomName" sortable="custom" label="教室名"></el-table-column>
      <el-table-column prop="roomBuilding" sortable="custom" label="楼栋"></el-table-column>
      <el-table-column sortable="custom" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.roomState == 1">空闲</el-tag>
          <el-tag type="info" v-if="scope.row.roomState == 2">占用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roomComment" sortable="custom" label="备注"></el-table-column>
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
                  @click="toUpdate(scope.row.roomId)"
                  v-if="permission.indexOf('ex:room:update') >= 0"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteById(scope.row.roomId)"
                  v-if="permission.indexOf('ex:room:delete') >= 0"
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
      <el-form :model="room" label-width="80px" size="mini">
        <el-form-item label="教室名">
          <el-input v-model="room.roomName" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼栋数">
          <el-input v-model="room.roomBuilding" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="room.roomComment" clearable></el-input>
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
import roomApi from '@/api/room'
export default {
  data () {
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
      room: {
        roomId: '', // id
        roomName: '', // 教室名
        roomBuilding: '', // 几栋
        roomState: 1, // 1空闲2占用
        roomComment: '' // 备注 
      },
    }
  },
  methods: {
    handleSizeChange (val) {
      this.page.currentCount = val
      this.list()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.list()
    },
    sortHandler (column) { // 排序查询
      this.page.sortName = column.prop
      this.page.sortOrder = column.order
      this.list()
    },
    save () { // 保存或修改
      if (this.room.roomId == '') {
        roomApi.save(this.room).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        roomApi.update(this.room).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }
    },
    list () { // 分页查询
      this.room.roomId = ''
      this.$store.commit("SET_LOADING", true)
      roomApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    toUpdate (id) { // 打开弹窗，进行修改
      // 根据id查询
      roomApi.get(id).then(res => {
        if (res.code == 200) {
          this.room = res.data
          this.dialogTitle = '修改教室'
          this.dialogFormVisible = true
        }
      })
    },
    toAdd () {
      this.dialogTitle = '新增教室'
      this.dialogFormVisible = true
    },
    deleteById (id) {
      this.$confirm('确定删除这条记录?', '提示', {
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
      })
    },
  },
  created () {
    this.list()
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
</style>