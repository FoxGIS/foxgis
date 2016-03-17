<template>
<div>
  <foxgis-header></foxgis-header>
  <div>HOME</div>
  <foxgis-footer></foxgis-footer>
</div>
</template>


<script>
import Header from './Header'
import Footer from './Footer'

export default {
  components: {
    foxgisHeader: Header,
    foxgisFooter: Footer
  }
}

</script>


<style scoped>

</style>
