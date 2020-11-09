import Color from '@/models/Color';
import Point from '@/models/Point';
import ScreenCircle from '@/models/ScreenCircle';
import Player from './Player';

export default class Projectile extends ScreenCircle {

  shooter: Player;

  constructor(shooter:Player, target_location:Point) {
    super(shooter.location.copy(), null, 2, shooter.bounding_box.grow(5, 5));
    this.move_to(target_location, 500);
    shooter.shots_fired += 1;
    this.shooter = shooter;
    this.fill_color = new Color(255, 0, 0);
  }

  did_leave_bounding_box(): void {
    super.did_leave_bounding_box();
    this.shooter.update_accuracy_score()
  };

}
