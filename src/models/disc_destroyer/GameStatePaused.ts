import GameWorld from '../GameWorld';
import IGameWorldState from '../IGameWorldState';
import DiscDestroyerWorld from './DiscDestroyerWorld';

export default class GameStatePaused implements IGameWorldState {

  world: DiscDestroyerWorld;
  old_state: IGameWorldState|null = null;
  elapsed_time: number = 0;
  wait_time: number = 5;

  constructor(world:DiscDestroyerWorld) {
    this.world = world;
    this.old_state = world.state;
  }

  will_update(delta_time:number): boolean {
    return false;
  }

}