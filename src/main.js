require('material-design-lite/material.js')
require('material-design-lite/dist/material.min.css')
require('mapbox-gl/dist/mapbox-gl.css')

import Vue from 'vue'
import Router from 'vue-router'
import Vmdl from 'vue-mdl'
import Layout from './components/Layout'
import Footer from './components/Footer'
import Map from './components/Map'
import App from './components/App'
import Home from './components/Home'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Login from './components/Login'
import Studio from './components/Studio'
import Pictures from './components/Pictures'


Vue.config.debug = true
Vue.use(Router)

Vmdl.registerAll(Vue)
Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-footer', Footer)
Vue.component('foxgis-map', Map)

let router = new Router()

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
        component: Pictures
      },
      '/pictures': {
        component: Pictures
      },
      '/datas': {
        component: Pictures
      },
      '/fonts': {
        component: Pictures
      },
      '/icons': {
        component: Pictures
      }
    }
  }
})

// router.redirect({
//   '*': '/'
// })

router.start(App, '#app')
