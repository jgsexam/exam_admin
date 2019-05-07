import request from '@/utils/request'
var group_name = 'auth'
export default {
  treeList() {
    return request({
      url: `/${group_name}/treeList`,
      method: 'get'
    })
  }
}
