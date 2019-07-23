<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="考场">
          <el-input v-model="page.params.examRoom" placeholder="考场" clearable />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="page.params.examDate" placeholder="创建人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="page.params.examState" filterable placeholder="请选择" clearable>
            <el-option key="0" label="未开始" value="0" />
            <el-option key="1" label="已开始" value="1" />
            <el-option key="2" label="已结束" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="page.params.examType" filterable placeholder="考试类型" clearable>
            <el-option key="0" label="测试" value="0" />
            <el-option key="1" label="考试" value="1" />
            <el-option key="2" label="补考" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期">
          <div class="block">
            <el-date-picker
              v-model="timeInterval"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 搜索部分结束 -->

      <hr />
      <el-button
        v-if="permission.indexOf('ex:exam:add') >= 0"
        type="primary"
        size="mini"
        @click="toAdd"
      >添加</el-button>
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="page.list"
      border
      stripe
      style="width: 100%"
      v-loading="this.$store.getters.loading"
      size="mini"
      @sort-change="sortHandler"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="examDate" sortable="custom" label="考试日期" />
      <el-table-column prop="room.roomName" sortable="custom" label="考场" />
      <el-table-column prop="examTime" sortable="custom" label="考试时间/分钟" />
      <el-table-column prop="paper.paperTitle" sortable="custom" label="所用试卷" />
      <el-table-column prop="teacher.teacherName" sortable="custom" label="创建人" />
      <el-table-column prop="examCreateTime" sortable="custom" label="创建时间" />
      <el-table-column sortable="custom" label="考试类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.examType == 0" type="info">平常测试</el-tag>
          <el-tag v-if="scope.row.examType == 1" type="success">考试</el-tag>
          <el-tag v-if="scope.row.examType == 2" type="error">补考</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable="custom" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.examState == 0" type="info">未开始</el-tag>
          <el-tag v-if="scope.row.examState == 1" type="success">已开始</el-tag>
          <el-tag v-if="scope.row.examState == 2" type="error">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template slot-scope="scope" class="paper-do">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:update') >= 0"
                  size="mini"
                  type="success"
                  @click="toUpdate(scope.row.examId)"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:insp:add') >= 0 && scope.row.examState == 0"
                  size="mini"
                  type="primary"
                  @click="toAddTeacher(scope.row.examId)"
                >添加监考老师</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:insp:list') >= 0"
                  size="mini"
                  type="success"
                  @click="getTeacherList(scope.row.examId)"
                >查看监考老师</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:update') >= 0"
                  size="mini"
                  type="primary"
                  @click="toAddStudent(scope.row.examId)"
                >添加学生</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:update') >= 0"
                  size="mini"
                  type="success"
                  @click="toUpdate(scope.row.examId)"
                >查看学生</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:update') >= 0"
                  size="mini"
                  type="primary"
                  @click="toUpdate(scope.row.examId)"
                >考试详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:delete') >= 0"
                  size="mini"
                  type="danger"
                  @click="deleteById(scope.row.examId)"
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
        :current-page="page.currentPage"
        :page-sizes="[10,15,20,30]"
        @size-change="handleSizeChange"
        :page-size="page.currentCount"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      />
    </div>
    <!-- 分页组件结束 -->

    <!-- 新增 编辑弹窗开始 -->
    <el-dialog
      v-loading="this.$store.getters.loading"
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="exam" label-width="80px" size="mini">
        <el-form-item label="考场">
          <el-select v-model="exam.examRoom" filterable placeholder="请选择" clearable>
            <el-option
              v-for="room in roomList"
              :key="room.roomId"
              :label="room.roomName"
              :value="room.roomId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期">
          <el-date-picker
            v-model="exam.examDate"
            type="datetime"
            placeholder="考试日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
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
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="exam.examType" filterable placeholder="请选择" clearable>
            <el-option key="0" label="平常测试" value="0" />
            <el-option key="1" label="普通考试" value="1" />
            <el-option key="2" label="补考" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="exam.examComment" type="textarea" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增 编辑弹窗结束 -->

    <!-- 添加监考教师开始 -->
    <el-dialog
      v-loading="this.$store.getters.loading"
      :visible.sync="dialogAddTeacher"
      title="添加监考教师"
    >
      <el-form :model="examTeacher" label-width="80px" size="mini">
        <el-form-item label="监考教师">
          <el-select v-model="examTeacher.ttTeacher" filterable placeholder="请选择" clearable>
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.teacherId"
              :label="teacher.teacherName"
              :value="teacher.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTeacher">提交</el-button>
          <el-button @click="dialogAddTeacher=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加监考教师结束 -->

    <!-- 监考教师列表开始 -->
    <el-dialog :visible.sync="dialogTeacherList" title="监考教师">
      <!-- 列表开始 -->
      <el-table
        :data="examTeacherList"
        border
        v-loading="this.$store.getters.loading"
        stripe
        style="width: 100%"
        size="mini"
      >
        <el-table-column prop="teacher.teacherNumber" label="工号" />
        <el-table-column prop="teacher.teacherName" label="姓名" />
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.teacher.teacherSex==1?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher.teacherAge" label="年龄" />
        <el-table-column prop="teacher.teacherEntryTime" label="入职时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope" class="teacher-do">
            <el-button
              v-if="permission.indexOf('ex:insp:delete') >= 0"
              size="mini"
              type="danger"
              @click="deleteTeacherById(scope.row.ttId, scope.row.ttExam)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表结束 -->
    </el-dialog>
    <!-- 监考教师列表结束 -->

    <!-- 添加学生开始 -->
    <el-dialog
      v-loading="this.$store.getters.loading"
      :visible.sync="dialogAddStudent"
      title="添加学生"
      width="85%"
    >
      <div class="table-header">
        <!-- 搜索部分开始 -->
        <!-- <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
          <el-form-item label="姓名">
            <el-input v-model="page.params.stuName" placeholder="学生名" clearable></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="page.params.stuNumber" placeholder="学号" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select clearable v-model="page.params.stuSex" filterable placeholder="请选择">
              <el-option key="1" label="男" value="1"></el-option>
              <el-option key="2" label="女" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业">
            <el-select clearable v-model="page.params.majorId" filterable placeholder="请选择">
              <el-option
                v-for="major in majorList"
                :key="major.dictId"
                :label="major.dictName"
                :value="major.dictId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="学院">
            <el-select clearable v-model="page.params.collegeId" filterable placeholder="请选择">
              <el-option
                v-for="college in collegeList"
                :key="college.dictId"
                :label="college.dictName"
                :value="college.dictId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入学时间区间">
            <div class="block">
              <el-date-picker
                v-model="admissionTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>-->
        <!-- 搜索部分结束 -->

        <hr />
        <!-- <el-button
          type="primary"
          size="mini"
          @click="toAdd"
          v-if="permission.indexOf('user:student:add') >= 0"
        >添加</el-button> -->
      </div>

      <!-- 列表开始 -->
      <el-table
        :data="studentPage.list"
        border
        stripe
        style="width: 100%"
        @sort-change="sortStudentHandler"
        size="mini"
        v-loading="this.$store.getters.loading"
        @selection-change="changeSelect"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="student.stuNumber" sortable="custom" label="学号"></el-table-column>
        <el-table-column prop="student.stuName" sortable="custom" label="姓名"></el-table-column>
        <el-table-column sortable="custom" label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.student.stuSex==1?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="student.stuAge" sortable="custom" label="年龄"></el-table-column>
        <el-table-column prop="student.major.dictName" sortable="custom" label="专业"></el-table-column>
        <el-table-column prop="student.stuEntranceTime" sortable="custom" label="入学时间"></el-table-column>
        <el-table-column prop="student.college.dictName" sortable="custom" label="学院"></el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permission.indexOf('ex:insp:delete') >= 0"
              size="mini"
              type="primary"
              @click="addToExam(scope.row.student.stuId)"
            >加入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表结束 -->

      <!-- 分页组件开始 -->
      <div class="page-div">
        <el-pagination
          @size-change="handleStudentSizeChange"
          @current-change="handleStudentCurrentChange"
          :current-page="studentPage.currentPage"
          :page-sizes="[10,15,20,30]"
          :page-size="studentPage.currentCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="studentPage.totalCount"
        ></el-pagination>
      </div>
      <!-- 分页组件结束 -->
    </el-dialog>
    <!-- 添加学生结束 -->
  </div>
</template>
<script>
import examApi from '@/api/exam'
import examTeacherApi from '@/api/examTeacher'
import examStudentApi from '@/api/examStudent'
import teacherApi from '@/api/teacher'
import roomApi from '@/api/room'
import paperApi from '@/api/paper'
export default {
  data () {
    return {
      permission: this.$store.getters.auths,
      dialogFormVisible: false, // 弹出层隐藏
      dialogAddTeacher: false, // 添加监考教师弹窗
      dialogAddStudent: false, // 添加考试学生弹窗
      dialogTeacherList: false, // 监考教师弹窗
      timeInterval: null, // 学年度时间区间数组
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
      teacherList: [], // 教师列表
      exam: {}, // 考试
      examTeacher: {}, // 监考教师
      examTeacherList: [], // 监考教师列表
      studentPage: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: '',
        sortOrder: 'asc',
        params: {
          examId: '' // 考试的id，必传
        },
        list: []
      }
    }
  },
  created () {
    this.list()
    this.getPaperList()
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
    handleStudentSizeChange (val) {
      this.studentPage.currentCount = val
      this.getStudentPage()
    },
    handleStudentCurrentChange (val) {
      this.studentPage.currentPage = val
      this.getStudentPage()
    },
    sortStudentHandler (column) { // 排序查询
      this.studentPage.sortName = column.prop
      this.studentPage.sortOrder = column.order
      this.getStudentPage()
    },
    save () { // 保存或修改
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
    list () { // 分页查询
      this.exam.examId = ''
      this.$store.commit('SET_LOADING', true)
      if (this.timeInterval != null) {
        this.page.params.startTime = this.timeInterval[0]
        this.page.params.endTime = this.timeInterval[1]
      } else {
        this.page.params.startTime = ''
        this.page.params.endTime = ''
      }
      examApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    getRoomList (id) {
      // 查询空闲教室
      roomApi.free(id).then(res => {
        this.roomList = res.data
      })
    },
    getPaperList () {
      // 获取所有的试卷
      paperApi.all().then(res => {
        this.paperList = res.data
      })
    },
    toUpdate (id) { // 打开弹窗，进行修改
      // 根据id查询
      examApi.get(id).then(res => {
        if (res.code == 200) {
          this.exam = res.data
          this.getRoomList(res.data.examRoom)
          this.dialogTitle = '修改考试'
          this.dialogFormVisible = true
        }
      })
    },
    toAdd () {
      this.getRoomList(null)
      this.dialogTitle = '创建考试'
      this.dialogFormVisible = true
    },
    deleteById (id) {
      this.$confirm('确定删除这条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        examApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error('删除失败')
          }
          this.list()
        })
      })
    },
    getFreeTeacherList () {
      // 查询空闲教师列表
      teacherApi.freeList().then(res => {
        this.teacherList = res.data
      })
    },
    getTeacherList (examId) {
      // 查看监考教师
      examTeacherApi.getList(examId).then(res => {
        this.examTeacherList = res.data
        this.dialogTeacherList = true
      })
    },
    toAddTeacher (examId) {
      // 打开添加监考教师弹窗
      this.examTeacher.ttExam = examId
      this.getFreeTeacherList()
      this.dialogAddTeacher = true
    },
    addTeacher () {
      // 添加监考教师
      this.$store.commit('SET_LOADING', true)
      examTeacherApi.save(this.examTeacher).then(res => {
        this.$message.success(res.msg)
        this.dialogAddTeacher = false
        this.getTeacherList(this.examTeacher.ttExam)
      })
    },
    deleteTeacherById (id, examId) {
      // 根据id删除
      this.$confirm('确定取消该教师的监考资格吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        examTeacherApi.delete(id).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error('删除失败')
          }
          this.getTeacherList(examId)
        })
      })
    },
    getStudentPage () {
      // 分页查询不在本场考试中的学生
      examStudentApi.list(this.studentPage).then(res => {
        this.studentPage = res.data
        this.dialogAddStudent = true
      })
    },
    toAddStudent (examId) {
      // 分页插叙不在本场考试中的学生，并且打开弹窗
      this.studentPage.params.examId = examId
      this.getStudentPage()
    }
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
