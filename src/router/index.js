import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    meta: { title: '控制台', icon: 'icon-kongzhitai_' },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      hidden: true
    }]
  },

  {
    path: '/bank',
    component: Layout,
    redirect: '/bank/bank',
    name: 'bank',
    meta: { title: '题库管理', icon: 'icon-tiku' },
    children: [
      {
        path: 'bank',
        name: 'bank',
        component: () => import('@/views/components/bank/bank/BankList'),
        meta: { title: '题库列表', icon: 'icon-tiku' },
        auth: 'bank:list'
      },
      {
        path: 'type',
        name: 'type',
        component: () => import('@/views/components/bank/type/TypeList'),
        meta: { title: '题型列表', icon: 'icon-wj-rz' },
        auth: 'type:list'
      },
      {
        path: 'knowledge/:bankId',
        name: 'knowledge',
        component: () => import('@/views/components/bank/bank/KnowledgeList'),
        meta: { title: '知识点', icon: 'table' },
        hidden: true,
        auth: 'know:list'
      },
      {
        path: 'choice',
        name: 'choice',
        component: () => import('@/views/components/bank/bank/ChoiceList'),
        meta: { title: '选择题', icon: 'table' },
        hidden: true
      },
      {
        path: 'truefalse',
        name: 'truefalse',
        component: () => import('@/views/components/bank/bank/TrueFalseList'),
        meta: { title: '判断题', icon: 'table' },
        hidden: true
      },
      {
        path: 'completion',
        name: 'completion',
        component: () => import('@/views/components/bank/bank/CompletionList'),
        meta: { title: '填空题', icon: 'table' },
        hidden: true
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/components/bank/bank/QuestionList'),
        meta: { title: '主观题', icon: 'table' },
        hidden: true
      },
      {
        path: 'code',
        name: 'code',
        component: () => import('@/views/components/bank/bank/CodeList'),
        meta: { title: '编程题', icon: 'table' },
        hidden: true
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/teacher',
    name: 'user',
    meta: { title: '用户管理', icon: 'icon-yonghu' },
    children: [
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/components/user/teacher/TeacherList'),
        meta: { title: '教师列表', icon: 'icon-xuexiao_jiaoshi' },
        auth: 'user:teacher:list'
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/components/user/student/StudentList'),
        meta: { title: '学生列表', icon: 'icon-nanxuesheng' },
        auth: 'user:student:list'
      }
    ]
  },

  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/paper',
    name: 'paper',
    meta: { title: '试卷管理', icon: 'icon-shijuan' },
    children: [
      {
        path: 'paper',
        name: 'paper',
        component: () => import('@/views/components/paper/PaperList'),
        meta: { title: '试卷列表', icon: 'icon-shijuan' },
        auth: 'paper:list'
      },
      {
        path: 'paperLog',
        name: 'paperLog',
        component: () => import('@/views/components/paper/PaperLogList'),
        meta: { title: '组卷日志', icon: 'icon-wj-rz' },
        auth: 'paper:log:list'
      },
      {
        path: 'question/:paperId',
        name: 'paperQuestion',
        component: () => import('@/views/components/paper/QuestionList'),
        meta: { title: '修改题目', icon: 'table' },
        hidden: true
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/room',
    name: 'exam',
    meta: { title: '考试管理', icon: 'icon-shijuan' },
    children: [
      {
        path: 'room',
        name: 'room',
        component: () => import('@/views/components/exam/RoomList'),
        meta: { title: '考场列表', icon: 'icon-shijuan' },
        auth: 'ex:room:list'
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/role',
    name: 'auth',
    meta: { title: '权限管理', icon: 'icon-quanxian' },
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/components/auth/role/RoleList'),
        meta: { title: '角色列表', icon: 'icon-navicon-jsgl' },
        auth: 'ar:role:list'
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('@/views/components/auth/auth/AuthList'),
        meta: { title: '权限列表', icon: 'icon-quanxian' },
        auth: 'ar:auth:list'
      }
    ]
  },

  {
    path: '/dict',
    component: Layout,
    redirect: '/dict/college',
    name: 'dict',
    meta: { title: '系统管理', icon: 'icon-xitong' },
    children: [
      {
        path: 'college',
        name: 'college',
        component: () => import('@/views/components/dict/college/CollegeList'),
        meta: { title: '学院列表', icon: 'icon-xueyuan' },
        auth: 'sys:college:list'
      },
      {
        path: 'major',
        name: 'major',
        component: () => import('@/views/components/dict/major/MajorList'),
        meta: { title: '专业列表', icon: 'icon-a-fuben' },
        auth: 'sys:major:list'
      },
      {
        path: 'job',
        name: 'job',
        component: () => import('@/views/components/dict/job/JobList'),
        meta: { title: '职务列表', icon: 'icon-zhiwu' },
        auth: 'sys:job:list'
      },
      {
        path: 'title',
        name: 'title',
        component: () => import('@/views/components/dict/title/TitleList'),
        meta: { title: '职称列表', icon: 'icon-medtitle' },
        auth: 'sys:title:list'
      },
      {
        path: 'subject',
        name: 'subject',
        component: () => import('@/views/components/dict/subject/SubjectList'),
        meta: { title: '科目列表', icon: 'icon-xuexiao_kemu' },
        auth: 'sys:subject:list'
      }
    ]
  },

  {
    path: '/mine',
    component: Layout,
    redirect: '/mine/info',
    name: 'mine',
    meta: { title: '个人管理', icon: 'icon-geren' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/components/user/mine/MineInfo'),
        meta: { title: '个人资料', icon: 'icon-ziliao' }
      },
      {
        path: 'pwd',
        name: 'pwd',
        component: () => import('@/views/components/user/mine/Pwd'),
        meta: { title: '密码修改', icon: 'icon-mima' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
