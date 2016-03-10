<template>
<div>
  <div class="mdl-layout mdl-js-layout">
    <foxgis-header id='header'></foxgis-header>
    <main class="mdl-layout__content">
      <foxgis-map></foxgis-map> 
    </main>
    <foxgis-footer id='footer'></foxgis-footer>
  </div>
</div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import Map from './components/Map'

export default {
  components: {
    foxgisHeader: Header,
    foxgisFooter: Footer,
    foxgisMap: Map
  }
}
</script>

<style scoped>

</style>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>


