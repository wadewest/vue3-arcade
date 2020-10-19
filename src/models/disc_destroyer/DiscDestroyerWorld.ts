import GameWorld from '../GameWorld';
import Point from '../Point';
import Rect from '../Rect';
import ScreenActor from '../ScreenActor';
import Player from './Player';
export default class DiscDestroyerWorld extends GameWorld {

  _player: Player;
  spawn_rate: number = 5;

  constructor(p:Player) {
    super();
    this._player = p;
    this.sprites.push([this._player])
    this.sprites.push([]);
    this.sprites.push([]);
    this.sprites.push([]);
  }

  pre_update(): void {
    if(Math.random()*1000 < this.spawn_rate) {
      const radius = Math.floor(Math.random()*15)+5
      this.enemies.push(
        new ScreenActor(
          this.player.location.copy(),
          null,
          radius,
          this.player.bounding_box.grow(radius*4, radius*4)
        )
        .teleport_to_random_border_location()
        .move_to(this.player.location, 10+Math.random()*15)
      );
    }
  }

  post_update(): void {
    this.process_collisions();
    if(this.player.score < 200){
      this.spawn_rate = 5;
    } else if (this.player.score < 500) {
      this.spawn_rate = 7;
    } else if (this.player.score < 900) {
      this.spawn_rate = 10;
    } else {
      this.spawn_rate = 15;
    }
  }

  get player(): Player { return this._player; }
  get projectiles(): ScreenActor[] { return this.sprites[1] }
  get enemies(): ScreenActor[] { return this.sprites[2] }
  get particiles(): ScreenActor[] { return this.sprites[3] }

  fire_projectile_to(location:Point): void {
    this.projectiles.push(
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

  process_collisions(): void {
    this.enemies.forEach(enemy => {
      if(
        (enemy.location.x-this.player.location.x)*(enemy.location.x-this.player.location.x)+
        (enemy.location.y-this.player.location.y)*(enemy.location.y-this.player.location.y)<
        (enemy.radius+this.player.radius)*(enemy.radius+this.player.radius)
      ) {
        enemy.status = 'dead';
        this.player.health -= 1;
        this.make_explosion(enemy.location.copy(), enemy.radius*enemy.radius);
      }
      this.projectiles.forEach(projectile => {
        if(
          (enemy.location.x-projectile.location.x)*(enemy.location.x-projectile.location.x)+
          (enemy.location.y-projectile.location.y)*(enemy.location.y-projectile.location.y)<
          (enemy.radius+projectile.radius)*(enemy.radius+projectile.radius)
        ) {
          enemy.status = 'dead';
          projectile.status = 'dead';
          this.player.kills += 1;
          this.player.score += 5;
          this.make_explosion(enemy.location.copy(), enemy.radius*enemy.radius);
          this.make_explosion(projectile.location.copy(), 25);
        }
      });
    });
  }

  make_explosion(location:Point, particle_count:number = 100) {
    let particle_size = 2;
    for(let i = 0; i < particle_count; i++) {
      const box_size = 100+(Math.floor(Math.random()*100));
      const particle = new ScreenActor(
        location.copy(),
        null,
        particle_size,
        Rect.centered_at(location, box_size, box_size)
      );
      particle.move_to(
        new Point(
          particle.bounding_box.x+(Math.random()*particle.bounding_box.width),
          particle.bounding_box.y+(Math.random()*particle.bounding_box.height),
        ),
        50+(Math.random()*50)
      );
      this.particiles.push(particle);
    }
  }

}