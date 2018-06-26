<template>
  <div id="app">
    <div class="container text-center">
      <h2>{{ title }}</h2>
      <label>Line Width    
          <input type="number" v-model="lineWidth" id="lineWidth">
      </label>
      <label>Line Color (ex. 00ff00)    
          <input type="text" v-model="lineColor" id="lineColor" >
      </label>
  <!--     <label>Canvas Width   
          <input type="number" v-model="width" min="150">
      </label>
      <label>Canvas Height   
          <input type="number" v-model="height" min="150">
      </label> -->
      <div class="settingGroup">
        <button type="button" class="btn btn-primary" v-on:click="undo">Undo</button>
        <button type="button" class="btn btn-primary" v-on:click="redo">Redo</button>
        <button type="button" class="btn btn-success" v-on:click="clearCanvas">Clear</button>
        <button type="button" class="btn btn-info" v-on:click="download"><a id="downloadImg">Download Image</a></button>
      </div>
      <canvas id="canvas" :w="100" :h="100" v-on:dragging="onDrag" v-on:resizing="onResize" :draggable="false" :resizable="true" :parent="true" v-on:mousedown="handleMouseDown" v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove" width="600px" height="600px"></canvas>
    </div>
  </div>
</template>


<script>
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
  name: 'canvas',
  data: function () {
    return {
      title: 'Canvas Paint-mini (HTML5, Vue.js, Webpack)',
      lineWidth: 2,
      lineColor: "F63E02",
      width: 600,
      height: 600,
      x: 0,
      y: 0,
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        down: false
      },
      redo_list: [],
      undo_list: [],
      counter: 0
      // c: globalStore.c 
    }
  },
  computed: {
    context: function(){
      var c = document.getElementById('canvas');
      var ctx = c.getContext('2d');
      return {
        c: c,
        ctx: ctx
      }
    },
    currentMouse: function () {
      // var c = document.getElementById("canvas");
      var rect = this.context.c.getBoundingClientRect();
      
      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    }
  },
  methods: {
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    },
    draw: function (event) {    
     if (this.mouse.down ) {
       var context = this.context.ctx;
       if(this.counter == 1){
         context.beginPath();
         this.counter = 0;
       }
       context.clearRect(0,0,this.width, this.height);
       context.lineTo(this.currentMouse.x, this.currentMouse.y);
       context.strokeStyle = "#" + this.lineColor;
       context.lineWidth = this.lineWidth;
       context.stroke()
     }
     
    },
    handleMouseDown: function (event) {
      this.mouse.down = true;
      this.mouse.current = {
        x: event.pageX,
        y: event.pageY
      }
      var context = this.context.ctx;
      context.moveTo(this.currentMouse.x, this.currentMouse.y)
    
    },
    handleMouseUp: function () {
      this.mouse.down = false;
    },
    handleMouseMove: function (event) {
      this.mouse.current = {
        x: event.pageX,
        y: event.pageY
      }     
      this.draw(event)    
    },
    saveState: function(canvas, list, keep_redo) {
      this.keep_redo = this.keep_redo || false;
      if(!keep_redo) {
        this.redo_list = [];
      }
      
      (list || this.undo_list).push(canvas.toDataURL());   
    },
    restoreState: function(canvas, ctx,  pop, push) {
      if(pop.length) {
        this.saveState(canvas, push, true);
        var restore_state = pop.pop();
        var img = new Element('img', {'src':restore_state});
        img.onload = function() {
          ctx.clearRect(0, 0, this.width, this.height);
          ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);  
        }
      }
    },
    undo: function() {
      this.restoreState(this.c, this.context.ctx, this.undo_list, this.redo_list);
    },
    redo: function() {
      this.restoreState(this.c, this.context.ctx, this.redo_list, this.undo_list);
    },
    ready: function () { 
      var context = this.context.ctx;
      context.imageSmoothingEnabled = false;
    // this.draw();
    },
    clearCanvas: function(){
      var context = this.context.ctx;
      context.clearRect(0, 0, this.width, this.height);
      this.counter++;
      context.closePath();
    },
    download: function(){
      var link = document.getElementById('downloadImg');
      var c = document.getElementById("canvas");
      link.href = c.toDataURL();
      link.download = "mypainting.png";
    }
  }
}
</script>


<style lang="scss">
@import './styles/custom-bootstrap.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
}
#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
}
body {
  background: #eee;
  font-size: 22px;
}
canvas {
  background: white;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
label{
  display: block;
}
div, 
label{
  margin-bottom: 10px;
}
button{
  font-size: 22px!important;
}
#downloadImg{
  text-decoration: none;
}
#downloadImg:active,
#downloadImg:clicked,
#downloadImg:focus{
  text-decoration: none;
  color: #000;
}
h2,
.settingGroup{
  margin-bottom: 30px;
}
</style>