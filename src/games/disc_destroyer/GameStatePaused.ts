import Color from '@/models/Color';
import { GameStatus } from '@/models/GameStatus';
import GameWorld from '@/models/GameWorld';
import GameWorldState from '@/models/GameWorldState';

export default class GameStatePaused extends GameWorldState {

  old_state: GameWorldState;
  fill_color = new Color(127, 127, 127, 0.5);

  constructor(world:GameWorld) {
    super(world);
    this.old_state = world.state;
    this.status = GameStatus.Paused;
  }

  work_complete(): void {
    this.world.state = this.old_state;
  }

  will_update(delta_time:number): boolean {
    return false;
  }

  did_draw(ctx:CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fill_color.rgba;
    ctx.fillRect(0, 0, this.world.viewport.width, this.world.viewport.height);
  }

}