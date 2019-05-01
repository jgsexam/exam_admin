import request from '@/utils/request'
var group_name = 'paperConfigQuestion'
export default {
  deleteByPaperAndQuestionId(configId, questionId) {
    return request({
      url: `/${group_name}/delete/${configId}/${questionId}`,
      method: 'delete'
    })
  }
}
