import GameWorld from '../GameWorld';
import ScreenActor from '../ScreenActor';
export default class DiscDestroyerWorld extends GameWorld {

  player: ScreenActor;

  constructor(p:ScreenActor) {
    super();
    this.player = p;
    this.sprites.push([this.player]);
  }

}