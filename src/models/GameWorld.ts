import Sprite from './Sprite';
import GameWorldState from './GameWorldState';
import Rect from './Rect';
import { GameStatus } from './GameStatus';
import { SpriteStatus } from './SpriteStatus';

export default class GameWorld {

  sprites: Sprite[][] = [];
  last_time: number = 0;
  width: number;
  height: number;
  viewport: Rect;
  private _state: GameWorldState;

  get state(): GameWorldState {
    return this._state;
  }
  set state(new_state:GameWorldState) {
    this._state = new_state;
  }

  get status(): GameStatus {
    return this.state.game_status;
  }

  get world_area():Rect { return new Rect(0, 0, this.width, this.height); }

  constructor(width:number = 640, height:number = 480) {
    this.width = width;
    this.height = height;
    this.viewport = new Rect(0, 0, width, height);
    this._state = new GameWorldState(this);
  }

  update(timestamp:number): void {
    if(this.last_time == 0) {
      this.last_time = timestamp;
      return;
    }
    const current_time = timestamp;
    const delta_time = current_time - this.last_time;
    if(this.state.will_update(delta_time)) {
      this.state.update_sprites(delta_time);
      this.state.detect_collisions(delta_time);
      this.state.sprite_cleanup(delta_time);
      this.state.did_update(delta_time);
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
      this.sprites[i] = this.sprites[i].filter(sprite => sprite.status !== SpriteStatus.Dead);
    }
  }

  draw(ctx:CanvasRenderingContext2D): void {
    this.state.translate_context(ctx);
    if(this.state.will_draw(ctx)) {
      this.state.draw_sprites(ctx);
      this.state.did_draw(ctx);
    }
    this.state.restore_context(ctx);
  }

  translate_context(ctx:CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(-this.viewport.x, -this.viewport.y);
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean { return true; }

  draw_sprites(ctx:CanvasRenderingContext2D): void {
    this.sprites.flat().forEach(sprite => {
      if(sprite.collision_box.intersects(this.viewport)) sprite.draw(ctx);
    });
  }

  did_draw(ctx:CanvasRenderingContext2D): void {}

  restore_context(ctx:CanvasRenderingContext2D): void {
    ctx.restore();
  }

}
