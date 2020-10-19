import ScreenActor from '@/models/ScreenActor';

export default class GameWorld {

  sprites: ScreenActor[][] = [];

  before_update: () => boolean = function(){return true;};
  after_update: () => void = function(){};

  before_draw: () => boolean = function(){return true;};
  after_draw: () => void = function(){};

  pre_update(): void {}
  post_update(): void {}

  update(dt:number): void {
    if(!this.before_update()) return;
    this.pre_update();
    this.sprites.flat().forEach(sprite => sprite.update(dt));
    for(let i = 0; i < this.sprites.length; i++) {
      this.sprites[i] = this.sprites[i].filter(sprite => sprite.status !== 'dead');
    }
    this.post_update();
    this.after_update();
  }

  draw(ctx:CanvasRenderingContext2D|null): void {
    if(!this.before_draw()) return;
    this.sprites.flat().forEach(sprite => sprite.draw(ctx));
    this.after_draw();
  }

}