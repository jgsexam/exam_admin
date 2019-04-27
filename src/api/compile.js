import request from '@/utils/request'
var group_name = 'compile'
export default {
  all() {
    return request({
      url: `/${group_name}/all`,
      method: 'get'
    })
  }
}
