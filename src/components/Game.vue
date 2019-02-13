<template>
  <div>
    Hello:
    {{universe}}
    <br />
    Player:
    {{player}}
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      universe: {},
      player: {
        id: {}
      },
    };
  },
  async created() {
    this.createPlayer('Andres');
    this.getUniverse();
    window.addEventListener('keydown', (e) => {
      this.movePlayer(e.keyCode);
    });
  },
  methods: {
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
