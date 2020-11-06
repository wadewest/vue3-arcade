import Color from '@/models/Color';
import IGameWorldState from '@/models/IGameWorldState';
import DiscDestroyerWorld from './DiscDestroyerWorld';

export default class GameStatePaused implements IGameWorldState {

  world: DiscDestroyerWorld;
  old_state: IGameWorldState|null = null;
  fill_color = new Color(127, 127, 127, 0.5);

  constructor(world:DiscDestroyerWorld) {
    this.world = world;
    this.old_state = world.state;
  }

  will_update(delta_time:number): boolean {
    return false;
  }

  did_draw(ctx:CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fill_color.rgba;
    ctx.fillRect(0, 0, this.world.viewport.width, this.world.viewport.height);
  }

}