<template>
  <div ref="game_container" class="game-content" >
    <canvas ref="game_canvas" />
  </div>
</template>

<script lang="ts">

import GameWorld from '@/models/GameWorld';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenRect from '@/models/ScreenRect';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';
import Color from '@/models/Color';

export default {
  setup() {
    const game_container: Ref<HTMLDivElement|null> = ref(null);
    const game_canvas: Ref<HTMLCanvasElement|null> = ref(null);

    const game_world = reactive(new GameWorld()) as GameWorld;
    const screen_rect = new Rect(0, 0, 640, 480);

    const rect1 = new ScreenRect(new Point(250, 200), null, 200, 200, screen_rect);
    rect1.fill_color = new Color(0, 255, 0);
    const rect2 = new ScreenRect(new Point(340, 400), null, 150, 50, screen_rect);
    rect2.fill_color = new Color(0, 0, 255);

    function init_game(): void {
      if(!game_canvas.value || !game_container.value) return;
      game_canvas.value.width = screen_rect.width;
      game_canvas.value.height = screen_rect.height;
      const ctx = game_canvas.value.getContext('2d') as CanvasRenderingContext2D;

      game_world.detect_collisions = detect_rect_collision;
      game_world.sprites = [ [rect1, rect2], [] ];
      

      start_game(ctx);
    }
    onMounted(init_game);

    function move_rect(event:MouseEvent) {
      if(!game_container.value) return;
      rect2.location = new Point(
        event.pageX - game_container.value.offsetLeft, 
        event.pageY - game_container.value.offsetTop,
      );
      rect2.collision_box.center = rect2.location;
    }

    function detect_rect_collision(dt:number) {
      game_world.sprites[1] = [];
      const c_rect = rect1.collision_box.intersection(rect2.collision_box);
      if(!!c_rect) {
        const new_rect = new ScreenRect(c_rect.midpoint(), null, c_rect.width, c_rect.height, screen_rect);
        new_rect.fill_color = new Color(255, 0, 0);
        game_world.sprites[1].push(new_rect);
      }
    }

    function start_game(ctx:CanvasRenderingContext2D) {
      game_container.value?.addEventListener('mousemove', move_rect);
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

    return {
      game_world,
      game_container,
      game_canvas,
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

</style>
