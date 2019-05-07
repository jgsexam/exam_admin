const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  loading: state => state.app.loading,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  auths: state => state.user.auths,
  bankId: state => state.question.bankId,
  typeId: state => state.question.typeId
}
export default getters
