import request from '@/utils/request'
var group_name = 'dict'
export default {
  save(dict) {
    // 保存或修改
    if (dict.dictId === '') {
      return request({
        url: `/${group_name}/add`,
        method: 'post',
        data: dict
      })
    } else {
      return request({
        url: `/${group_name}/update`,
        method: 'put',
        data: dict
      })
    }
  },
  list(page) {
    // 分页查询
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  get(id) {
    // 根据id查询
    return request({
      url: `/${group_name}/get/${id}`,
      method: 'get'
    })
  },
  delete(id) {
    // 根据id删除
    return request({
      url: `/${group_name}/delete/${id}`,
      method: 'delete'
    })
  },
  all(dict) {
    return request({
      url: `/${group_name}/all`,
      method: 'post',
      data: dict
    })
  },
  getByFather(id) {
    // 根据父级id查询
    return request({
      url: `/${group_name}/childList/${id}`,
      method: 'get'
    })
  }
}
