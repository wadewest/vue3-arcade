import { GameStatus } from './GameStatus';
import GameWorld from './GameWorld';

export default class GameWorldState {

  world: GameWorld;
  protected status: GameStatus = GameStatus.Running;

  constructor(world:GameWorld) {
    this.world = world;
  }

  get game_status(): GameStatus {
    return this.status;
  }

  work_complete(): void {}

  will_update(delta_time:number): boolean {
    return this.world.will_update.call(this.world, delta_time);
  }

  update_sprites(delta_time:number): void {
    this.world.update_sprites.call(this.world, delta_time);
  }

  detect_collisions(delta_time:number): void {
    this.world.detect_collisions.call(this.world, delta_time);
  }

  sprite_cleanup(delta_time:number): void {
    this.world.sprite_cleanup.call(this.world, delta_time);
  }

  did_update(delta_time:number): void {
    this.world.did_update.call(this.world, delta_time);
  }

  translate_context(ctx:CanvasRenderingContext2D): void {
    this.world.translate_context.call(this.world, ctx);
  }

  will_draw(ctx:CanvasRenderingContext2D): boolean {
    return this.world.will_draw.call(this.world, ctx);
  }

  draw_sprites(ctx:CanvasRenderingContext2D): void {
    this.world.draw_sprites.call(this.world, ctx);
  }

  did_draw(ctx:CanvasRenderingContext2D): void {
    this.world.did_draw.call(this.world, ctx);
  }

  restore_context(ctx:CanvasRenderingContext2D): void {
    this.world.restore_context.call(this.world, ctx);
  }

}