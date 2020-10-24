import ScreenActor from '@/models/ScreenActor';
import IGameWorldState from './IGameWorldState';

export default class GameWorld {

  sprites: ScreenActor[][] = [];
  last_time: number = 0;
  private _state: IGameWorldState|null = null;

  get state(): IGameWorldState|null {
    return this._state;
  }
  set state(new_state:IGameWorldState|null) {
    this._state = new_state;
  }

  before_draw: () => boolean = function(){return true;};
  after_draw: () => void = function(){};

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

  call_state_function(func_name:string, ...args:any[]): boolean|void {
    if(!!this.state && func_name in this.state) {
      // @ts-ignore
      return this.state[func_name](...args);
    } else {
      // @ts-ignore
      return this[func_name](...args);
    }
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

  draw(ctx:CanvasRenderingContext2D|null): void {
    if(!this.before_draw()) return;
    this.sprites.flat().forEach(sprite => sprite.draw(ctx));
    this.after_draw();
  }

}