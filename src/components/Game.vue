<template>
  <div>
    <div v-if="!this.gameOver">
      <GameRender :id="this.player.id" :player="this.universe.player" />
      Hello:
      {{universe}}
      <br />
      Player:
      {{player}}
      <br />
      Game Over:
      {{gameOver}}
    </div>
    <GameOver v-else />
  </div>
</template>

<script>
import api from '@/api';
import GameRender from './GameRender.vue'
import GameOver from './GameOver.vue'

export default {
  components: {
    GameOver,
    GameRender,
  },
  data() {
    return {
      universe: {
        player: {
          '-1': {
            id: -1,
            x: 0,
            y: 0,
          }
        },
      },
      player: {
        id: -1
      },
      gameOver: false,
    };
  },
  async created() {
    this.createPlayer('Andres');

    this.getUniverse();
    setInterval(function () {
      this.getUniverse();
      this.checkGameOver();
    }.bind(this), 16);

    window.addEventListener('keydown', (e) => {
      this.movePlayer(e.keyCode);
    });
  },
  methods: {
    async checkGameOver() {
      if(this.universe.player[this.player.id] == null) {
        this.gameOver = true;
      }
    },
    async getUniverse() {
      const response = await api.getUniverse();
      this.universe = response;
    },
    async createPlayer(name) {
      const response = await api.createPlayer(name);
      this.player = response;
    },
    async movePlayer(keyCode) {
      let moves = {
        up: false,
        down: false,
        left: false,
        right: false,
      }
      switch(keyCode) {
        case 37:
          moves.left = true;
          break;
        case 38:
          moves.up = true;
          break;
        case 39:
          moves.right = true;
          break;
        case 40:
          moves.down = true;
          break;
        default:
          return;
      }
      const response = await api.putPlayer(this.player.id, moves);
      this.player = response;
    },
  },
}
</script>
