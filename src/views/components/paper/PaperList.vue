<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="试卷标题">
          <el-input v-model="page.params.paperTitle" placeholder="试卷标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select
            v-model="page.params.paperCollege"
            filterable
            placeholder="请选择"
            clearable
            @change="getMajor"
          >
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="page.params.paperMajor" filterable placeholder="请选择" clearable>
            <el-option
              v-for="major in majorList"
              :key="major.dictId"
              :label="major.dictName"
              :value="major.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题库">
          <el-select v-model="page.params.bankId" filterable placeholder="请选择" clearable>
            <el-option
              v-for="bank in bankList"
              :key="bank.bankId"
              :label="bank.bankName"
              :value="bank.bankId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组卷">
          <el-select v-model="page.params.paperType" filterable placeholder="请选择" clearable>
            <el-option key="0" label="未组卷" value="0"></el-option>
            <el-option key="1" label="手动组卷" value="1"></el-option>
            <el-option key="2" label="自动组卷" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-select v-model="page.params.paperStyle" filterable placeholder="请选择" clearable>
            <el-option key="A" label="A卷" value="A"></el-option>
            <el-option key="B" label="B卷" value="B"></el-option>
            <el-option key="C" label="C卷" value="C"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-select clearable v-model="page.params.paperDifficulty" filterable placeholder="请选择">
            <el-option v-for="diff in 5" :key="diff" :label="diff" :value="diff"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年度">
          <el-date-picker
            type="year"
            placeholder="起始年度"
            v-model="page.params.paperStartYear"
            value-format="yyyy"
          ></el-date-picker>-
          <el-date-picker
            type="year"
            placeholder="结束年度"
            v-model="page.params.paperEndYear"
            value-format="yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="page.params.paperSeme" filterable placeholder="请选择" clearable>
            <el-option key="1" label="第一学期" value="1"></el-option>
            <el-option key="2" label="第二学期" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="block">
            <el-date-picker
              v-model="timeInterval"
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
      </el-form>
      <!-- 搜索部分结束 -->

      <hr>
      <el-button type="primary" size="mini" @click="toAdd" v-if="this.$store.getters.auths.indexOf('paper:add') >= 0">添加</el-button>
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
      <el-table-column sortable="custom" label="试卷标题">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.paperComment" placement="top">
            <span>{{ scope.row.paperTitle }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="学年度">
        <template slot-scope="scope">
          <span>{{ scope.row.paperStartYear + '-' + scope.row.paperEndYear }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学期">
        <template slot-scope="scope">
          <span v-if="scope.row.paperSeme == 1">第一学期</span>
          <span v-if="scope.row.paperSeme == 2">第二学期</span>
        </template>
      </el-table-column>
      <el-table-column prop="college.dictName" sortable="custom" label="学院" width="160px"></el-table-column>
      <el-table-column prop="major.dictName" sortable="custom" label="专业"></el-table-column>
      <el-table-column prop="bank.bankName" sortable="custom" label="题库" width="120px"></el-table-column>
      <el-table-column prop="paperQuestionNum" sortable="custom" label="题量"></el-table-column>
      <el-table-column sortable="custom" label="试卷类型">
        <template slot-scope="scope">
          <span>{{ scope.row.paperStyle + '卷' }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable="custom" label="组卷" width="85px">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.paperType == 0">未组卷</el-tag>
          <el-tag type="warning" v-if="scope.row.paperType == 1">手动组卷</el-tag>
          <el-tag type="success" v-if="scope.row.paperType == 2">智能组卷</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable="custom" label="提交组卷">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.paperSubmit == 0">未提交</el-tag>
          <el-tag type="success" v-if="scope.row.paperSubmit == 1">已提交</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="paperDifficulty" sortable="custom" label="难度系数"></el-table-column>
      <el-table-column prop="paperScore" sortable="custom" label="总分"></el-table-column>
      <el-table-column prop="paperCreateTime" sortable="custom" label="创建时间"></el-table-column>
      <el-table-column prop="paperUpdateTime" sortable="custom" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template class="paper-do" slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(scope.row.paperId)" v-if="this.$store.getters.auths.indexOf('paper:update') >= 0">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperType == 0">
                <el-button size="mini" type="success" @click="toGa(scope.row)" v-if="this.$store.getters.auths.indexOf('paper:submit') >= 0">智能组卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperType != 2 && scope.row.paperSubmit == 0">
                <el-button size="mini" type="warning" @click="toHand(scope.row)" v-if="this.$store.getters.auths.indexOf('paper:submit') >= 0">手动组卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperType == 1 && scope.row.paperSubmit == 0">
                <el-button size="mini" type="primary" @click="toUpdateQuestion(scope.row)" v-if="this.$store.getters.auths.indexOf('paper:submit') >= 0">修改题目</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperSubmit == 1">
                <el-button size="mini" type="primary" @click="toRead(scope.row)" v-if="this.$store.getters.auths.indexOf('paper:submit') >= 0">预览试卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperType == 1 && scope.row.paperSubmit == 0">
                <el-button size="mini" type="primary" @click="submitPaper(scope.row)" v-if="this.$store.getters.auths.indexOf('paper:submit') >= 0">提交组卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.paperSubmit == 1">
                <el-button size="mini" type="primary" @click="downloadPaper(scope.row)">下载试卷</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="deleteById(scope.row.paperId)" v-if="this.$store.getters.auths.indexOf('paper:delete') >= 0">删除</el-button>
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
      <el-form ref="paper" :model="paper" label-width="80px" size="mini">
        <el-form-item label="试卷名">
          <el-input v-model="paper.paperTitle" clearable></el-input>
        </el-form-item>

        <el-form-item label="学院">
          <el-select
            v-model="paper.paperCollege"
            filterable
            placeholder="请选择"
            clearable
            @change="getMajor"
          >
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="paper.paperMajor" filterable placeholder="请选择" clearable>
            <el-option
              v-for="major in majorList"
              :key="major.dictId"
              :label="major.dictName"
              :value="major.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题库">
          <el-select v-model="paper.paperBank" filterable placeholder="请选择" clearable>
            <el-option
              v-for="bank in bankList"
              :key="bank.bankId"
              :label="bank.bankName"
              :value="bank.bankId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-select v-model="paper.paperStyle" filterable placeholder="请选择" clearable>
            <el-option key="A" label="A卷" value="A"></el-option>
            <el-option key="B" label="B卷" value="B"></el-option>
            <el-option key="C" label="C卷" value="C"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学年度">
          <el-col :span="11">
            <el-date-picker
              type="year"
              placeholder="起始年度"
              v-model="paper.paperStartYear"
              style="width: 100%"
              value-format="yyyy"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="year"
              placeholder="结束年度"
              v-model="paper.paperEndYear"
              style="width: 100%"
              value-format="yyyy"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="paper.paperSeme" filterable placeholder="请选择" clearable>
            <el-option key="1" label="第一学期" value="1"></el-option>
            <el-option key="2" label="第二学期" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="paper.paperComment" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增 编辑弹窗结束 -->

    <!-- 手动组卷弹窗 -->
    <el-dialog
      title="手动组卷"
      :visible.sync="dialogHand"
      v-loading="this.$store.getters.loading"
      width="85%"
    >
      <div class="table-header">
        <!-- 搜索部分开始 -->
        <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
          <el-form-item label="题干">
            <el-input v-model="page.params.title" placeholder="题干" clearable></el-input>
          </el-form-item>
          <el-form-item label="知识点">
            <el-select
              v-model="testPage.params.knowId"
              filterable
              placeholder="请选择"
              clearable
              @change="getType"
            >
              <el-option
                v-for="know in knowList"
                :key="know.knowId"
                :label="know.knowName"
                :value="know.knowId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型">
            <el-select v-model="testPage.params.typeId" filterable placeholder="请选择">
              <el-option
                v-for="type in typeList"
                :key="type.typeId"
                :label="type.typeName"
                :value="type.typeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度系数">
            <el-select clearable v-model="page.params.difficulty" filterable placeholder="请选择">
              <el-option v-for="diff in 5" :key="diff" :label="diff" :value="diff"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchQuestion">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="paper-question-div">
          <span v-if="questionNumConfig.length > 0">当前已选择：</span>
          <span
            v-for="config in questionNumConfig"
            :key="config.configType"
          >{{ config.type.typeName + config.configQuestionNum + '道，总分为' + config.configScore + '分；' }}</span>
        </div>
        <hr>
        <el-button type="primary" size="mini" @click="addToPaper('')">批量添加</el-button>
        <!-- 搜索部分结束 -->
      </div>
      <!-- 题目列表 -->
      <el-table
        :data="testPage.list"
        border
        stripe
        @sort-change="sortQuestion"
        style="width: 100%"
        size="mini"
        v-loading="this.$store.getters.loading"
        @selection-change="selectQuestion"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column sortable="custom" label="题干">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column prop="score" sortable="custom" label="分值" width="75px"></el-table-column>
        <el-table-column prop="difficulty" sortable="custom" label="难度系数" width="125px"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100px">
          <template class="paper-do" slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button size="mini" type="success" @click="addToPaper(scope.row.id)">加入试卷</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件开始 -->
      <div class="page-div">
        <el-pagination
          @size-change="changeTestSize"
          @current-change="changeTestCurrent"
          :current-page="testPage.currentPage"
          :page-sizes="[10,15,20,30]"
          :page-size="testPage.currentCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="testPage.totalCount"
        ></el-pagination>
      </div>
      <!-- 分页组件结束 -->
      <!-- 题目列表结束 -->
    </el-dialog>
    <!-- 手动组卷弹窗结束 -->

    <!-- 智能组卷弹窗 -->
    <el-dialog title="智能组卷" :visible.sync="dialogGa">
      <el-form :model="gaPaper" size="mini" v-loading="this.$store.getters.loading">
        <el-form-item :inline="true" v-for="(config, index) in gaPaper.configList" :key="index">
          <div class="input-div">
            <h2 style="text-align: center;">题型 {{ index+1 }}</h2>
            <el-form-item label="难度系数" label-width="80px">
              <el-rate
                v-model="config.difficulty"
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </el-form-item>
            <el-form-item label="分值" label-width="80px">
              <el-input v-model="config.totalScore" clearable placeholder="请输入分值"></el-input>
            </el-form-item>
            <el-form-item label="题量" label-width="80px">
              <el-input v-model="config.questionNum" clearable placeholder="请输入题目数"></el-input>
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
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题型" label-width="80px">
              <el-select v-model="config.typeId" filterable placeholder="请选择">
                <el-option
                  v-for="type in typeList"
                  :key="type.typeId"
                  :label="type.typeName"
                  :value="type.typeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="delete-div">
              <el-button @click.prevent="removeConfig(config)" type="danger">删除</el-button>
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
  </div>
</template>
<script>
import dictApi from "@/api/dict"
import paperApi from "@/api/paper"
import configApi from "@/api/paperConfig"
import bankApi from "@/api/bank"
import typeApi from "@/api/type"
import knowledgeApi from "@/api/knowledge"
import questionApi from "@/api/question"

export default {
  data () {
    return {
      timeInterval: null, // 学年度时间区间数组
      dialogFormVisible: false, // 弹出层表单隐藏
      dialogHand: false, // 手动组卷弹窗
      dialogGa: false, // 智能组卷弹窗
      dialogTitle: "创建试卷", // 弹出层标题
      page: { // 试卷分页对象
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          paperTitle: "", // 试卷标题
          paperCollege: "", // 学院id
          paperMajor: "", // 专业id
          bankId: "", // 题库id
          paperFlag: null, // 启用状态
          paperStyle: "", // ABC卷
          paperType: null, // 组卷类型
          paperDifficulty: null, // 难度系数
          paperCreateTime: "", // 创建时间段
          paperStartTear: "" // 学年度时间段
        },
        list: []
      },
      testPage: { // 组卷分页对象
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          paperTitle: "", // 试卷标题
          paperCollege: "", // 学院id
          paperMajor: "", // 专业id
          bankId: "", // 题库id
          paperFlag: null, // 启用状态
          paperStyle: "", // ABC卷
          paperType: null, // 组卷类型
          paperDifficulty: null, // 难度系数
          paperCreateTime: "", // 创建时间段
          paperStartTear: "" // 学年度时间段
        },
        list: []
      },
      collegeList: [], // 学院列表
      majorList: [], // 专业列表
      bankList: [], // 题库列表
      paper: {
        // 试卷对象
        paperId: "" // 试卷id
      },
      knowList: [], // 知识点列表
      typeList: [], // 题型列表
      config: { // 组卷对象
        configPaper: '', // 所属试卷
        configQuestionNum: 0, // 题目量
        configScore: 0, // 总分
        configType: '', // 题型id
        configKnow: '', // 知识点id
        questionList: [ // 配置题目列表
          {
            questionConfig: '', // 配置id
            questionId: '' // 题目id
          }
        ]
      },
      questionNumConfig: [ // 显示题目数量
      ],
      gaPaper: { // 智能组卷
        paperId: '', // 试卷id
        configList: [ // 配置列表
          {
            totalScore: 0, // 总分
            questionNum: 0, // 题目数
            difficulty: 1, // 难度
            typeId: '', // 题型
            knowledgeIds: [ // 知识点列表

            ]
          }
        ]
      },
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
    changeTestSize (val) {
      this.page.currentCount = val;
      this.search();
    },
    changeTestCurrent (val) {
      this.page.currentPage = val;
      this.search();
    },
    sortHandler (column) {
      // 排序查询
      this.page.sortName = column.prop;
      this.page.sortOrder = column.order;
      this.list();
    },
    sortQuestion (column) {
      // 排序查询
      console.log(column);
      this.testPage.sortName = column.prop;
      this.testPage.sortOrder = column.order;
      this.searchQuestion();
    },
    save () {
      // 保存或修改
      if (this.paper.paperId == '') {
        paperApi.save(this.paper).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      } else {
        paperApi.update(this.paper).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogFormVisible = false
            this.list()
          }
        })
      }
    },
    list () {
      // 分页查询
      if (this.timeInterval != null) {
        this.page.params.startTime = this.timeInterval[0]
        this.page.params.endTime = this.timeInterval[1]
      } else {
        this.page.params.startTime = ''
        this.page.params.endTime = ''
      }
      this.$store.commit("SET_LOADING", true)
      paperApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data
        }
      })
    },
    toUpdate (id) {
      // 打开弹窗，进行修改
      this.dialogTitle = "创建试卷"
      paperApi.get(id).then(res => {
        if (res.code == 200) {
          this.paper = res.data
          this.dialogFormVisible = true
        }
      })
    },
    toAdd () {
      this.paper.paperId = ''
      this.dialogTitle = "创建试卷"
      this.dialogFormVisible = true
    },
    deleteById (id) {
      // 根据id删除
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        paperApi.delete(id).then(res => {
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
    },
    getMajor (collegeId) {
      if (collegeId == '') {
        // 查询所有的专业，用于下拉列表
        dictApi.all({ dictType: 'major' }).then(res => {
          this.majorList = res.data
        })
      } else {
        // 查询学院对应的专业，用于下拉列表
        dictApi.getByFather(collegeId).then(res => {
          this.majorList = res.data
        })
      }
    },
    getBank () {
      // 查询所有的题库，用于下拉列表
      bankApi.all().then(res => {
        this.bankList = res.data
      })
    },
    toHand (paper) {
      this.testPage.params.bankId = paper.paperBank
      this.config.configPaper = paper.paperId
      this.getKnowledge(paper.paperBank)
      this.getQuestionNum(paper.paperId)
      // 打开手动组卷弹窗
      this.dialogHand = true
    },
    searchQuestion () {
      // 查询题目列表
      this.$store.commit("SET_LOADING", true)
      questionApi.search(this.testPage).then(res => {
        this.testPage = res.data
        // 设置试卷配置表的题型id和知识点id
        this.config.configKnow = res.data.params.knowId
        this.config.configType = res.data.params.typeId
      })
    },
    getKnowledge (bankId) {
      // 查询所有知识点
      knowledgeApi.allByBank(bankId).then(res => {
        this.knowList = res.data
        if (this.knowList.length > 0) {
          this.testPage.params.knowId = this.knowList[0].knowId
        } else {
          this.testPage.params.knowId = ''
        }
      })
    },
    getType (knowId) {
      // 查询所有题型
      if (knowId == '') {
        typeApi.all().then(res => {
          this.typeList = res.data
          if (this.typeList.length > 0) {
            this.testPage.params.typeId = this.typeList[0].typeId
          } else {
            this.testPage.params.typeId = ''
          }
        })
      } else {
        typeApi.allByKnow(knowId).then(res => {
          this.typeList = res.data
          if (this.typeList.length > 0) {
            this.testPage.params.typeId = this.typeList[0].typeId
          } else {
            this.testPage.params.typeId = ''
          }
        })
      }
    },
    addToPaper (questionId) {
      this.$confirm("确定加入到本试卷中?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(() => {
        this.$store.commit("SET_LOADING", true)
        if (questionId != '') {
          // 设置一下题目的questionId
          this.config.questionList = [{ questionId: questionId }]
        }
        configApi.addToPaper(this.config).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.getQuestionNum(this.config.configPaper)
          }
        })
      })
    },
    selectQuestion (questionList) {
      // 多选框选择状态改变
      let ids = questionList.map(x => { return { questionId: x.id } })
      this.config.questionList = ids
    },
    getQuestionNum (paperId) {
      // 查询当前试卷的题目数量
      configApi.getQuestionNum(paperId).then(res => {
        this.questionNumConfig = res.data
      })
    },
    toUpdateQuestion (paper) {
      // 跳转到修改题目也没
      this.$router.push({
        name: 'paperQuestion',
        params: {
          paperId: paper.paperId
        }
      })
    },
    submitPaper (paper) {
      // 提交组卷
      this.$confirm("提交后不可修改，确定提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(() => {
        this.$store.commit("SET_LOADING", true)
        paperApi.submitPaper(paper.paperId).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.list()
          }
        })
      })
    },
    downloadPaper (paper) {
      // 下载试卷
      location.href = paper.paperDownload
    },
    toRead (paper) {
      // 预览试卷
      open('http://view.officeapps.live.com/op/view.aspx?src=' + paper.paperDownload)
    },
    toGa (paper) {
      // 打开智能组卷弹窗
      this.gaPaper.paperId = paper.paperId
      this.getKnowledge(paper.paperBank)
      this.dialogGa = true
    },
    getGaType (ids) {
      // 获取到选中的知识点，去查询题型
      typeApi.allByKnowIds(ids).then(res => {
        this.typeList = res.data
      })
    },
    removeConfig (item) {
      // 删除选项
      var index = this.gaPaper.configList.indexOf(item)
      if (index !== -1) {
        this.gaPaper.configList.splice(index, 1)
      }
    },
    addConfig () {
      // 添加选项
      this.gaPaper.configList.push({
        "totalScore": 0,
        "questionNum": 0,
        "difficulty": 1,
        "typeId": "",
        "knowledgeIds": [
        ]
      });
    },
    gaSubmit () {
      // 提交智能组卷
      this.$confirm("智能组卷提交后不可修改，确定提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(() => {
        this.$store.commit("SET_LOADING", true)
        paperApi.submitPaperGa(this.gaPaper).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogGa = false
            this.list()
          }
        })
      })
    }
  },
  created () {
    this.list()
    this.getCollege()
    this.getBank()
    this.getMajor('')
    this.getType('')
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