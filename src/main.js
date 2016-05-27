require('material-design-lite/material.min.js')
require('material-design-lite/material.min.css')
require('material-design-icons/iconfont/material-icons.css')
require('mapbox-gl/dist/mapbox-gl.css')


import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueMdl from 'vue-mdl'
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
import Register from './components/Register'
import Studio from './components/Studio'
import Maps from './components/Maps'
import Fonts from './components/Fonts'
import Data from './components/Data'
import Icons from './components/Icons'
import Upload from './views/Upload'
import DataCardsMap from './components/DataCards-Map'
import DataCardsData from './components/DataCards-Data'
import DataCardsIcon from './components/DataCards-Icon'
import DataCardsFont from './components/DataCards-Font'
import MapView from './components/MapView'
import MapEditor from './components/MapEditor'
import DataCards from './components/DataCards'
import Post from './components/Post.vue'
import TOC from './components/MapEditorToc.vue'
import MapEditorView from './components/MapEditorView.vue'
import MapLayoutView from './components/MapLayoutView.vue'
import MapStyleEditor from './components/MapStyleEditor.vue'
import MapDistrictSelect from './components/MapDistrictSelect'
import ModalStyleTemplate from './components/ModalStyleTemplate'
import Loading from './components/Loading'
import Dialog from './components/Dialog'

Vue.config.debug = true
Vue.use(Router)
Vue.use(VueMdl)
Vue.use(Resource)

Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-footer', Footer)
Vue.component('foxgis-card', Card)
Vue.component('foxgis-search', Search)
Vue.component('foxgis-table', Table)
Vue.component('foxgis-map', Map)
Vue.component('foxgis-data-cards-map', DataCardsMap)
Vue.component('foxgis-data-cards-data', DataCardsData)
Vue.component('foxgis-data-cards-font', DataCardsFont)
Vue.component('foxgis-data-cards-icon', DataCardsIcon)
Vue.component('foxgis-data-cards', DataCards)
Vue.component('foxgis-post', Post)
Vue.component('foxgis-toc', TOC)
Vue.component('foxgis-drafmap',MapEditorView)
Vue.component('foxgis-layoutmap',MapLayoutView)
Vue.component('foxgis-style-editor',MapStyleEditor)
Vue.component('foxgis-district-select',MapDistrictSelect)
Vue.component('foxgis-style-template',ModalStyleTemplate)
Vue.component('foxgis-loading',Loading)
Vue.component('foxgis-dialog',Dialog)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: Login
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
  '/register': {
    component: Register
  },
  '/studio': {
    component: Studio,
    subRoutes: {
      '/': {
        component: Upload
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
      '/uploads': {
        component: Upload
      }
    }
  },
  '/mapview': {
    component: MapView
  },
  '/mapeditor/*any': {
    component: MapEditor
  }
})


router.start(App, '#app')
