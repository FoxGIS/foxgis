<template>
<div>
  <foxgis-header id='header'></foxgis-header>
  <foxgis-home></foxgis-home>
  <foxgis-footer id='footer'></foxgis-footer>
</div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'

export default {
  components: {
    foxgisHeader: Header,
    foxgisFooter: Footer,
    foxgisHome: Home
  }
}
</script>

<style scoped>
/*#footer {
  position: fixed;
  bottom: 0;
}*/

</style>
