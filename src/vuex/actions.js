export const changeStyle = ({ dispatch, state }, style) => {
  console.log('action')
  dispatch('PATCH_STYLE', style)
}

