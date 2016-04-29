const state = {
  style: {}
}

// mutations
const mutations = {
  PATCH_STYLE (state, style) {
    state.style = style
  }
}

export default {
  state,
  mutations
}
