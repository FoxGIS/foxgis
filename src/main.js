require('material-design-lite/material.js')
require('material-design-lite/dist/material.min.css')
require('mapbox-gl/dist/mapbox-gl.css')

import Vue from 'vue'
import Router from 'vue-router'
import Vmdl from 'vue-mdl'
import Layout from './components/Layout'
import Footer from './components/Footer'
import Card from './components/Card'
import Search from './components/Search'
import Table from './components/Table'
import Map from './components/Map'
import App from './components/App'
import Home from './components/Home'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Login from './components/Login'
import Studio from './components/Studio'
import Maps from './components/Maps'
import Fonts from './components/Fonts'
import Data from './components/Data'
import Icons from './components/Icons'
import Pictures from './components/Pictures'
import DataCardsMap from './components/DataCards-Map'
import DataCardsData from './components/DataCards-Data'
import DataCardsIcon from './components/DataCards-Icon'
import DataCardsFont from './components/DataCards-Font'
import MapView from './components/MapView'
import DataCards from './components/DataCards'
import Post from './components/Post.vue'



Vue.config.debug = true
Vue.use(Router)

Vmdl.registerAll(Vue)
Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-footer', Footer)
Vue.component('foxgis-card', Card)
Vue.component('foxgis-search', Search)
Vue.component('foxgis-table', Table)
Vue.component('foxgis-map', Map)
Vue.component('foxgis-data-cards-map', DataCardsMap)
Vue.component('foxgis-data-cards-data', DataCardsData)
Vue.component('foxgis-data-cards-font', DataCardsIcon)
Vue.component('foxgis-data-cards-icon', DataCardsFont)
Vue.component('foxgis-data-cards', DataCards)
Vue.component('foxgis-post', Post)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: Home
  },
  '/home': {
    component: Home
  },
  '/atlas': {
    component: Atlas
  },
  '/blog': {
    component: Blog
  },
  '/login': {
    component: Login
  },
  '/studio': {
    component: Studio,
    subRoutes: {
      '/': {
        component: Maps
      },
      '/maps': {
        component: Maps
      },
      '/data': {
        component: Data
      },
      '/fonts': {
        component: Fonts
      },
      '/icons': {
        component: Icons
      },
      '/pictures': {
        component: Pictures
      }
    }
  },
  '/mapview': {
    component: MapView
  }
})

// router.alias({
//   '/studio':'/studio/Maps'
// })
// router.redirect({
//   '*': '/'
// })

router.start(App, '#app')
