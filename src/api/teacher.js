import request from '@/utils/request'
var group_name = 'teacher'
export default {
  login (teacher) {
    return request({
      url: `/${group_name}/login`,
      method: 'post',
      data: teacher
    })
  },
  save (teacher) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: teacher
    })
  },
  update (teacher) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: teacher
    })
  },
  rePwd (teacher) {
    return request({
      url: `/${group_name}/rePwd`,
      method: 'put',
      data: teacher
    })
  },
  resetPwd (ids) {
    return request({
      url: `/${group_name}/resetPwd`,
      method: 'put',
      data: ids
    })
  },
  resetAll () {
    return request({
      url: `/${group_name}/resetAll`,
      method: 'get'
    })
  },
  list (page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get (teacherId) {
    return request({
      url: `/${group_name}/get/${teacherId}`,
      method: 'get'
    })
  },
  info () {
    return request({
      url: `/${group_name}/info`,
      method: 'get'
    })
  },
  delete (teacherId) {
    return request({
      url: `/${group_name}/delete/${teacherId}`,
      method: 'delete'
    })
  },
  all (obj) {
    return request({
      url: `/${group_name}/all`,
      method: 'post',
      data: obj
    })
  },
  freeList () {
    return request({
      url: `/${group_name}/freeList`,
      method: 'get'
    })
  },
}
