<template>
  <div ref="game_container" class="game-content" >
    <div class="overlay">
      <div>Health: {{player.health}}</div>
      <div>Score: {{player.score}}</div>
      <div>Accuracy: {{Math.floor(player.accuracy*100)}}%</div>
    </div>
    <canvas ref="game_canvas" />
  </div>
  <button @click="toggle_pause">{{game_world.is_paused ? "Resume" : "Pause"}}</button>
</template>

<script lang="ts">
import DiscDestroyerWorld from '@/models/disc_destroyer/DiscDestroyerWorld';
import Player from '@/models/disc_destroyer/Player';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';
import GameStatePaused from '@/models/disc_destroyer/GameStatePaused';

export default {
  setup() {
    const game_container: Ref<HTMLDivElement|null> = ref(null);
    const game_canvas: Ref<HTMLCanvasElement|null> = ref(null);

    const screen_rect = new Rect(0, 0, 640, 480);
    const player = reactive(new Player(screen_rect.midpoint(), null, 20, screen_rect.copy())) as Player;
    const game_world = reactive(new DiscDestroyerWorld(player)) as DiscDestroyerWorld;

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
      const ctx = game_canvas.value.getContext('2d') as CanvasRenderingContext2D;
      start_game(ctx);
    }
    onMounted(init_game);

    function start_game(ctx:CanvasRenderingContext2D) {
      game_container.value?.addEventListener('click', screen_was_clicked);
      setInterval(update, 0);
      draw(ctx);
    }

    function update() {
      game_world.update(Math.floor(performance.now())/1000);
    }

    function draw(ctx:CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, screen_rect.width, screen_rect.height);
      game_world.draw(ctx);
      requestAnimationFrame(() => draw(ctx));
    }

    function toggle_pause() {
      if(!game_world.state) {
        game_world.state = new GameStatePaused(game_world);
      } else if(game_world.state.constructor === GameStatePaused) {
        game_world.state = (game_world.state as GameStatePaused).old_state;
      }
    }

    return {
      player,
      game_world,
      game_container,
      game_canvas,
      toggle_pause,
    }
  }
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
  position: absolute;
  color: white;
  margin: 0.2rem;
  z-index: 5;
}
</style>
