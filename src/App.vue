<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
p,pre,.item {
  font-size: 12px;
}
.el-dialog__title {
  font-size: 16px;
}

hr {
  color: #fafafa;
}

.el-submenu__title i {
  color: white !important;
}

.iconfont {
  color: white !important;
  font-size: 20px !important;
  margin-right: 5px !important;
}

* {
  /* border: 1px solid red; */
}
</style>