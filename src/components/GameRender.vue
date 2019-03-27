<template>
  <div></div>
</template>

<script>
import Two from "two.js";

export default {
  props: {
    player: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      circles: {}
    };
  },
  computed: {
    centered_player() {
      if (!this.player[this.id]) {
        return {};
      }
      let px = -this.player[this.id].x + this.two.width / 2;
      let py = +this.player[this.id].y + this.two.height / 2;
      return Object.keys(this.player).map(key => ({
        id: this.player[key].id,
        x: this.player[key].x + px,
        y: -this.player[key].y + py,
        r: this.player[key].radius * 10,
        name: this.player[key].name,
        skin: this.player[key].skin,
      }));
    }
  },
  methods: {
    async drawPlayer(p) {
      let circle = this.two.makeCircle(p.x, p.y, p.r);
      // if (this.id == p.id) {
      //   circle.fill = "#FF8000";
      // } else {
      //   let texture = new Two.Texture(this.getSpriteName(p.skin))
      //   circle.fill = texture;
      // }
      let texture = new Two.Texture(this.getSpriteName(p.skin))
      texture.scale = .9;
      circle.fill = texture; 
      circle.text = this.two.makeText(p.name, p.x, p.y + p.r);
      this.circles[p.id] = circle;
    },
    getSpriteName(num){
      if(num == 1){
        return 'https://i.imgur.com/VY49ncB.jpg'
        //return `./skin${num}.jpg`
      }
       if(num == 2){
        return 'https://i.imgur.com/DRmh6S9.jpg'
        //return `./skin${num}.jpg`
      }
      return 'https://i.imgur.com/DCZ4inB.jpg'
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

    for (let k in this.centered_player) {
      this.drawPlayer(this.centered_player[k]);
    }

    this.two
      .bind("update", () => {
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
      })
      .play();
  }
};
</script>


