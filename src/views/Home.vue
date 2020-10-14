<template>
  <div ref="game_container" class="home game-content" >
    <div class="overlay">
      <div>Health: {{health}}</div>
      <div>Score: {{score}}</div>
    </div>
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
export const health = ref(100);
export const score = ref(0);

const screen_rect = new Rect(0, 0, 640, 480);
const actors = [];
const player = new ScreenActor(screen_rect.midpoint(), null, 20, screen_rect);
actors[0] = [player];
actors[1] = []; // projectiles
actors[2] = []; // enemies
actors[3] = []; // particles

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
  if(update_timer) clearTimeout(update_timer);
  if(spawn_timer) clearTimeout(spawn_timer);
  if(animation_id) cancelAnimationFrame(animation_id);
  game_container.value.removeEventListener('click', canvasClicked);
}

function canvasClicked(event) {
  if(actors[1].length >= 5) return;
  actors[1].push(
    new ScreenActor(
      screen_rect.midpoint(), 
      new Point(0, 0), 
      5, 
      screen_rect
    ).move_to(new Point(event.layerX, event.layerY), 1.5)
  );
}

function update() {
  actors.flat().forEach(actor => actor.update());
  detect_collisons();
  for(let i = 0; i < actors.length; i++) {
    actors[i] = actors[i].filter(actor => {
      return actor.status !== 'dead'
    });
  }
  update_timer = setTimeout(update, 0.1);
}

function detect_collisons() {
  actors[2].forEach( enemy => {
    if( player.location.distance_to(enemy.location) - player.radius - enemy.radius <= 0 ) {
      health.value -= 5;
      enemy.status = 'dead';
    }
    actors[1].forEach( projectile => {
      if( projectile.location.distance_to(enemy.location) - projectile.radius - enemy.radius <= 0 ) {
        make_explosion(projectile.location);
        make_explosion(enemy.location);
        projectile.status = 'dead';
        enemy.status = 'dead';
        score.value += 100;
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, game_canvas.value.width, game_canvas.value.height);
  actors.flat().forEach(actor => actor.draw(ctx));
  animation_id = requestAnimationFrame(draw);
}

function make_explosion(center: Point): void {
  const particle_count = 7;
  const bounds_size = 100;
  const bounds = new Rect(
    center.x - bounds_size/2, 
    center.y - bounds_size/2, 
    bounds_size,
    bounds_size
  );
  for(let i = 0; i < particle_count; i++) {
    actors[3].push(
      new ScreenActor(new Point(center.x, center.y), null, 1, bounds).move_to(
        new Point(
          //bounds.x + Math.random()*bounds.width,
          //bounds.y + Math.random()*bounds.height
          Math.random()*screen_rect.width,
          Math.random()*screen_rect.height
        ),
        0.1
      )
    );
  }
}

function start_spawner(): void {
  let timeout = Math.random()*4000 + 1000;
  spawn_timer = setTimeout(create_enemy, timeout);
}

function create_enemy(): void {
  if(actors[2].length >= 50) return;
  let radius = Math.round(Math.random()*15) + 5
  let speed = Math.random()*0.4 + 0.1;
  actors[2].push(
    new ScreenActor(
      screen_rect.midpoint(), 
      new Point(0,0), 
      radius, 
      screen_rect.grow(radius*4, radius*4)
    ).teleport_to_random_border_location().move_to(player.location, speed)
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
  text-align: left;
  cursor: default;
  position: fixed;
  color: white;
  margin: 0.2rem;
}
</style>
