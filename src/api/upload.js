import request from '@/utils/request'
export default {
  upload (data) {
    return request({
      url: `/upload`,
      method: 'post',
      data: data
    })
  },
}
