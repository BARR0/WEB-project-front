<template>
  <div>
    <GameRender v-if="!this.gameOver" :id="this.player.id" :player="this.universe.player"/>
    <GameOver v-else :score="Math.floor(this.player.radius * 100)"/>
    <div class="row">
      <div class="col">
        <div class="form-inline justify-content-center">
          <div class="form-group mb-2">
            <input class="form-control" v-model="playerName" placeholder="Name">
            <div class="dropdown">
              <a data-toggle="dropdown" class="dropdown-toggle btn btn-danger" href="#">Skins<b class="caret"></b></a>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a href="#" v-on:click="playerSkin = 1">Skin 1</a></li>
                <li><a href="#" v-on:click="playerSkin = 2">Skin 2</a></li>
              </ul>
            </div>
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
      playerSkin: 1,
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
      await this.createPlayer(this.playerName, this.playerSkin);
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
    async createPlayer(name, skin) {
      const response = await api.createPlayer(name, skin);
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

<style scoped>
body {
    padding-top: 60px;
    padding-bottom: 40px;
}

.sidebar-nav {
    padding: 9px 0;
}

.dropdown-menu .sub-menu {
    left: 100%;
    position: absolute;
    top: 0;
    visibility: hidden;
    margin-top: -1px;
}

.dropdown-menu li:hover .sub-menu {
    visibility: visible;
}

.dropdown:hover .dropdown-menu {
    display: block;
}

.nav-tabs .dropdown-menu, .nav-pills .dropdown-menu, .navbar .dropdown-menu {
    margin-top: 0;
}

.navbar .sub-menu:before {
    border-bottom: 7px solid transparent;
    border-left: none;
    border-right: 7px solid rgba(0, 0, 0, 0.2);
    border-top: 7px solid transparent;
    left: -7px;
    top: 10px;
}
.navbar .sub-menu:after {
    border-top: 6px solid transparent;
    border-left: none;
    border-right: 6px solid #fff;
    border-bottom: 6px solid transparent;
    left: 10px;
    top: 11px;
    left: -6px;
}
</style>