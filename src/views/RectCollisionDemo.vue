<template>
  <button class="btn btn-secondary" @click="new_rectangle">Add Rectangle</button>
  <div ref="game_container" class="game-content mt-1" >
    <canvas width="640" height="480" />
  </div>
</template>

<script lang="ts">

import GameWorld from '@/models/GameWorld';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import Color from '@/models/Color';
import Sprite from '@/models/Sprite';
import ScreenRect from '@/models/ScreenRect';

import { ref, onMounted, Ref } from 'vue';

class RectangleCollisionWorld extends GameWorld {

  selected_rect: ScreenRect|null = null;
  bound_handlers = {
    mousemove: this.handle_mousemove.bind(this),
    mouseup: this.handle_mouseup.bind(this),
    mousedown: this.handle_mousedown.bind(this)
  }

  get rectangles(): ScreenRect[] { return this.sprites[0] as ScreenRect[]; }
  get collisions(): ScreenRect[] { return this.sprites[1] as ScreenRect[]; }

  setup(ctx:RenderingContext): void {
    super.setup(ctx);
    this.sprites.push([]);
    this.sprites.push([]);
    this.sprites.push([]);
    this.rectangles.push(this.create_rectangle(new Point(-150, -120), 200, 200, new Color(0,255,0)));
    this.rectangles.push(this.create_rectangle(new Point(100, 15), 180, 50, new Color(0,0,255)));
    this.sprites[2].push(this.create_rectangle(Point.origin, 1, 1000, new Color(255, 255, 0, 0.5)));
    this.sprites[2].push(this.create_rectangle(Point.origin, 1000, 1, new Color(255, 255, 0, 0.5)));
    this.viewport = new Rect(
      -ctx.canvas.width/2, 
      -ctx.canvas.height/2, 
      ctx.canvas.width,
      ctx.canvas.height,
    );
  }

  create_rectangle(center:Point, width:number, height:number, color:Color = Color.create_random()): ScreenRect {
    const r = new ScreenRect(center.copy(), null, width, height, Rect.null_rect);
    r.fill_color = color;
    r.did_leave_bounding_box = ()=>{};
    return r;
  }

  detect_collisions(dt:number) {
    this.collisions.length = 0;
    for(let i = 0; i < this.rectangles.length-1; i++)
      for(let j = i+1; j < this.rectangles.length; j++) {
        const c_rect = this.rectangles[i].collision_box.intersection(this.rectangles[j].collision_box);
        if(!!c_rect) {
          this.collisions.push(
            this.create_rectangle(c_rect.center, c_rect.width, c_rect.height, new Color(255, 0, 0))
          );
        }
      }
  }

  handle_mousedown(event:MouseEvent) {
    event.preventDefault;
    event.stopPropagation;
    const container = event.target as HTMLElement;
    const location = new Point(
      event.pageX - container.offsetLeft + this.viewport.x,
      event.pageY - container.offsetTop + this.viewport.y
    );
    this.selected_rect = this.get_rect_at(location);
    const doc = this.get_root_node(container);
    doc.addEventListener('mousemove', this.bound_handlers.mousemove);
    doc.addEventListener('mouseup', this.bound_handlers.mouseup);
  }

  handle_mousemove(event:MouseEvent) {
    event.preventDefault;
    event.stopPropagation;
    if(!!this.selected_rect) {
      this.selected_rect.location.x += event.movementX;
      this.selected_rect.location.y += event.movementY;
    } else {
      this.viewport.x -= event.movementX;
      this.viewport.y -= event.movementY;
    }
  }

  handle_mouseup(event:MouseEvent) {
    event.preventDefault;
    event.stopPropagation;
    const container = event.target as HTMLElement;
    this.selected_rect = null;
    const doc = this.get_root_node(container);
    doc.removeEventListener('mousemove', this.bound_handlers.mousemove);
    doc.removeEventListener('mouseup', this.bound_handlers.mouseup);
  }

  get_root_node(el:HTMLElement): HTMLElement {
    if(el.constructor == HTMLDocument) return el;
    return this.get_root_node(el.parentNode as HTMLElement);
  }

  get_rect_at(location:Point): ScreenRect|null {
    for(let i = this.rectangles.length-1; i >= 0; i--) {
      if(this.rectangles[i].collision_box.contains(location)) {
        return this.rectangles[i];
      }
    }
    return null;
  }

}

export default {
  setup() {
    const game_container: Ref<HTMLDivElement|null> = ref(null);

    const game_world = new RectangleCollisionWorld();

    onMounted(()=>{
      if(!game_container.value) return;
      const game_canvas = game_container.value.querySelector('canvas') as HTMLCanvasElement;
      const buffer = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
      buffer.canvas.width = game_canvas.width;
      buffer.canvas.height = game_canvas.height;
      const ctx = game_canvas.getContext('2d') as CanvasRenderingContext2D;
      game_world.setup(ctx);
      game_container.value.addEventListener('mousedown', game_world.bound_handlers.mousedown);
      start_game(ctx, buffer);
    });

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

    function new_rectangle(): void {
      if(!game_world.viewport) return;
      const width = Math.floor(Math.random()*151)+50;
      const height = Math.floor(Math.random()*151)+50;
      const rectangle = game_world.create_rectangle(
        game_world.viewport.center,
        width, height,
        Color.create_random()
      )
      game_world.rectangles.push(rectangle);
    }

    return {
      game_container,
      new_rectangle,
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
