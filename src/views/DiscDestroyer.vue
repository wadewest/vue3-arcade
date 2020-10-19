<template>
  <div ref="game_container" class="game-content" >
    <div class="overlay">
      <div>Health: {{player.health}}</div>
      <div>Score: {{player.score}}</div>
      <div>Shots: {{player.shots_fired}}</div>
    </div>
    <canvas ref="game_canvas" />
  </div>
</template>

<script setup lang="ts">
import DiscDestroyerWorld from '@/models/disc_destroyer/DiscDestroyerWorld';
import Player from '@/models/disc_destroyer/Player';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenActor from '@/models/ScreenActor';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';

export const game_container: Ref<HTMLDivElement|null> = ref(null);
export const game_canvas: Ref<HTMLCanvasElement|null> = ref(null);
let ctx: CanvasRenderingContext2D|null = null;

const screen_rect = new Rect(0, 0, 640, 480);
export const player = reactive(new Player(screen_rect.midpoint(), null, 20, screen_rect.copy()));
const game_world = new DiscDestroyerWorld(player);
let last_time = 0;
let current_time = 0;
let delta_time = 0;

game_world.before_update = function(): boolean {
  if(last_time == 0) {
    last_time = performance.now();
    return false;
  }
  current_time = performance.now();
  delta_time = Math.floor(current_time - last_time) / 1000;
  return true;
}

game_world.after_update = function(): void {
  last_time = current_time;
}

game_world.before_draw = function(): boolean {
  if(!game_canvas.value || !ctx) return false;
  game_world.update(delta_time);
  ctx.clearRect(0, 0, game_canvas.value.width, game_canvas.value.height);
  return true
}
game_world.after_draw = function(): void {
  requestAnimationFrame(()=>game_world.draw(ctx));
}

function screen_was_clicked(event:MouseEvent): void {
  if(!game_canvas.value) return;
  game_world.fire_projectile_to(new Point(
    event.pageX - game_canvas.value.offsetLeft,
    event.pageY - game_canvas.value.offsetTop
  ));
}

function init_game(): void {
  if(!game_canvas.value || !game_container.value) return;
  game_canvas.value.width = screen_rect.width;
  game_canvas.value.height = screen_rect.height;
  ctx = game_canvas.value.getContext('2d');
  game_container.value.addEventListener('click', screen_was_clicked);
  start_game();
}
onMounted(init_game);

function start_game() {
  game_world.draw(ctx);
}
</script>

<style scoped lang="scss">
.game-content {
  width: fit-content;
  margin: 0 auto;
  user-select: none;
}

canvas {
  position: relative;
  background-color: black;
}

.overlay {
  text-align: left;
  cursor: default;
  position: fixed;
  color: white;
  margin: 0.2rem;
  z-index: 5;
}
</style>
