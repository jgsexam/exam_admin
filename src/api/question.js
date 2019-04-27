import request from '@/utils/request'
var group_name = 'question'
export default {
  save(question) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: question
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(questionId) {
    return request({
      url: `/${group_name}/delete/${questionId}`,
      method: 'delete'
    })
  },
  get(questionId) {
    return request({
      url: `/${group_name}/get/${questionId}`,
      method: 'get'
    })
  },
  update(question) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: question
    })
  },
  search(page) {
    return request({
      url: `/${group_name}/search`,
      method: 'post',
      data: page
    })
  }
}
