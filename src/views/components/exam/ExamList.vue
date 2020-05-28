/* eslint-disable semi */
/* eslint-disable semi */
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

      <el-divider/>
      <el-button
        v-if="permission.indexOf('ex:exam:add') >= 0"
        type="primary"
        size="mini"
        @click="toAdd"
      >添加</el-button>
    </div>

    <!-- 列表开始 -->
    <el-table
      v-loading="this.$store.getters.loading"
      :data="page.list"
      border
      stripe
      style="width: 100%"
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
                  v-if="permission.indexOf('ex:exam:stu:add') >= 0"
                  size="mini"
                  type="primary"
                  @click="toAddStudent(scope.row.examId)"
                >添加学生</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:stu:list') >= 0"
                  size="mini"
                  type="success"
                  @click="getStudentList(scope.row.examId)"
                >查看学生</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.examState == 2"
                  size="mini"
                  type="success"
                  @click="getStuPaperList(scope.row.examId)"
                >查看试卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:info') >= 0"
                  size="mini"
                  type="primary"
                  @click="getInfo(scope.row.examId)"
                >考试详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:paper:create') >= 0"
                  size="mini"
                  type="primary"
                  @click="createPaper(scope.row)"
                >生成试卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="permission.indexOf('ex:exam:delete') >= 0"
                  size="mini"
                  type="danger"
                  @click="deleteById(scope.row.examId)"
                >删除</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="primary"
                  @click="gennerateExamLog(scope.row.examId)"
                >生成日志</el-button>
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
        :page-size="page.currentCount"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
        v-loading="this.$store.getters.loading"
        :data="examTeacherList"
        border
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
        <el-form :inline="true" :model="studentPage" class="demo-form-inline" size="mini">
          <el-form-item label="姓名">
            <el-input v-model="studentPage.params.stuName" placeholder="学生名" clearable/>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="studentPage.params.stuNumber" placeholder="学号" clearable/>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="studentPage.params.stuSex" clearable filterable placeholder="请选择">
              <el-option key="1" label="男" value="1"/>
              <el-option key="2" label="女" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="专业">
            <el-select v-model="studentPage.params.majorId" clearable filterable placeholder="请选择">
              <el-option
                v-for="major in majorList"
                :key="major.dictId"
                :label="major.dictName"
                :value="major.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学院">
            <el-select
              v-model="studentPage.params.collegeId"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="college in collegeList"
                :key="college.dictId"
                :label="college.dictName"
                :value="college.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入学时间区间">
            <div class="block">
              <el-date-picker
                v-model="timeInterval"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getStudentPage">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索部分结束 -->

        <hr >
        <el-button
          v-if="permission.indexOf('ex:exam:stu:add') >= 0"
          type="primary"
          size="mini"
          @click="addStudentBatch"
        >添加</el-button>
      </div>

      <!-- 列表开始 -->
      <el-table
        v-loading="this.$store.getters.loading"
        :data="studentPage.list"
        border
        stripe
        style="width: 100%"
        size="mini"
        @sort-change="sortStudentHandler"
        @selection-change="changeSelect"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="student.stuNumber" sortable="custom" label="学号"/>
        <el-table-column prop="student.stuName" sortable="custom" label="姓名"/>
        <el-table-column sortable="custom" label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.student.stuSex==1?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="student.stuAge" sortable="custom" label="年龄"/>
        <el-table-column prop="student.major.dictName" sortable="custom" label="专业"/>
        <el-table-column prop="student.stuEntranceTime" sortable="custom" label="入学时间"/>
        <el-table-column prop="student.college.dictName" sortable="custom" label="学院"/>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permission.indexOf('ex:exam:stu:add') >= 0"
              size="mini"
              type="primary"
              @click="addStudent(scope.row.student.stuId)"
            >加入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表结束 -->

      <!-- 分页组件开始 -->
      <div class="page-div">
        <el-pagination
          :current-page="studentPage.currentPage"
          :page-sizes="[10,15,20,30]"
          :page-size="studentPage.currentCount"
          :total="studentPage.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleStudentSizeChange"
          @current-change="handleStudentCurrentChange"
        />
      </div>
      <!-- 分页组件结束 -->
    </el-dialog>
    <!-- 添加学生结束 -->

    <!-- 考生列表开始 -->
    <el-dialog :visible.sync="dialogStudentList" title="考生" width="85%">
      <!-- 列表开始 -->
      <el-table
        v-loading="this.$store.getters.loading"
        :data="examStudentList"
        border
        stripe
        style="width: 100%"
        size="mini"
      >
        <el-table-column prop="student.stuNumber" sortable="custom" label="学号"/>
        <el-table-column prop="student.stuName" sortable="custom" label="姓名"/>
        <el-table-column sortable="custom" label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.student.stuSex==1?'男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="student.stuAge" sortable="custom" label="年龄"/>
        <el-table-column prop="student.major.dictName" sortable="custom" label="专业"/>
        <el-table-column prop="student.stuEntranceTime" sortable="custom" label="入学时间"/>
        <el-table-column prop="student.college.dictName" sortable="custom" label="学院"/>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope" class="teacher-do">
            <el-button
              v-if="permission.indexOf('ex:exam:stu:delete') >= 0"
              size="mini"
              type="danger"
              @click="deleteStudentById(scope.row.stId, scope.row.stExam)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表结束 -->
    </el-dialog>
    <!-- 考生列表结束 -->

    <!-- 考试信息开始 -->
    <el-dialog :visible.sync="dialogExamInfo" title="详情信息">
      <p>所用试卷：{{ examInfo.paper.paperTitle }}</p>
      <el-divider/>
      <p>考试时间：{{ examInfo.examDate }}</p>
      <el-divider/>
      <p>考试时长：{{ examInfo.examTime }} 分钟</p>
      <el-divider/>
      <p>
        考试类型：
        <span v-if="examInfo.examType == 0">平常测试</span>
        <span v-if="examInfo.examType == 1">考试</span>
        <span v-if="examInfo.examType == 2">补考</span>
      </p>
      <el-divider/>
      <p>考场：{{ examInfo.room.roomName }}</p>
      <el-divider/>
      <p>监考教师：{{ examInfo.teacherList.length }} 名</p>
      <p>
        <span v-for="teacher in examInfo.teacherList" :key="teacher.ttId">
          <el-tag type="success">{{ teacher.teacher.teacherName }}</el-tag>&nbsp;
        </span>
      </p>
      <el-divider/>
      <p>考生：{{ examInfo.studentList.length }} 名</p>
      <p>
        <span v-for="student in examInfo.studentList" :key="student.stId">
          <el-tag type="success">{{ student.student.stuName }}</el-tag>&nbsp;
        </span>
      </p>
      <el-divider/>
      <p>备注：{{ examInfo.examComment }}</p>
    </el-dialog>
    <!-- 考试信息结束 -->

    <!-- 智能组卷弹窗 -->
    <el-dialog :visible.sync="dialogGa" title="智能组卷">
      <el-form v-loading="this.$store.getters.loading" :model="gaPaper" size="mini">
        <el-form-item v-for="(config, index) in gaPaper.configList" :inline="true" :key="index">
          <div class="input-div">
            <h2 style="text-align: center;">题型 {{ index+1 }}</h2>
            <el-form-item label="难度系数" label-width="80px">
              <el-rate
                v-model="config.difficulty"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
            </el-form-item>
            <el-form-item label="分值" label-width="80px">
              <el-input v-model="config.totalScore" clearable placeholder="请输入分值"/>
            </el-form-item>
            <el-form-item label="题量" label-width="80px">
              <el-input v-model="config.questionNum" clearable placeholder="请输入题目数"/>
            </el-form-item>
            <el-form-item label="知识点" label-width="80px">
              <el-select
                v-model="config.knowledgeIds"
                filterable
                placeholder="请选择"
                clearable
                multiple
                @change="getGaType"
              >
                <el-option
                  v-for="know in knowList"
                  :key="know.knowId"
                  :label="know.knowName"
                  :value="know.knowId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="题型" label-width="80px">
              <el-select v-model="config.typeId" filterable placeholder="请选择">
                <el-option
                  v-for="type in typeList"
                  :key="type.typeId"
                  :label="type.typeName"
                  :value="type.typeId"
                />
              </el-select>
            </el-form-item>
            <div class="delete-div">
              <el-button type="danger" @click.prevent="removeConfig(config)">删除</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="gaSubmit">提交</el-button>
          <el-button @click="addConfig">添题型题</el-button>
          <el-button @click="dialogGa=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 智能组卷弹窗结束 -->

    <!-- 查看试卷弹窗开始 -->
    <el-dialog
      :visible.sync="dialogPaperList"
      title="查看试卷"
      width="85%"
    >
      <el-table
        v-loading="this.$store.getters.loading"
        :data="examPaperList"
        border
        stripe
        style="width: 100%"
        size="mini"
      >
        <el-table-column prop="paperTitle" sortable="custom" label="试卷标题"/>
        <el-table-column prop="student.stuName" sortable="custom" label="考生"/>

        <el-table-column prop="exam.examCreateTime" sortable="custom" label="开考时间"/>
        <el-table-column prop="paperScore" sortable="custom" label="总分"/>
        <el-table-column prop="paperStudentScore" sortable="custom" label="考生分数"/>
        <!-- <el-table-column prop="student.college.dictName" sortable="custom" label="学院"/> -->
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope" class="teacher-do">
            <el-button size="mini" type="primary" @click="handleCheckPaperDetail(scope.row.paperId)" >查看详细<i class="el-icon-view el-icon--right" /></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看试卷弹窗结束 -->
  </div>
</template>
<script>
import examApi from '@/api/exam'
import dictApi from '@/api/dict'
import examTeacherApi from '@/api/examTeacher'
import examStudentApi from '@/api/examStudent'
import teacherApi from '@/api/teacher'
import roomApi from '@/api/room'
import paperApi from '@/api/paper'
import typeApi from '@/api/type'
import knowledgeApi from '@/api/knowledge'
export default {
  data() {
    return {
      permission: this.$store.getters.auths,
      dialogFormVisible: false, // 弹出层隐藏
      dialogAddTeacher: false, // 添加监考教师弹窗
      dialogAddStudent: false, // 添加考试学生弹窗
      dialogTeacherList: false, // 监考教师弹窗
      dialogExamInfo: false, // 考试详情弹窗
      dialogStudentList: false, // 考生弹窗
      dialogPaperList: false, // 考生考卷弹窗
      timeInterval: null, // 学年度时间区间数组
      dialogGa: false, // 智能组卷弹窗
      dialogTitle: '新增教室',
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: '',
        sortOrder: 'asc',
        params: {},
        list: []
      },
      roomList: [], // 考场列表
      paperList: [], // 试卷列表
      teacherList: [], // 教师列表
      examPaperList: [], // 考生试卷列表
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
      },
      collegeList: [], // 学院集合
      majorList: [], // 专业集合
      admissionTime: null, // 入学时间区间(数组)
      selectIds: [], // 被选中的学生id
      examStudent: {}, // 考生
      examStudentList: [], // 考生列表
      examInfo: {
        // 考试详情
        paper: {},
        room: {},
        studentList: [],
        teacherList: []
      },
      gaPaper: {
        // 智能组卷
        paperId: '', // 试卷id
        examId: '',
        stuId: [],
        configList: [
          // 配置列表
          {
            totalScore: 0, // 总分
            questionNum: 0, // 题目数
            difficulty: 1, // 难度
            typeId: '', // 题型
            knowledgeIds: [
              // 知识点列表
            ]
          }
        ]
      },
      knowList: [], // 知识点列表
      typeList: [] // 题型列表
    }
  },
  created() {
    this.list()
    this.getPaperList()
    this.getMajor()
    this.getCollege()
    this.getType('')
  },
  methods: {
    handleCheckPaper() {
      this.dialogPaperList = true
    },
    handleSizeChange(val) {
      this.page.currentCount = val
      this.list()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.list()
    },
    sortHandler(column) {
      // 排序查询
      this.page.sortName = column.prop
      this.page.sortOrder = column.order
      this.list()
    },
    handleStudentSizeChange(val) {
      this.studentPage.currentCount = val
      this.getStudentPage()
    },
    handleStudentCurrentChange(val) {
      this.studentPage.currentPage = val
      this.getStudentPage()
    },
    sortStudentHandler(column) {
      // 排序查询
      this.studentPage.sortName = column.prop
      this.studentPage.sortOrder = column.order
      this.getStudentPage()
    },
    save() {
      // 保存或修改
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
    list() {
      // 分页查询
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
    gennerateExamLog(examId) { // 生成考试日志

      examApi.gennerateLog(examId)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('生成日志成功')
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleCheckPaperDetail(paperId) {
      this.$router.push(`/exam/paper/${paperId}`)
    },
    getStuPaperList(examId) { // 获取本场考试所有学生的试卷

      examApi.stuPaperList(examId).then(res => {
        if (res.code === 200) {
          this.examPaperList = res.data.list
          this.dialogPaperList = true

          // this.getRoomList(res.data.examRoom)
          // this.dialogTitle = '修改考试'
          // this.dialogFormVisible = true
        }
      })
    },
    getRoomList(id) {
      // 查询空闲教室
      roomApi.free(id).then(res => {
        this.roomList = res.data
      })
    },
    getPaperList() {
      // 获取所有的试卷
      paperApi.all().then(res => {
        this.paperList = res.data
      })
    },
    toUpdate(id) {
      // 打开弹窗，进行修改
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
    toAdd() {
      this.getRoomList(null)
      this.dialogTitle = '创建考试'
      this.dialogFormVisible = true
    },
    deleteById(id) {
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
    getFreeTeacherList() {
      // 查询空闲教师列表
      teacherApi.freeList().then(res => {
        this.teacherList = res.data
      })
    },
    getTeacherList(examId) {
      // 查看监考教师
      examTeacherApi.getList(examId).then(res => {
        this.examTeacherList = res.data
        this.dialogTeacherList = true
      })
    },
    getStudentList(examId) {
      // 查看考生
      examStudentApi.getList(examId).then(res => {
        this.examStudentList = res.data
        this.dialogStudentList = true
      })
    },
    toAddTeacher(examId) {
      // 打开添加监考教师弹窗
      this.examTeacher.ttExam = examId
      this.getFreeTeacherList()
      this.dialogAddTeacher = true
    },
    addTeacher() {
      // 添加监考教师
      this.$store.commit('SET_LOADING', true)
      examTeacherApi.save(this.examTeacher).then(res => {
        this.$message.success(res.msg)
        this.dialogAddTeacher = false
        this.getTeacherList(this.examTeacher.ttExam)
      })
    },
    deleteTeacherById(id, examId) {
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
    deleteStudentById(id, examId) {
      // 根据id删除
      this.$confirm('确定取消该考生的考试资格吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        examStudentApi.delete(id).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error('删除失败')
          }
          this.getStudentList(examId)
        })
      })
    },
    getStudentPage() {
      // 分页查询不在本场考试中的学生
      if (this.timeInterval != null) {
        this.studentPage.params.startTime = this.timeInterval[0]
        this.studentPage.params.endTime = this.timeInterval[1]
      } else {
        this.studentPage.params.startTime = ''
        this.studentPage.params.endTime = ''
      }
      examStudentApi.list(this.studentPage).then(res => {
        this.studentPage = res.data
        this.dialogAddStudent = true
      })
    },
    toAddStudent(examId) {
      // 分页插叙不在本场考试中的学生，并且打开弹窗
      this.studentPage.params.examId = examId
      this.getStudentPage()
    },
    getCollege() {
      // 查询学院
      dictApi.all({ dictType: 'college' }).then(res => {
        this.collegeList = res.data
      })
    },
    getMajor() {
      // 查询学院
      dictApi.all({ dictType: 'major' }).then(res => {
        this.majorList = res.data
      })
    },
    addStudent(stuId) {
      // 将学生加入进考试
      // 构造数据
      this.examStudent.stStu = stuId
      this.examStudent.stExam = this.studentPage.params.examId
      examStudentApi.saveOne(this.examStudent).then(res => {
        this.$message.success(res.msg)
        this.getStudentPage(this.examStudent.stExam)
      })
    },
    addStudentBatch() {
      // 批量添加学生
      examStudentApi
        .saveList(this.selectIds, this.studentPage.params.examId)
        .then(res => {
          this.$message.success(res.msg)
          this.getStudentPage(this.examStudent.stExam)
        })
    },
    changeSelect(list) {
      // 多选框选择状态改变
      const ids = list.map(x => {
        return x.student.stuId
      })
      this.selectIds = ids
    },
    getInfo(examId) {
      // 获取考试详情
      this.$store.commit('SET_LOADING', true)
      examApi.info(examId).then(res => {
        this.examInfo = res.data
        this.dialogExamInfo = true
      })
    },
    async createPaper(exam) {
      // 根据id删除

      await this.$confirm(
        '该功能会为每一位学生生成不同的试卷，已生成试卷的学生不会重复生成，生成过程比较漫长，是否等待?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'primary'
        }
      )

      console.log('exam', exam)
      this.gaPaper.paperId = exam.paper.paperId
      this.gaPaper.examId = exam.examId
      const stuList = (await examStudentApi.getList(exam.examId)).data.map(
        s => s.student.stuId
      )
      this.gaPaper.stuId = stuList
      this.getKnowledge(exam.paper.paperBank)
      this.dialogGa = true
    },
    getGaType(ids) {
      // 获取到选中的知识点，去查询题型
      typeApi.allByKnowIds(ids).then(res => {
        this.typeList = res.data
      })
    },
    getKnowledge(bankId) {
      // 查询所有知识点
      console.log('123')
      knowledgeApi.allByBank(bankId).then(res => {
        this.knowList = res.data
      })
    },
    getType(knowId) {
      // 查询所有题型
      if (knowId == '') {
        typeApi.all().then(res => {
          this.typeList = res.data
        })
      } else {
        typeApi.allByKnow(knowId).then(res => {
          this.typeList = res.data
        })
      }
    },
    removeConfig(item) {
      // 删除选项
      var index = this.gaPaper.configList.indexOf(item)
      if (index !== -1) {
        this.gaPaper.configList.splice(index, 1)
      }
    },
    addConfig() {
      // 添加选项
      this.gaPaper.configList.push({
        totalScore: 0,
        questionNum: 0,
        difficulty: 1,
        typeId: '',
        knowledgeIds: []
      })
    },
    gaSubmit() {
      // 提交智能组卷
      console.log('gaPaper')

      this.$confirm('智能组卷提交后不可修改，确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        paperApi.submitPaperGa(this.gaPaper).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogGa = false
            this.list()
          }
        })
      })
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
