require('material-design-lite/material.min.js')
require('material-design-lite/material.min.css')
require('material-design-icons/iconfont/material-icons.css')
require('mapbox-gl/dist/mapbox-gl.css')


import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import VueMdl from 'vue-mdl'

import App from './views/App'
import Home from './views/Home'
import Atlas from './views/Atlas'
import Login from './views/Login'
import Register from './views/Register'
import Studio from './views/Studio'
import MapEditor from './views/MapEditor'

import Maps from './views/studio/Maps'
import Fonts from './views/studio/Fonts'
import Data from './views/studio/Data'
import Icons from './views/studio/Icons'
import Upload from './views/studio/Upload'
import User from './views/studio/User'

import Layout from './components/common/Layout'
import Search from './components/common/Search'
import DialogPrompt from './components/common/Dialog-Prompt'
import DialogInput from './components/common/Dialog-Input'
import Loading from './components/common/Loading'
import SVGEditor from './components/common/SVGEditor.vue'

import DataCardsMap from './components/datacards/DataCards-Map'
import DataCardsData from './components/datacards/DataCards-Data'
import DataCardsIcon from './components/datacards/DataCards-Icon'
import DataCardsAtlas from './components/datacards/DataCards-Atlas'

import TOC from './components/mapeditor/MapEditorToc.vue'
import MapEditorView from './components/mapeditor/MapEditorView.vue'
import MapStyleEditor from './components/mapeditor/MapStyleEditor.vue'
import MapDistrictSelect from './components/mapeditor/MapDistrictSelect'
import ModalStyleTemplate from './components/mapeditor/ModalStyleTemplate'
import IconPanel from './components/mapeditor/IconPanel'
import FilterData from './components/mapeditor/FilterDataPanel'
import StopsPanel from './components/mapeditor/stopsPanel.vue'
import TemplateWizard from './components/mapeditor/TemplateWizard.vue'

Vue.config.debug = true
Vue.use(Router)
Vue.use(VueMdl)
Vue.use(Resource)

Vue.component('foxgis-layout', Layout)
Vue.component('foxgis-search', Search)
Vue.component('foxgis-data-cards-atlas', DataCardsAtlas)
Vue.component('foxgis-data-cards-map', DataCardsMap)
Vue.component('foxgis-data-cards-data', DataCardsData)
Vue.component('foxgis-data-cards-icon', DataCardsIcon)
Vue.component('foxgis-toc', TOC)
Vue.component('foxgis-drafmap',MapEditorView)
Vue.component('foxgis-style-editor',MapStyleEditor)
Vue.component('foxgis-district-select',MapDistrictSelect)
Vue.component('foxgis-style-template',ModalStyleTemplate)
Vue.component('foxgis-loading',Loading)
Vue.component('foxgis-dialog-prompt',DialogPrompt)
Vue.component('foxgis-dialog-input',DialogInput)
Vue.component('foxgis-icon-panel',IconPanel)
Vue.component('foxgis-filter-data',FilterData)
Vue.component('foxgis-svgeditor',SVGEditor)
Vue.component('foxgis-stops-panel',StopsPanel)
Vue.component('foxgis-template-wizard',TemplateWizard)

let router = new Router({
  history: false
})

router.map({
  '/': {
    component: function (resolve) {
      require(['./views/Login.vue'], resolve)
    }
  },
  '/home': {
    component: function (resolve) {
      require(['./views/Home.vue'], resolve)
    }
  },
  '/atlas': {
    component: function (resolve) {
      require(['./views/Atlas.vue'], resolve)
    }
  },
  '/login': {
    component: function (resolve) {
      require(['./views/Login.vue'], resolve)
    }
  },
  '/register': {
    component: function (resolve) {
      require(['./views/Register.vue'], resolve)
    }
  },
  '/studio': {
    component: function (resolve) {
      require(['./views/Studio.vue'], resolve)
    },
    subRoutes: {
      '/': {
        component: function (resolve) {
          require(['./views/studio/Upload.vue'], resolve)
        }
      },
      '/maps': {
        component: function (resolve) {
          require(['./views/studio/Maps.vue'], resolve)
        }
      },
      '/data': {
        component: function (resolve) {
          require(['./views/studio/Data.vue'], resolve)
        }
      },
      '/fonts': {
        component: function (resolve) {
          require(['./views/studio/Fonts.vue'], resolve)
        }
      },
      '/sprites': {
        component: function (resolve) {
          require(['./views/studio/Icons.vue'], resolve)
        }
      },
      '/uploads': {
        component:function (resolve) {
          require(['./views/studio/Upload.vue'], resolve)
        }
      },
      '/user':{
        component:function (resolve) {
          require(['./views/studio/User.vue'], resolve)
        }
      }
    }
  },
  '/mapeditor/*any': {
    component: function (resolve) {
      require(['./views/MapEditor.vue'], resolve)
    }
  }
})


router.start(App, '#app')
