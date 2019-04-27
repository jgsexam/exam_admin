import request from '@/utils/request'
var group_name = 'code'
export default {
  save(code) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: code
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(codeId) {
    return request({
      url: `/${group_name}/delete/${codeId}`,
      method: 'delete'
    })
  },
  get(codeId) {
    return request({
      url: `/${group_name}/get/${codeId}`,
      method: 'get'
    })
  },
  update(code) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: code
    })
  }
}
