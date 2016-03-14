import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'
import Atlas from './components/Atlas'

Vue.config.debug = true
Vue.use(Router)

let router = new Router()

router.map({
  '/': {
    component: Home
  },
  '/login': {
    component: Login
  },
  '/atlas': {
  	component: Atlas
  }
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
