import Color from '@/models/Color';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';

export default class Player extends ScreenCircle {

  health: number = 25;
  shots_fired: number = 0;
  kills: number = 0;
  private _accuracy: number = 1;
  private _score: number = 0;

  constructor(location:Point, bounding_box:Rect) {
    super(location, null, 20, bounding_box);
    this.fill_color = new Color(255, 255, 0, 1);
  }

  get accuracy(): number { return this._accuracy; }
  update_accuracy_score(): void {
    this._accuracy = this.kills/this.shots_fired;
  }

  get score(): number { return this._score; }
  set score(new_score:number) {
    this.update_accuracy_score();
    this._score = new_score;
  }

}
