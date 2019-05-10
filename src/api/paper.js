import request from '@/utils/request'
var group_name = 'paper'
export default {
  save(paper) {
    return request({
      url: `/${group_name}/add`,
      method: 'post',
      data: paper
    })
  },
  list(page) {
    return request({
      url: `/${group_name}/list`,
      method: 'post',
      data: page
    })
  },
  delete(paperId) {
    return request({
      url: `/${group_name}/delete/${paperId}`,
      method: 'delete'
    })
  },
  get(paperId) {
    return request({
      url: `/${group_name}/get/${paperId}`,
      method: 'get'
    })
  },
  update(paper) {
    return request({
      url: `/${group_name}/update`,
      method: 'put',
      data: paper
    })
  },
  questionList(paperId) {
    return request({
      url: `/${group_name}/questionList/${paperId}`,
      method: 'get'
    })
  },
  submitPaper(paperId) {
    return request({
      url: `/${group_name}/submit/${paperId}`,
      method: 'get'
    })
  },
  submitPaperGa(gaPaper) {
    return request({
      url: `/${group_name}/gaSubmit`,
      method: 'post',
      data: gaPaper
    })
  },
  typeNum(paperId) {
    return request({
      url: `/${group_name}/typeNum/${paperId}`,
      method: 'get'
    })
  }
}
