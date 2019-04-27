import request from '@/utils/request'
var group_name = 'paperConfig'
export default {
  addToPaper(config) {
    return request({
      url: `/${group_name}/addToPaper`,
      method: 'post',
      data: config
    })
  },
  getQuestionNum(paperId) {
    return request({
      url: `/${group_name}/getQuestionNum/${paperId}`,
      method: 'get'
    })
  }
}
