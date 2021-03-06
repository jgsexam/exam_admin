<template>
  <div>
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="搜索题型">
          <el-input v-model="page.params.typeName" placeholder="题型名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-button
        type="primary"
        size="mini"
        @click="toAdd"
        v-if="permission.indexOf('type:add') >= 0"
      >添加</el-button>
    </div>
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
      <el-table-column prop="typeName" sortable="custom" label="题型名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
                  @click="toUpdate(scope.row.typeId)"
                  v-if="permission.indexOf('type:update') >= 0"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="danger"
                  @click="toDelete(scope.row.typeId)"
                  v-if="permission.indexOf('type:delete') >= 0"
                >删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="type" label-width="80px" size="mini">
        <el-form-item label="题型名 :">
          <el-input v-model="type.typeName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import typeApi from "@/api/type";

export default {
  data () {
    return {
      permission: this.$store.getters.auths,
      dialogFormVisible: false, // 弹出层隐藏
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          typeName: ""
        },
        list: []
      },
      type: {
        typeId: "",
        typeName: ""
      },
      dialogTitle: "新增题型",
      currentPage4: 4,
      loading: true // 是否显示加载框
    };
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
    save () {
      typeApi.save(this.type).then(res => {
        if (res.code === 200) {
          // 操作
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.list();
        } else {
          this.dialogFormVisible = false;
          this.$message.error("保存失败!");
        }
      });
    },
    list () {
      // 分页查询
      this.$store.commit("SET_LOADING", true);
      typeApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data;
        }
      });
    },
    toUpdate (id) {
      // 打开弹窗，进行修改
      // 根据id查询
      typeApi.get(id).then(res => {
        if (res.code == 200) {
          this.type = res.data;
          this.dialogTitle = "修改题型";
          this.dialogFormVisible = true;
        }
      });
    },
    toAdd () {
      this.type = {
        typeId: "",
        typeName: ""
      };
      this.dialogTitle = "新增题型";
      this.dialogFormVisible = true;
    },
    toDelete (id) {
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        typeApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
          this.list();
        });
      });
    },
    search () {
      this.list();
    }
  },
  created () {
    this.list();
  }
};
</script>

<style scoped>
.table-header {
  margin-bottom: 10px;
}

.page-div {
  margin-top: 10px;
}
</style>