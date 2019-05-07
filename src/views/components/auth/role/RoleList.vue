<template>
  <div>
    <div class="table-header" v-if="this.$store.getters.auths.indexOf('ar:role:add') >= 0">
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <el-tree
      :data="roleTree"
      :props="defaultProps"
      show-checkbox
      node-key="roleId"
      default-expand-all
      :render-content="renderContent"
      v-loading="this.$store.getters.loading"
      :expand-on-click-node="false"
    ></el-tree>

    <!-- 添加修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      v-loading="this.$store.getters.loading"
    >
      <el-form :model="role" label-width="80px" size="mini">
        <el-form-item label="角色名">
          <el-input v-model="role.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="role.roleIndex" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级角色">
          <el-select v-model="role.roleFather" filterable placeholder="请选择" clearable>
            <el-option
              v-for="role in roleList"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="role.roleComment" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加修改弹窗结束 -->

    <!-- 授权弹窗 -->
    <el-dialog title="权限分配" :visible.sync="dialogAuth" v-loading="this.$store.getters.loading">
      <el-tree
        :data="authTree"
        :props="authProps"
        show-checkbox
        node-key="authId"
        v-loading="this.$store.getters.loading"
        :expand-on-click-node="false"
        default-expand-all
        :default-checked-keys="checkIds"
        :default-expanded-keys="checkIds"
        @check-change="handleCheckChange"
      ></el-tree>
      <el-button size="mini" type="primary" @click="updateAuth">提交</el-button>
      <el-button size="mini" @click="dialogAuth=false">取消</el-button>
    </el-dialog>
    <!-- 授权弹窗结束 -->
  </div>
</template>

<script>
let id = 1000;
import RoleApi from "@/api/role"
import authApi from "@/api/auth"
import roleAuthApi from "@/api/roleAuth"

export default {
  data () {
    return {
      roleTree: [], // 角色树形列表
      defaultProps: {
        children: 'list',
        label: 'roleName'
      },
      authProps: {
        children: 'list',
        label: 'authName'
      },
      dialogTitle: "添加角色",
      dialogFormVisible: false,
      dialogAuth: false, // 权限分配弹窗
      role: {
        "roleName": "",
        "roleFather": "",
        "roleIndex": null,
        "roleComment": ""
      },
      authTree: [], // 权限树
      roleList: [], // 用于下拉框的角色列表
      checkIds: [], // 权限树默认选中
      checkRole: "", // 当前点击的角色id
      roleAuths: [] // 角色-权限数组，用于添加
    }
  },

  methods: {
    delete (id) {
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        RoleApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.treeList();
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 16px; padding-right: 8px;">
          <span>
            <el-tooltip class="item" effect="dark" content={data.roleComment} placement="top">
              <span style="font-size: 14px;">
                {node.label}
              </span>
            </el-tooltip>
          </span>
          <span>
            <el-button style="font-size: 12px; color: #409eff;" type="text" on-click={() => this.toAuth(data.roleId)}>分配权限</el-button>
            <el-button style="font-size: 12px; color: green;" type="text" on-click={() => this.toUpdate(data.roleId)}>修改</el-button>
            <el-button style="font-size: 12px; color: red;" type="text" on-click={() => this.delete(data.roleId)}>删除</el-button>
          </span>
        </span>);
    },
    treeList () {
      this.$store.commit("SET_LOADING", true)
      RoleApi.treeList().then(res => {
        if (res.code == 200) {
          this.roleTree = res.data
        }
      })
    },
    all () {
      RoleApi.all().then(res => {
        if (res.code == 200) {
          this.roleList = res.data
        }
      })
    },
    toAdd () {
      this.dialogTitle = '添加角色'
      this.role.roleId = ''
      this.dialogFormVisible = true
    },
    save () {
      if (this.role.roleId != '') {
        // 修改
        RoleApi.update(this.role).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.treeList()
          }
        })
      } else {
        // 添加
        RoleApi.save(this.role).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.treeList()
          }
        })
      }
    },
    toUpdate (id) {
      RoleApi.get(id).then(res => {
        this.role = res.data
        this.dialogTitle = '修改角色'
        this.dialogFormVisible = true
      })
    },
    toAuth (id) {
      // 查询权限，打开权限弹窗
      this.checkRole = id;
      this.roleAuths = []
      roleAuthApi.authList(id).then(res => {
        if (res.code == 200) {
          this.checkIds = res.data;
          // 遍历数组进行拷贝
          this.checkIds.forEach((value, key) => {
            this.roleAuths.push({
              raRole: this.checkRole,
              raAuth: value
            });
          });
          this.dialogAuth = true;
        }
      });
    },
    updateAuth () {
      // 更新权限
      this.$store.commit("SET_LOADING", true)
      roleAuthApi.update(this.roleAuths).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.dialogAuth = false
        }
      })
    },
    handleCheckChange (data, checked, indeterminate) {
      // 先找数组中是否已经有了被勾选的元素
      let index = this.roleAuths.findIndex(e => e.raAuth == data.authId);
      // 如果这个元素被勾选了，数组中也没有，那就添加
      if (checked && index === -1) {
        this.roleAuths.push({
          raRole: this.checkRole,
          raAuth: data.authId
        });
      }
      // 如果这个元素没被勾选，但是数组中有，就删除
      if (!checked && index !== -1) {
        this.roleAuths.splice(index, 1);
      }
    },
    authTreeList () {
      // 树形加载
      authApi.treeList().then(res => {
        if (res.code == 200) {
          this.authTree = res.data;
        }
      });
    },
  },
  created () {
    this.treeList()
    this.all()
    this.authTreeList()
  }
}
</script>

<style scoped>
.table-header {
  margin-bottom: 10px;
}

.box {
  width: 400px;
}

.top {
  text-align: center;
}

.item {
  margin: 4px;
}
</style>