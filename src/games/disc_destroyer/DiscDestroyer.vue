<template>
  <div ref="game_container" class="game-content mt-1" >
    <div class="game-controls">
      <button class="btn btn-secondary" @click="toggle_pause">{{game_world.is_paused ? "Resume" : "Pause"}}</button>
    </div>
    <div class="game-screen">
      <div class="overlay">
        <div>Health: {{player.health}}</div>
        <div>Score: {{player.score}}</div>
        <div>Accuracy: {{Math.floor(player.accuracy*100)}}%</div>
      </div>
      <canvas ref="game_canvas" />
    </div>
    <div ref="game_start_modal" class="game-modal">
      <div class="modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Disc Destroyer</h5>
            </div>
            <div class="modal-body">
              <p>Welcome to <em>Disc Destroyer</em>.  This game is still a work in progress. Continue at your own risk.</p>
              <p><a href="https://github.com/wadewest/vue3-arcade/issues">Report Bugs</a></p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="start_game">Start Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="game_over_modal" class="game-modal">
      <div class="modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Game Over</h5>
            </div>
            <div class="modal-body">
              <h2>Your Score: {{game_world.player.score}}</h2>
              <p>Would you like to play again?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="start_game">New Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//import { Modal } from 'bootstrap';
import DiscDestroyerWorld from './DiscDestroyerWorld';
import GameStatePaused from './GameStatePaused';
import Player from './Player';
import Point from '@/models/Point';
import Rect from '@/models/Rect';
import ScreenCircle from '@/models/ScreenCircle';

import { ref, watch, onMounted, onBeforeUnmount, Ref, reactive } from 'vue';
import GameWorldState from '@/models/GameWorldState';
import { GameStatus } from '@/models/GameStatus';

class Modal {

  modal_element: HTMLElement;

  constructor(modal_element:HTMLElement, options:any) {
    this.modal_element = modal_element;
  }

  show() {
    this.modal_element.dataset.modalShow = '';
  }

  hide() {
    delete this.modal_element.dataset.modalShow;
  }

}

export default {
  setup() {
    const game_container: Ref<HTMLDivElement|null> = ref(null);
    const game_canvas: Ref<HTMLCanvasElement|null> = ref(null);
    const game_start_modal: Ref<HTMLDivElement|null> = ref(null);
    const game_over_modal: Ref<HTMLDivElement|null> = ref(null);

    const screen_rect = new Rect(0, 0, 640, 480);
    const player = reactive(new Player(screen_rect.midpoint(), screen_rect.copy())) as Player;
    const game_world = reactive(new DiscDestroyerWorld(player)) as DiscDestroyerWorld;

    const game_starting_state = new GameWorldState(game_world, GameStatus.Starting);
    game_starting_state.will_update = () => false;
    game_starting_state.will_draw = () => false;

    const game_over_state = new GameWorldState(game_world, GameStatus.GameOver);


    const modals = {
      start_game: <Modal|null>null,
      game_over: <Modal|null>null,
    };

    function screen_was_clicked(event:MouseEvent): void {
      if(!game_canvas.value) return;
      const offset = total_offset(game_canvas.value);
      game_world.fire_projectile_to(new Point(
        event.pageX - offset.x,
        event.pageY - offset.y
      ));
    }

    function total_offset(element:HTMLElement): Point {
      const offset = new Point(0,0);
      let el = element;
      do {
        offset.x += el.offsetLeft;
        offset.y += el.offsetTop;
        if(!el.offsetParent) return offset;
        el = el.offsetParent as HTMLElement;
      } while(true);
    }

    function init_game(): void {
      if(!(game_canvas.value && game_container.value)) return;
      modals.start_game = new Modal(game_start_modal.value as HTMLDivElement, {backdrop: 'static'});
      modals.game_over = new Modal(game_over_modal.value as HTMLDivElement, {backdrop: 'static'});
      game_canvas.value.width = screen_rect.width;
      game_canvas.value.height = screen_rect.height;
      game_world.state = game_starting_state;
      const ctx = game_canvas.value.getContext('2d') as CanvasRenderingContext2D;
      game_world.setup(ctx);
      ctx.canvas.parentElement?.addEventListener('click', screen_was_clicked);
      setInterval(update, 0);
      draw(ctx);
    }
    onMounted(init_game);

    function start_game() {
      game_world.reset();
      game_world.state = new GameWorldState(game_world);
    }

    function update() {
      game_world.update(Math.floor(performance.now())/1000);
    }

    function draw(ctx:CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, screen_rect.width, screen_rect.height);
      game_world.draw(ctx);
      requestAnimationFrame(() => draw(ctx));
    }

    function toggle_pause() {
      if(game_world.is_paused) {
        game_world.state.work_complete();
      } else {
        game_world.state = new GameStatePaused(game_world);
      }
    }

    watch( () => game_world.state, (new_state, old_state) => {
      modals.start_game?.hide();
      modals.game_over?.hide();
      switch(game_world.status) {
        case GameStatus.Starting:
          modals.start_game?.show();
          break;
        case GameStatus.GameOver:
          modals.game_over?.show();
          break;
      }
    });

    watch( () => game_world.player.health, (new_health, old_health) => {
      if(new_health <= 0) game_world.state = game_over_state;
    });

    return {
      player,
      game_world,
      game_container,
      game_canvas,
      game_start_modal,
      game_over_modal,
      start_game,
      toggle_pause,
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/css/styles.scss';

.game-content {

  position: relative;
  padding: 10px;

  .game-modal {
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms ease-in;
    position: absolute;
    z-index: -10001;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border: 4px solid rgba(0, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    border-radius: 15px;
    display: grid;
    grid-template-columns: auto max-content auto;
    grid-template-rows: auto max-content auto;
    grid-template-areas: 
      ". . ."
      ". modal ."
      ". . .";

    .modal {
      margin: 0;
      position: static;
      display: block;
      grid-area: modal;

      .modal-dialog {
        margin: 0;
      }

    }

    &[data-modal-show] {
      opacity: 1;
      pointer-events: auto;
      z-index: 10001;
    }

  }

}


</style>
