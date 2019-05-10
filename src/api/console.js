import request from '@/utils/request'
var group_name = 'console'
export default {
  bankInfo() {
    return request({
      url: `/${group_name}/bankInfo`,
      method: 'get'
    })
  }
}
