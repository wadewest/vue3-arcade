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

const screen_rect = new Rect(0, 0, 640, 480);
const full_stop = new Point(0, 0);
const actors = [];
const player = new ScreenActor(screen_rect.midpoint(), full_stop, 20, screen_rect);
actors[0] = [player];
actors[1] = []; // projectiles

let ctx: null = null;
let animation_id = null;
let update_timer = null;

function initGame() {
  game_canvas.value.width = screen_rect.width;
  game_canvas.value.height = screen_rect.height;
  game_canvas.value.addEventListener('click', canvasClicked);
  ctx = game_canvas.value.getContext('2d');
  update();
  draw();
}

function canvasClicked(event) {
  let atan2 = Math.atan2( 
    player.location.x - event.layerX,
    player.location.y - event.layerY
  );
  let x = -Math.sin(atan2);
  let y = -Math.cos(atan2);
  actors[1].push(new ScreenActor(screen_rect.midpoint(), new Point(x, y), 5, screen_rect));
}

function update() {
  actors.flat().forEach(actor => actor.update());
  for(let i = 0; i < actors.length; i++) {
    actors[i] = actors[i].filter(actor => {
      return actor.status !== 'dead'
    });
  }
  update_timer = setTimeout(update, 0.1);
}

function draw() {
  ctx.clearRect(0, 0, game_canvas.value.width, game_canvas.value.height);
  actors.flat().forEach(actor => actor.draw(ctx));
  animation_id = requestAnimationFrame(draw);
}

onMounted(initGame);
</script>

<style scoped lang="scss">
canvas {
  background-color: black;
}
</style>
