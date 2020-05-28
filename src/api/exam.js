import request from '@/utils/request'
var group_name = 'exam'
export default {
  save (exam) {
    return request({
      url: `/${group_name}/create`,
      method: 'post',
      data: exam
    })
  },
  list (page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete (examId) {
    return request({
      url: `/${group_name}/delete/${examId}`,
      method: 'delete'
    })
  },
  get (examId) {
    return request({
      url: `/${group_name}/get/${examId}`,
      method: 'get'
    })
  },
  update (exam) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: exam
    })
  },
  info (examId) {
    return request({
      url: `/${group_name}/info/${examId}`,
      method: 'get'
    })
  },
  stuPaperList(examId) {
    return request({
      url: `/studentPaperDO/list/${examId}`,
      method: 'get'
    })
  },
  gennerateLog(examId) {
    return request({
      url: `/examLogDO/add/${examId}`,
      method: 'get'
    })
  },
  getLogs() {
    return request({
      url: `/examLogDO/list`,
      method: 'post',
      data: {
        columns: [], // 查询参数
        currentCount: 10, //  每页显示条数
        currentPage: 1, // 当前页
        index: 0, // 起始索引
        list: [], // 每页显示数据
        sortName: '', // 排序列
        sortOrder: null, // 排序方式
        totalCount: null, // 总条数
        totalPage: null // 总页数
      }
    })
  },
  getPaperDetail(paperId) {
    return request({
      url: `/studentPaperDO/info/${paperId}`,
      method: 'get'
    })
  },
  /**
   * 
   * @param {{
   * paperId: !string;
   * configId: !string;
   * stuId: !string;
   * questionId: !string;
   * grade: !number;
   * }} args 
   */
  commitQuestionScore(args) {
    return request({
      url: `/studentPaperConfigSubScoreDO/correct`,
      method: 'post',
      data: args
    })
  },
  commitPaper(paperId) {
    return request({
      url: `/studentPaperDO/paper/submit/${paperId}`,
      method: 'get'
    })
  }


}
