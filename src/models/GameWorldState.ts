import { GameStatus } from './GameStatus';
import GameWorld from './GameWorld';

export default class GameWorldState {

  world: GameWorld;
  protected status: GameStatus;

  constructor(world:GameWorld, status:GameStatus = GameStatus.Running) {
    this.world = world;
    this.status = status;
  }

  get game_status(): GameStatus {
    return this.status;
  }

  work_complete(): void {}

  will_update(delta_time:number): boolean {
    return this.world.will_update(delta_time);
  }

  update_sprites(delta_time:number): void {
    this.world.update_sprites(delta_time);
  }

  detect_collisions(delta_time:number): void {
    this.world.detect_collisions(delta_time);
  }

  sprite_cleanup(delta_time:number): void {
    this.world.sprite_cleanup(delta_time);
  }

  did_update(delta_time:number): void {
    this.world.did_update(delta_time);
  }

  translate_context(ctx:CanvasRenderingContext2D): void {
    this.world.translate_context(ctx);
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean {
    return this.world.will_draw(ctx);
  }

  draw_sprites(ctx:CanvasRenderingContext2D): void {
    this.world.draw_sprites(ctx);
  }

  did_draw(ctx:CanvasRenderingContext2D): void {
    this.world.did_draw(ctx);
  }

  restore_context(ctx:CanvasRenderingContext2D): void {
    this.world.restore_context(ctx);
  }

}