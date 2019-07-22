import request from '@/utils/request'
var group_name = 'examStudent'
export default {
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  getList(examId) {
    return request({
      url: `/${group_name}/getList/${examId}`,
      method: 'get'
    })
  },
  saveOne(examStudent) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: examStudent
    })
  },
  saveList(ids, examId) {
    return request({
      url: `/${group_name}/addList/${examId}`,
      method: 'post',
      data: ids
    })
  },
  delete(id) {
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'delete',
      data: id
    })
  }
}
