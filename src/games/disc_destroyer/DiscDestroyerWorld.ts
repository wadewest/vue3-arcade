import GameWorld from '@/models/GameWorld';
import Point from '@/models/Point';
import { GameStatus } from '@/models/GameStatus';
import { SpriteStatus } from '@/models/SpriteStatus';
import GameStatePaused from './GameStatePaused';
import Player from './Player';
import Enemy from './Enemy';
import Projectile from './Projectile';
import Explosion from './Explosion';

export default class DiscDestroyerWorld extends GameWorld {

  _player: Player;
  spawn_rate: number = 0;

  constructor(p:Player) {
    super();
    this._player = p;
    this.sprites.push([this._player])
    this.sprites.push([]);
    this.sprites.push([]);
    this.sprites.push([]);
  }

  get player(): Player { return this._player; }
  get projectiles(): Projectile[] { return this.sprites[1] as Projectile[]; }
  get enemies(): Enemy[] { return this.sprites[2] as Enemy[]; }
  get explosions(): Explosion[] { return this.sprites[3] as Explosion[]; }

  get is_paused(): boolean {
    return this.status == GameStatus.Paused
  }

  will_update(delta_time:number): boolean {
    if(Math.random()*1000 < this.spawn_rate) {
      const radius = Math.floor(Math.random()*15)+5
      this.enemies.push(new Enemy(this.viewport));
    }
    return true;
  }

  did_update(): void {
    if(this.player.score < 200){
      this.spawn_rate = 2;
    } else if (this.player.score < 500) {
      this.spawn_rate = 3;
    } else if (this.player.score < 900) {
      this.spawn_rate = 5;
    } else {
      this.spawn_rate = 8;
    }
    if(this.player.health <= 0) {
      this.player.health = 0;
      this.state = new GameStatePaused(this);
    }
  }

  fire_projectile_to(location:Point): void {
    if(this.is_paused || this.projectiles.length >= 3) return;
    this.projectiles.push(new Projectile(this.player, location));
  }

  detect_collisions(delta_time:number): void {
    this.enemies.forEach(enemy => {
      if(enemy.location.compare_distance(this.player.location, enemy.radius+this.player.radius) <= 0) {
        enemy.kill();
        this.player.health -= 1;
      }
      this.projectiles.forEach(projectile => {
        if(enemy.location.compare_distance(projectile.location, enemy.radius+projectile.radius) <= 0) {
          enemy.take_damage();
          this.player.hits += 1;
          this.player.update_accuracy_score();
          projectile.kill();
          this.explosions.push(new Explosion(projectile, 1, 25));
        }
      });
    });
  }

  sprite_cleanup(delta_time:number): void {
    this.enemies.forEach(enemy => {
      if(enemy.status === SpriteStatus.Dead) {
        if(enemy.health <= 0) {
          this.player.score += Math.round(10*this.player.accuracy);
        }
        this.explosions.push(new Explosion(enemy, 3, 75));
      }
    })
    super.sprite_cleanup(delta_time);
  }

}
