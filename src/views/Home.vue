<template>
  <div class="home">
    <canvas ref="game_canvas" />
  </div>
</template>

<script setup lang="ts">

interface IVector {
  x: number;
  y: number;
}

class Point implements IVector {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
  midpoint(): Point {
    return new Point(this.x/2, this.y/2);
  }
}

class Rect implements IVector {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class ScreenActor {
  location: Point;
  velocity: Point;
  radius: number;

  constructor(location:Point, velocity:Point, radius:number) {
    this.location = location;
    this.velocity = velocity;
    this.radius = radius;
  }

  update(): void {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
  }

  draw(ctx): void {
    ctx.beginPath();
    ctx.arc( this.location.x, this.location.y, 
      this.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
  }

}

import { ref, onMounted } from 'vue';

export const game_canvas = ref(null);
let ctx: null = null;
let dimensions = new Point(640, 480);
const full_stop = new Point(0, 0);
let actor = new ScreenActor( dimensions.midpoint(), full_stop, 20);
let animation_id = null;
let update_timer = null;

function initGame() {
  game_canvas.value.width = dimensions.x;
  game_canvas.value.height = dimensions.y;
  ctx = game_canvas.value.getContext('2d');
  update();
  draw();
}

function update() {
  actor.update();
  update_timer = setTimeout(update, 0.0001);
}

function draw() {
  ctx.clearRect(0, 0, game_canvas.value.width, game_canvas.value.height);
  actor.draw(ctx);
  animation_id = requestAnimationFrame(draw);
}

onMounted(initGame);
export default {
  name: 'Home',
  components: {
  },
};
</script>

<style scoped lang="scss">
canvas {
  background-color: black;
}
</style>
