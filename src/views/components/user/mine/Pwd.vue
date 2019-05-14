<template>
  <div>
    <el-form :model="teacher" label-width="80px" size="mini">
      <el-form-item label="旧密码" prop="pass">
        <el-input type="password" v-model="teacher.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="teacher.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="teacher.rePassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="teacher-submit-part">
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="dialogFormVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher';
export default {
  data () {
    return {
      teacher: {}, // 教师信息
    }
  },
  methods: {
    save () {
      // 修改
      this.$store.commit("SET_LOADING", true)
      teacherApi.rePwd(this.teacher).then(res => {
        this.$message.success(res.msg + '请重新登录');
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
  }
}
</script>