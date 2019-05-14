<template>
  <div>
    <el-form :model="teacher" label-width="80px" size="mini">
      <div class="input-div">
        <el-form-item label="工号">
          <el-input :disabled="true" v-model="teacher.teacherNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="teacher.teacherName" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="teacherCard">
          <el-input v-model="teacher.teacherCard" clearable></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="teacher.teacherAge" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="teacher.teacherMobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="teacher.teacherEmail" clearable></el-input>
        </el-form-item>
      </div>
      <div class="img-div">
        <el-form-item label="照片">
          <el-upload
            class="avatar-uploader"
            action="http://tn20898453.51mypc.cn/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="file"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </div>

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
      imageUrl: "", // 图片
    }
  },
  methods: {
    getInfo () {
      // 获取教师信息
      teacherApi.info().then(res => {
        this.teacher = res.data
        this.imageUrl = this.teacher.teacherImg
      })
    },
    save () {
      // 修改;
      this.$store.commit("SET_LOADING", true)
      teacherApi.update(this.teacher).then(res => {
        this.$message.success(res.msg + '请重新登录');
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    },
    handleAvatarSuccess (res, file) {
      // this.teacher.teacherImg = URL.createObjectURL(file.raw);
      this.imageUrl = res.data.fileUrl;
      this.teacher.teacherImg = this.imageUrl;
      this.$message.success(res.msg);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只支持 JPG、JPEG、PNG 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return;
      }
      this.imgLoading = true;
      return isJPG && isLt2M;
    },
  },
  created () {
    this.getInfo()
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.img {
  width: 150px;
  height: 150px;
  background-color: aquamarine;
  margin: 15px;
}
.input-div {
  width: 70%;
}
.img-div {
  position: fixed;
  right: 100px;
  top: 100px;
}
</style>
