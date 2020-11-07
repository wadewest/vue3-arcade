import Color from '@/models/Color';
import { GameStatus } from '@/models/GameStatus';
import GameWorld from '@/models/GameWorld';
import GameWorldState from '@/models/GameWorldState';

export default class GameStatePaused extends GameWorldState {

  fill_color = new Color(127, 127, 127, 0.5);

  constructor(world:GameWorld) {
    super(world);
    this.status = GameStatus.Paused;
  }

  will_update(delta_time:number): boolean {
    return false;
  }

  did_draw(ctx:CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fill_color.rgba;
    ctx.fillRect(0, 0, this.world.viewport.width, this.world.viewport.height);
  }

}