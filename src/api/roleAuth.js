import request from '@/utils/request'
var group_name = 'roleAuth'
export default {
  authList(roleId) {
    return request({
      url: `/${group_name}/authList/${roleId}`,
      method: 'get'
    })
  },
  update(roleAuth) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: roleAuth
    })
  }
}
