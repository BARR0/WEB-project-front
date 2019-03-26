<template>
  <div>
    <GameRender v-if="!this.gameOver" :id="this.player.id" :player="this.universe.player"/>
    <GameOver v-else :score="Math.floor(this.player.radius * 100)"/>
    <div class="row">
      <div class="col">
        <div class="form-inline justify-content-center">
          <div class="form-group mb-2">
            <input class="form-control" v-model="playerName" placeholder="Name">
            <button class="btn btn-primary" v-on:click="restart()">Restart</button>
          </div>
        </div>
        <br/>
        <h2>
          Score:
          {{Math.floor(player.radius * 100)}}
        </h2>
        <h3>
          Player:
          {{player.name}}
        </h3>
      </div>
      <div class="col">
        <h2>
          Current Leader:
          {{this.top_player.name}}
        </h2>
        <h2>
          Max Score:
          {{Math.floor(this.top_player.score * 100)}}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import GameRender from "./GameRender.vue";
import GameOver from "./GameOver.vue";

export default {
  components: {
    GameOver,
    GameRender
  },
  data() {
    return {
      universe: {
        player: {
          "-1": {
            id: -1,
            x: 0,
            y: 0,
            radius: 0
          }
        }
      },
      player: {
        id: -1,
        x: 0,
        y: 0,
        radius: 0
      },
      gameOver: false,
      playerName: "Player",
      restartLoading: true,
    };
  },
  computed: {
    top_player() {
      let max_score = this.player.radius;
      let max_name = this.player.name;
      for (let k in this.universe.player) {
        let p = this.universe.player[k];
        if(p.radius > max_score) {
          max_score = p.radius;
          max_name = p.name;
        }
      }
      return {
        score: max_score,
        name: max_name,
      };
    }
  },
  async created() {
    this.restart();
    setInterval(
      function() {
        if (!this.restartLoading) {
          this.getUniverse();
          this.checkGameOver();
        }
      }.bind(this),
      33
    );

    window.addEventListener("keydown", e => {
      if(!this.gameOver) {
        this.movePlayer(e.keyCode);
      }
    });
  },
  methods: {
    async restart() {
      this.restartLoading = true;
      this.gameOver = false;
      await this.createPlayer(this.playerName);
      await this.getUniverse();
      this.restartLoading = false;
    },
    async checkGameOver() {
      if (this.universe.player[this.player.id] == null) {
        this.gameOver = true;
      } else {
        this.player = this.universe.player[this.player.id];
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
        right: false
      };
      switch (keyCode) {
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
      if (response) {
        this.player = response;
      }
    }
  }
};
</script>
