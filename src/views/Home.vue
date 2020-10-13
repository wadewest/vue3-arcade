<template>
  <div ref="game_container" class="home game-content" >
    <div class="overlay">Score: {{score}}</div>
    <canvas ref="game_canvas" />
  </div>
</template>

<script setup lang="ts">
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenActor from '@/models/ScreenActor';

import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'Home',
  components: {
  },
};

export const game_container = ref(null);
export const game_canvas = ref(null);
export const score = ref(0);

const screen_rect = new Rect(0, 0, 640, 480);
const full_stop = new Point(0, 0);
const actors = [];
const player = new ScreenActor(screen_rect.midpoint(), full_stop, 20, screen_rect);
actors[0] = [player];
actors[1] = []; // projectiles
actors[2] = []; // enemies

let ctx: null = null;
let animation_id = null;
let update_timer = null;
let spawn_timer = null;

function initGame() {
  game_canvas.value.width = screen_rect.width;
  game_canvas.value.height = screen_rect.height;
  game_container.value.addEventListener('click', canvasClicked);
  ctx = game_canvas.value.getContext('2d');
  start_spawner();
  update();
  draw();
}

function tearDown() {
  game_container.value.removeEventListener('click', canvasClicked);
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

function start_spawner(): void {
  let timeout = Math.random()*4000 + 1000;
  spawn_timer = setTimeout(create_enemy, timeout);
}

function create_enemy(): void {
  if(actors[2].length >= 50) return;
  let radius = Math.round(Math.random()*15) + 5
  actors[2].push(
    new ScreenActor(
      screen_rect.midpoint(), 
      new Point(0,0), 
      radius, 
      screen_rect.grow(radius*4, radius*4)
    ).teleport_to_random_border_location().move_to(player.location)
  );
  start_spawner();
}

onMounted(initGame);
onBeforeUnmount(tearDown);
</script>

<style scoped lang="scss">
.game-content {
  width: fit-content;
  margin: 0 auto;
  user-select: none;
}

canvas {
  background-color: black;
}

.overlay {
  cursor: default;
  position: fixed;
  color: white;
  margin: 0.2rem;
}
</style>
