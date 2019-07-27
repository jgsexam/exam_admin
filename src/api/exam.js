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
  }
}
