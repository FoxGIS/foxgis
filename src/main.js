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
import Map from './components/Map'
import App from './components/App'
import Home from './components/Home'
import Atlas from './components/Atlas'
import Blog from './components/Blog'
import Login from './components/Login'
import Studio from './components/Studio'
import Projects from './components/Projects'
import Fonts from './components/Fonts'
import Datas from './components/Datas'
import Icons from './components/Icons'


Vue.config.debug = true
Vue.use(Router)

Vmdl.registerAll(Vue)
Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-footer', Footer)
Vue.component('foxgis-card', Card)
Vue.component('foxgis-search', Search)
Vue.component('foxgis-map', Map)

let router = new Router({
  history: true
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
        component: Projects
      },
      '/projects': {
        component: Projects
      },
      '/datas': {
        component: Datas
      },
      '/fonts': {
        component: Fonts
      },
      '/icons': {
        component: Icons
      }
    }
  }
})

router.alias({
  '/studio':'/studio/projects'
})
// router.redirect({
//   '*': '/'
// })

router.start(App, '#app')
