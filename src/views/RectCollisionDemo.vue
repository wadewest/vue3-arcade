<template>
  <div>{{game_world.viewport}}</div>
  <div ref="game_container" class="game-content" >
    <canvas ref="game_canvas" width="640" height="480" />
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

    const rect1 = new ScreenRect(new Point(-150, -120), null, 200, 200, Rect.null_rect);
    rect1.fill_color = new Color(0, 255, 0);
    const rect2 = new ScreenRect(new Point(100, 15), null, 150, 50, Rect.null_rect);
    rect2.fill_color = new Color(0, 0, 255);
    const last_mouse : Point = Point.origin;
    let selected_rect: Sprite|null = null;

    function init_game(): void {
      if(!game_canvas.value || !game_container.value) return;
      game_world.width = 1200;
      game_world.height = 800;
      game_world.viewport = new Rect(
        -game_canvas.value.width/2, 
        -game_canvas.value.height/2, 
        game_canvas.value.width,
        game_canvas.value.height,
      );
      const buffer = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
      buffer.canvas.width = game_canvas.value.width;
      buffer.canvas.height = game_canvas.value.height;
      rect1.did_leave_bounding_box = function(){};
      rect2.did_leave_bounding_box = rect1.did_leave_bounding_box;
      const ctx = game_canvas.value.getContext('2d') as CanvasRenderingContext2D;
      const y_axis = new ScreenRect(Point.origin, null, 1, 1000, Rect.null_rect);
      const x_axis = new ScreenRect(Point.origin, null, 1000, 1, Rect.null_rect);
      y_axis.fill_color = new Color(255, 255, 0, 0.5);
      x_axis.fill_color = y_axis.fill_color;
      y_axis.did_leave_bounding_box = rect1.did_leave_bounding_box;
      x_axis.did_leave_bounding_box = rect1.did_leave_bounding_box;
      game_world.detect_collisions = detect_rect_collision;
      game_world.sprites = [ [rect1, rect2], [], [y_axis, x_axis]];
      game_container.value.addEventListener('mousedown', function(event:MouseEvent){
        if(!game_container.value) return;
        selected_rect = null;
        last_mouse.x = event.pageX - game_container.value.offsetLeft;
        last_mouse.y = event.pageY - game_container.value.offsetTop;
        if(!!game_world.viewport) {
          last_mouse.x += game_world.viewport.x;
          last_mouse.y += game_world.viewport.y;
        }
        const rectangles = game_world.sprites[0];
        for(let i = rectangles.length-1; !selected_rect && i >= 0; i--) {
          if(rectangles[i].collision_box.contains(last_mouse)) {
            selected_rect = rectangles[i];
          }
        }
        if(!!game_world.viewport) {
          last_mouse.x -= game_world.viewport.x;
          last_mouse.y -= game_world.viewport.y;
        }
        game_container.value?.addEventListener('mousemove', move_rect);
      });
      game_container.value.addEventListener('mouseup', function(event:MouseEvent){
        game_container.value?.removeEventListener('mousemove', move_rect);
        selected_rect = null;
      });
      start_game(ctx, buffer);
    }
    onMounted(init_game);

    function move_rect(event:MouseEvent) {
      if(!game_container.value) return;
      const current_mouse = new Point(
        event.pageX - game_container.value.offsetLeft, 
        event.pageY - game_container.value.offsetTop,
      )
      if(!!selected_rect) {
        selected_rect.location.x += current_mouse.x - last_mouse.x;
        selected_rect.location.y += current_mouse.y - last_mouse.y;
      } else {
        if(!!game_world.viewport) {
          game_world.viewport.x -= current_mouse.x - last_mouse.x;
          game_world.viewport.y -= current_mouse.y - last_mouse.y;
        }
      }
      last_mouse.x = current_mouse.x;
      last_mouse.y = current_mouse.y;
    }

    function detect_rect_collision(dt:number) {
      game_world.sprites[1] = [];
      const c_rect = rect1.collision_box.intersection(rect2.collision_box);
      if(!!c_rect) {
        const new_rect = new ScreenRect( c_rect.center, null, c_rect.width, c_rect.height, Rect.null_rect);
        new_rect.fill_color = new Color(255, 0, 0);
        game_world.sprites[1].push(new_rect);
      }
    }

    function start_game(ctx:CanvasRenderingContext2D, buffer:CanvasRenderingContext2D) {
      setInterval(update, 0);
      draw(ctx, buffer);
    }

    function update() {
      game_world.update(Math.floor(performance.now())/1000);
    }

    function draw(ctx:CanvasRenderingContext2D, buffer:CanvasRenderingContext2D) {
      clear_canvas(buffer);
      game_world.draw(buffer);
      clear_canvas(ctx);
      ctx.drawImage(buffer.canvas, 0, 0);
      requestAnimationFrame(() => draw(ctx, buffer));
    }

    function clear_canvas(ctx:CanvasRenderingContext2D): void {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
