
export default interface IGameWorldState {

  // functions to override updates
  will_update?(delta_time:number): boolean;
  update_sprites?(delta_time:number): void;
  detect_collisions?(delta_time:number): void;
  sprite_cleanup?(delta_time:number): void;
  did_update?(delta_time:number): void;

  // functions to overrided drawing
  will_draw?(ctx:CanvasRenderingContext2D): boolean;
  draw_sprites?(ctx:CanvasRenderingContext2D): void;
  did_draw?(ctx:CanvasRenderingContext2D): void;

};
