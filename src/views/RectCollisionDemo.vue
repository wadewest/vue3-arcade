<template>
  <div ref="game_container" class="game-content" >
    <canvas ref="game_canvas" />
  </div>
</template>

<script lang="ts">

import GameWorld from '@/models/GameWorld';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import Color from '@/models/Color';
import Sprite from '@/models/Sprite';
import ScreenRect from '@/models/ScreenRect';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';

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
    const last_mouse : Point = Point.origin;
    let selected_rect: Sprite|null = null;

    function init_game(): void {
      if(!game_canvas.value || !game_container.value) return;
      game_canvas.value.width = screen_rect.width;
      game_canvas.value.height = screen_rect.height;
      const ctx = game_canvas.value.getContext('2d') as CanvasRenderingContext2D;
      game_world.detect_collisions = detect_rect_collision;
      game_world.sprites = [ [rect1, rect2], [] ];
      game_container.value.addEventListener('mousedown', function(event:MouseEvent){
        if(!game_container.value) return;
        selected_rect = null;
        last_mouse.x = event.pageX - game_container.value.offsetLeft;
        last_mouse.y = event.pageY - game_container.value.offsetTop;
        const rectangles = game_world.sprites[0];
        for(let i = rectangles.length-1; !selected_rect && i >= 0; i--) {
          if(rectangles[i].collision_box.contains(last_mouse)) {
            selected_rect = rectangles[i];
            game_container.value?.addEventListener('mousemove', move_rect);
          }
        }
      });
      game_container.value.addEventListener('mouseup', function(event:MouseEvent){
        game_container.value?.removeEventListener('mousemove', move_rect);
        selected_rect = null;
      });
      start_game(ctx);
    }
    onMounted(init_game);

    function move_rect(event:MouseEvent) {
      if(!game_container.value) return;
      if(!selected_rect) return;
      const current_mouse = new Point(
        event.pageX - game_container.value.offsetLeft, 
        event.pageY - game_container.value.offsetTop,
      )
      selected_rect.location.x += current_mouse.x - last_mouse.x;
      selected_rect.location.y += current_mouse.y - last_mouse.y;
      selected_rect.collision_box.center = selected_rect.location;
      last_mouse.x = current_mouse.x;
      last_mouse.y = current_mouse.y;
    }

    function detect_rect_collision(dt:number) {
      game_world.sprites[1] = [];
      const c_rect = rect1.collision_box.intersection(rect2.collision_box);
      if(!!c_rect) {
        const new_rect = new ScreenRect(c_rect.center, null, c_rect.width, c_rect.height, screen_rect);
        new_rect.fill_color = new Color(255, 0, 0);
        game_world.sprites[1].push(new_rect);
      }
    }

    function start_game(ctx:CanvasRenderingContext2D) {
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
