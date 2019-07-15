import request from '@/utils/request'
var group_name = 'room'
export default {
  save(room) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: room
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(roomId) {
    return request({
      url: `/${group_name}/delete/${roomId}`,
      method: 'delete'
    })
  },
  get(roomId) {
    return request({
      url: `/${group_name}/get/${roomId}`,
      method: 'get'
    })
  },
  update(room) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: room
    })
  },
  free(id) {
    return request({
      url: `/${group_name}/freeList/${id}`,
      method: 'get'
    })
  },
  all() {
    return request({
      url: `/${group_name}/all`,
      method: 'get'
    })
  }
}
