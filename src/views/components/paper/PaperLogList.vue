<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="试卷标题">
          <el-input v-model="page.params.paperTitle" placeholder="试卷标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="组卷人">
          <el-input v-model="page.params.teacherName" placeholder="组卷人" clearable></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select
            v-model="page.params.collegeId"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 搜索部分结束 -->
      <hr>
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
      <el-table-column prop="plTitle" sortable="custom" label="试卷标题"></el-table-column>
      <el-table-column prop="college.dictName" sortable="custom" label="学院"></el-table-column>
      <el-table-column prop="teacher.teacherName" sortable="custom" label="组卷人"></el-table-column>
      <el-table-column prop="plDifficulty" sortable="custom" label="难度系数"></el-table-column>
      <el-table-column prop="plScore" sortable="custom" label="分值"></el-table-column>
      <el-table-column prop="plTime" sortable="custom" label="组卷时间"></el-table-column>
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
                  type="danger"
                  @click="deleteById(scope.row.plId)"
                  v-if="permission.indexOf('paper:log:delete') >= 0"
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
  </div>
</template>
<script>
import dictApi from "@/api/dict"
import paperLogApi from "@/api/paperLog"

export default {
  data () {
    return {
      permission: this.$store.getters.auths,
      page: { // 试卷分页对象
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
        },
        list: []
      },
      collegeList: [], // 学院列表
    }
  },
  methods: {
    handleSizeChange (val) {
      this.page.currentCount = val;
      this.list();
    },
    handleCurrentChange (val) {
      this.page.currentPage = val;
      this.list();
    },
    sortHandler (column) {
      // 排序查询
      this.page.sortName = column.prop;
      this.page.sortOrder = column.order;
      this.list();
    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true)
      paperLogApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    deleteById (id) {
      // 根据id删除
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        paperLogApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    },
    search () {
      this.list();
    },
    getCollege () {
      // 查询所有的学院，用于下拉列表
      dictApi.all({ dictType: 'college' }).then(res => {
        this.collegeList = res.data
      })
    }
  },
  created () {
    this.list()
    this.getCollege()
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
</style>