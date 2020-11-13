<template>
  <div ref="game_container" class="game-content mt-1" >
    <div class="game-controls">
      <button class="btn btn-secondary" @click="toggle_pause">{{game_world.is_paused ? "Resume" : "Pause"}}</button>
    </div>
    <div class="game-screen">
      <div class="overlay">
        <div>Health: {{player.health}}</div>
        <div>Score: {{player.score}}</div>
        <div>Accuracy: {{Math.floor(player.accuracy*100)}}%</div>
      </div>
      <canvas ref="game_canvas" />
    </div>
  </div>
</template>

<script lang="ts">
import DiscDestroyerWorld from './DiscDestroyerWorld';
import GameStatePaused from './GameStatePaused';
import Player from './Player';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';
import GameWorldState from '@/models/GameWorldState';

export default {
  setup() {
    const game_container: Ref<HTMLDivElement|null> = ref(null);
    const game_canvas: Ref<HTMLCanvasElement|null> = ref(null);

    const screen_rect = new Rect(0, 0, 640, 480);
    const player = reactive(new Player(screen_rect.midpoint(), screen_rect.copy())) as Player;
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
      ctx.canvas.parentElement?.addEventListener('click', screen_was_clicked);
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
      if(game_world.is_paused) {
        game_world.state.work_complete();
      } else {
        game_world.state = new GameStatePaused(game_world);
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
@import '@/assets/css/styles.scss';
</style>
