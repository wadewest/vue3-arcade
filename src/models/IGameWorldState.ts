
export default interface IGameWorldState {
  will_update?(delta_time:number): boolean;
  update_sprites?(delta_time:number): void;
  update_sprites?(delta_time:number): void;
  detect_collisions?(delta_time:number): void;
  sprite_cleanup?(delta_time:number): void;
  did_update?(delta_time:number): void;
};
