import Sprite from '@/models/Sprite';
import IGameWorldState from './IGameWorldState';
import Rect from './Rect';

export default class GameWorld {

  sprites: Sprite[][] = [];
  last_time: number = 0;
  width: number;
  height: number;
  viewport: Rect;
  private _state: IGameWorldState|null = null;

  get state(): IGameWorldState|null {
    return this._state;
  }
  set state(new_state:IGameWorldState|null) {
    this._state = new_state;
  }

  get world_area():Rect { return new Rect(0, 0, this.width, this.height); }

  constructor(width:number = 640, height:number = 480) {
    this.width = width;
    this.height = height;
    this.viewport = new Rect(0, 0, width, height);
  }

  update(timestamp:number): void {
    if(this.last_time == 0) {
      this.last_time = timestamp;
      return;
    }
    const current_time = timestamp;
    const delta_time = current_time - this.last_time;
    if(this.call_state_function('will_update', delta_time)) { 
      this.call_state_function('update_sprites', delta_time);
      this.call_state_function('detect_collisions', delta_time);
      this.call_state_function('sprite_cleanup', delta_time);
      this.call_state_function('did_update', delta_time);
    }
    this.last_time = current_time;
  }

  setup(ctx:RenderingContext): void {
    this.viewport.width = ctx.canvas.width;
    this.viewport.height = ctx.canvas.height;
  }

  will_update(delta_time:number): boolean {return true;}
  did_update(delta_time:number): void {}

  update_sprites(delta_time:number): void {
    this.sprites.flat().forEach(sprite => sprite.update(delta_time));
  }

  detect_collisions(delta_time:number): void {}

  sprite_cleanup(delta_time:number): void {
    for(let i = 0; i < this.sprites.length; i++) {
      this.sprites[i] = this.sprites[i].filter(sprite => sprite.status !== 'dead');
    }
  }

  draw(ctx:CanvasRenderingContext2D): void {
    if(this.call_state_function('will_draw', ctx)) {
      this.call_state_function('draw_sprites', ctx);
      this.call_state_function('did_draw', ctx);
    }
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean { return true; }
  draw_sprites(ctx:CanvasRenderingContext2D): void {
    this.sprites.flat().forEach(sprite => {
      if(sprite.collision_box.intersects(this.viewport)) {
        sprite.location.x -= this.viewport.x;
        sprite.location.y -= this.viewport.y;
        sprite.draw(ctx);
        sprite.location.x += this.viewport.x;
        sprite.location.y += this.viewport.y;
      }
    });
  }
  did_draw(ctx:CanvasRenderingContext2D): void {}


  call_state_function(func_name:string, ...args:any[]): boolean|void {
    if(!!this.state && func_name in this.state) {
      // @ts-ignore
      return this.state[func_name](...args);
    } else if(func_name in this) {
      // @ts-ignore
      return this[func_name](...args);
    } else {
      console.log("GameWorld or WorldState doesn't implement "+func_name);
    }
  }


}
