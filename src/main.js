import Vue from 'vue'
import App from './App.vue'
import VueDraggableResizable from 'vue-draggable-resizable'

new Vue({
  el: '#app',
  render: h => h(App)
})

export const globalStore = new Vue({
  data: {
    //   
  }
})
