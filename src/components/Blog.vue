<template>
<div>
  <foxgis-layout>
  <mdl-button class="new-post" v-mdl-ripple-effect raised accent title="发布新文章">
      发布新文章
    </mdl-button>
  <foxgis-post :post = 'post'></foxgis-post>
  </foxgis-layout>
</div>
</template>


<script>
export default {
  data() {
    return {
      post: {
        title: '在线制图指南',
        date: '2016-3-27',
        author: 'ironicstone',
        content: 'Vector tiles are a way to deliver geographic data in small chunks to a browser or other client app. Vector tiles are similar to raster tiles but instead of raster images the data returned is a vector representation of the features in the tile. For example a GeoJSON vector tile might include roads as LineStrings and bodies of water as Polygons. Some vector tile sources are clipped so that all geometry is bounded in the tiles, potentially chopping features in half. Other vector tile sources serve unclipped geometry so that a whole lake may be returned even if only a small part of it intersects the tile.There are currently several experimental projects serving vector tiles from OpenStreetMap data. The Mapnik Vector Tiles are one source of OSM vector tiles in GeoJSON format. The OpenStreetMap API can also be used as an ad-hoc vector tile source for OSM XML data by creating appropriate bounding box queries; the iD editor uses this mechanism to access OSM source data.'
      }
    }
  }
}

</script>


<style scoped>
.new-post {
  position: absolute;
  right: 30px;
  top: 100px;
}
</style>
