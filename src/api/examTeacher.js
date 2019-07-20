import request from '@/utils/request'
var group_name = 'examTeacher'
export default {
  save(examTeacher) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: examTeacher
    })
  },
  getList(examId) {
    return request({
      url: `/${group_name}/getList/${examId}`,
      method: 'get'
    })
  },
  delete(examTeacherId) {
    return request({
      url: `/${group_name}/delete/${examTeacherId}`,
      method: 'delete'
    })
  }
}
