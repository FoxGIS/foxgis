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
import Atlas from './views/Atlas'
import Blog from './components/Blog'
import Login from './components/Login'
import Register from './components/Register'
import Studio from './components/Studio'
import Maps from './components/Maps'
import Fonts from './views/Fonts'
import Data from './components/Data'
import Icons from './components/Icons'
import Upload from './views/Upload'
import DataCardsMap from './components/DataCards-Map'
import DataCardsData from './components/DataCards-Data'
import DataCardsIcon from './components/DataCards-Icon'
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
import DialogInput from './components/Dialog-Input'
import IconPanel from './components/IconPanel'
import FilterData from './components/FilterDataPanel'
import User from './views/User'
import SVGEditor from './components/SVGEditor.vue'

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
Vue.component('foxgis-dialog-input',DialogInput)
Vue.component('foxgis-icon-panel',IconPanel)
Vue.component('foxgis-filter-data',FilterData)
Vue.component('foxgis-svgeditor',SVGEditor)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: function (resolve) {
      require(['./components/Login.vue'], resolve)
    }
  },
  '/home': {
    component: function (resolve) {
      require(['./components/Home.vue'], resolve)
    }
  },
  '/atlas': {
    component: function (resolve) {
      require(['./views/Atlas.vue'], resolve)
    }
  },
  '/blog': {
    component: function (resolve) {
      require(['./components/Blog.vue'], resolve)
    }
  },
  '/login': {
    component: function (resolve) {
      require(['./components/Login.vue'], resolve)
    }
  },
  '/register': {
    component: function (resolve) {
      require(['./components/Register.vue'], resolve)
    }
  },
  '/studio': {
    component: function (resolve) {
      require(['./components/Studio.vue'], resolve)
    },
    subRoutes: {
      '/': {
        component: function (resolve) {
          require(['./views/Upload.vue'], resolve)
        }
      },
      '/maps': {
        component: function (resolve) {
          require(['./components/Maps.vue'], resolve)
        }
      },
      '/data': {
        component: function (resolve) {
          require(['./components/Data.vue'], resolve)
        }
      },
      '/fonts': {
        component: function (resolve) {
          require(['./views/Fonts.vue'], resolve)
        }
      },
      '/sprites': {
        component: function (resolve) {
          require(['./components/Icons.vue'], resolve)
        }
      },
      '/uploads': {
        component:function (resolve) {
          require(['./views/Upload.vue'], resolve)
        }
      },
      '/user':{
        component:function (resolve) {
          require(['./views/User.vue'], resolve)
        }
      }
    }
  },
  '/mapview': {
    component: function (resolve) {
      require(['./components/MapView.vue'], resolve)
    }
  },
  '/mapeditor/*any': {
    component: function (resolve) {
      require(['./components/MapEditor.vue'], resolve)
    }
  },
  '/svg/*any': {
    component: function (resolve) {
      require(['./components/SVGEditor.vue'], resolve)
    }
  }
})


router.start(App, '#app')
