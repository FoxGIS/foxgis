import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App'
import Home from './components/Home'
import Login from './components/Login'

Vue.use(Router)

let router = new Router()

router.map({
  '/': {
    component: Home
  },
  '/login': {
    component: Login
  }
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
