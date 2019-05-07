<template>
  <div>
    <el-tree
      :data="authTree"
      :props="defaultProps"
      node-key="authId"
      :render-content="renderContent"
      v-loading="this.$store.getters.loading"
    ></el-tree>
  </div>
</template>

<script>
let id = 1000;
import authApi from "@/api/auth"

export default {
  data () {
    return {
      authTree: [], // 权限树形列表
      defaultProps: {
        children: 'list',
        label: 'authName'
      },
    }
  },

  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
          <div>
            <span style="font-size: 16px;">
              {node.label}
            </span>
          </div>
        </div>);
    },
    treeList () {
      this.$store.commit("SET_LOADING", true)
      authApi.treeList().then(res => {
        if (res.code == 200) {
          this.authTree = res.data
        }
      })
    },
  },
  created () {
    this.treeList()
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