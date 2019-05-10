import request from '@/utils/request'
var group_name = 'paperLog'
export default {
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(logId) {
    return request({
      url: `/${group_name}/delete/${logId}`,
      method: 'delete'
    })
  }
}
