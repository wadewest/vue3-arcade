import ScreenActor from '../ScreenActor';

export default class Player extends ScreenActor {

  health: number = 25;
  shots_fired: number = 0;
  kills: number = 0;
  private _accuracy: number = 1;
  private _score: number = 0;

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