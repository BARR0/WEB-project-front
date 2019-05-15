<template>
  <div></div>
</template>

<script>
import Two from "two.js";
import { setTimeout } from 'timers';
import beepSound from '../assets/beep.wav'

export default {
  props: {
    player: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      required: true
    },
    emoteq: {
      type: Array
    }
  },
  data() {
    return {
      circles: {},
      bg: null,
      squiggles: [],
      beepaudio: new Audio(beepSound),
    };
  },
  computed: {
    centered_player() {
      if (!this.player[this.id]) {
        return {};
      }
      let px = -this.player[this.id].x * 10 + this.two.width / 2;
      let py = +this.player[this.id].y * 10 + this.two.height / 2;
      return Object.keys(this.player).map(key => ({
        id: this.player[key].id,
        x: (this.player[key].x * 10 + px) * 1,
        y: (-this.player[key].y * 10 + py) * 1,
        r: this.player[key].radius * 10,
        name: this.player[key].name,
        skin: this.player[key].skin
      }));
    }
  },
  methods: {
    centerBG() {
      if (this.player[this.id]) {
        let px = -this.player[this.id].x * 10 + this.two.width / 2;
        let py = +this.player[this.id].y * 10 + this.two.height / 2;
        this.bg.translation.set(px, py);
        this.bg.radius = this.radius * 10;
      }
    },
    async playEmotes() {
      while (this.emoteq.length > 0) {
        let id = this.emoteq.pop();
        this.playEmote(id);
      }
      this.squiggles.forEach((s) => {
        s.rotation += s.step;
      });
    },
    async playEmote(id) {
      this.beepaudio.play();
      let px = -this.player[this.id].x * 10 + this.two.width / 2;
      let py = +this.player[this.id].y * 10 + this.two.height / 2;
      let squiggle = this.two.makeStar(this.player[id].x * 10 + px + 20, -this.player[id].y * 10 + py - 20, 15, 30, 5);
      let color = 'rgb(0, 191, 168)';
      // squiggle.translation.set(this.two.width / 2, this.two.height / 2);
      squiggle.noStroke();
      squiggle.fill = color;
      squiggle.step = (Math.floor(0.5 * 8) / 8) * Math.PI / 60;
      let i = this.squiggles.length;
      this.squiggles.push(squiggle);
      setTimeout(() => {
        this.two.remove(squiggle);
        delete this.squiggles[i];
      }, 2000);
    },
    async drawPlayer(p) {
      let circle = this.two.makeCircle(p.x, p.y, p.r);
      // if (this.id == p.id) {
      //   circle.fill = "#FF8000";
      // } else {
      //   let texture = new Two.Texture(this.getSpriteName(p.skin))
      //   circle.fill = texture;
      // }
      let texture = new Two.Texture(this.getSpriteName(p.skin));
      texture.scale = 0.9;
      circle.fill = texture;
      circle.text = this.two.makeText(p.name, p.x, p.y + p.r);
      this.circles[p.id] = circle;
    },
    getSpriteName(num) {
      if (num == 1) {
        return "https://i.imgur.com/VY49ncB.jpg";
        //return `./skin${num}.jpg`
      }
      if (num == 2) {
        return "https://i.imgur.com/DRmh6S9.jpg";
        //return `./skin${num}.jpg`
      }
      return "https://i.imgur.com/DCZ4inB.jpg";
    },
    async updatePlayer(p) {
      let circle = this.circles[p.id];
      circle.translation.set(p.x, p.y);
      circle.radius = p.r;
      circle.text.translation.set(p.x, p.y + p.r + 10);
    }
  },
  mounted() {
    // let params = { width: 285, height: 200 };
    this.two = new Two({
      fullscreen: true
    }).appendTo(this.$el);

    // this.two.prototype.makeSquiggle = this.makeSquiggle;

    let bgvoid = this.two.makeCircle(0, 0, 999999999);
    bgvoid.fill = "#000000";

    let bgimg =
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce56e4a-99f6-4328-bec6-49efa78b3c78/d3a6a7c-1c5f1b91-5d5e-42f8-baa6-4d94f1f0fc53.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzVjZTU2ZTRhLTk5ZjYtNDMyOC1iZWM2LTQ5ZWZhNzhiM2M3OFwvZDNhNmE3Yy0xYzVmMWI5MS01ZDVlLTQyZjgtYmFhNi00ZDk0ZjFmMGZjNTMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rJSNbt0e_P6HnAKr1bj2ACjfYGRc1-h01_bTuWBYhcs";
    this.bg = this.two.makeCircle(0, 0, this.radius * 10);
    let texture = new Two.Texture(bgimg);
    // texture.scale = .9;
    this.bg.fill = texture;

    for (let k in this.centered_player) {
      this.drawPlayer(this.centered_player[k]);
    }

    // let prevradius = -1;
    // let beepaudio = new Audio(beepSound);
    // beepaudio.volume = 0.1;

    this.two
      .bind("update", () => {
        this.centerBG();
        let newCircles = {};
        for (let k in this.centered_player) {
          if (this.circles[this.centered_player[k].id]) {
            this.updatePlayer(this.centered_player[k]);
          } else {
            this.drawPlayer(this.centered_player[k]);
          }
          newCircles[this.centered_player[k].id] = this.circles[
            this.centered_player[k].id
          ];
          delete this.circles[this.centered_player[k].id];
        }
        for (let k in this.circles) {
          this.two.remove(this.circles[k].text);
          this.two.remove(this.circles[k]);
        }
        this.circles = newCircles;

        this.playEmotes();
        // if(prevradius < this.player[this.id].radius) {
        //   beepaudio.play();
        // }
        // prevradius = this.player[this.id].radius;
      })
      .play();
  }
};
</script>


