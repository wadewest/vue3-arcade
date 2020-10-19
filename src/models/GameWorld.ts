import ScreenActor from '@/models/ScreenActor';

export default class GameWorld {

  sprites: ScreenActor[][] = [];

  on_before_draw: () => boolean = function(){return true;};
  on_after_draw: () => void = function(){};

  draw(ctx:CanvasRenderingContext2D|null): void {
    if(!this.on_before_draw()) return;
    this.sprites.flat().forEach(sprite => sprite.draw(ctx));
    this.on_after_draw();
  }

}