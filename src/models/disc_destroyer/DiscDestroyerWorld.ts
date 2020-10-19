import GameWorld from '../GameWorld';
import Point from '../Point';
import ScreenActor from '../ScreenActor';
import Player from './Player';
export default class DiscDestroyerWorld extends GameWorld {

  player: Player;

  constructor(p:Player) {
    super();
    this.player = p;
    this.sprites.push([this.player])
    this.sprites.push([]);
    this.sprites.push([]);
    this.sprites.push([]);
  }

  projectiles(): ScreenActor[] {
    return this.sprites[1]
  }

  fire_projectile_to(location:Point): void {
    this.projectiles().push(
      new ScreenActor(
        this.player.location.copy(),
        null,
        3,
        this.player.bounding_box.grow(5, 5)
      )
      .move_to(location, 500)
    );
    this.player.shots_fired += 1;
  }

}