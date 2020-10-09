<template>
  <div class="home">
    <canvas ref="game_canvas" />
  </div>
</template>

<script setup lang="ts">
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenActor from '@/models/ScreenActor';

import { ref, onMounted } from 'vue';

export default {
  name: 'Home',
  components: {
  },
};

export const game_canvas = ref(null);

const full_stop = new Point(0, 0);

let ctx: null = null;
let dimensions = new Point(640, 480);
let actor = new ScreenActor( dimensions.midpoint(), full_stop, 20);
let animation_id = null;
let update_timer = null;

function initGame() {
  game_canvas.value.width = dimensions.x;
  game_canvas.value.height = dimensions.y;
  game_canvas.value.addEventListener('click', canvasClicked);
  ctx = game_canvas.value.getContext('2d');
  update();
  draw();
}

function canvasClicked(event) {
  console.log(event);
  actor.location = new Point(event.layerX, event.layerY);
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
</script>

<style scoped lang="scss">
canvas {
  background-color: black;
}
</style>
