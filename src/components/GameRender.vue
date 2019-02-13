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
      circles: {},
    };
  },
  computed: {
    centered_player() {
      if(!this.player[this.id]) {
        return {};
      }
      let px = -this.player[this.id].x + this.two.width / 2;
      let py = +this.player[this.id].y + this.two.height / 2;
      return Object.keys(this.player).map(key => ({
        id: this.player[key].id,
        x: this.player[key].x + px,
        y: -this.player[key].y + py,
        r: this.player[key].radius * 10,
      }));
    }
  },
  methods: {
    async drawPlayer(p) {
      let circle = this.two.makeCircle(p.x, p.y, p.r);
      if (this.id == p.id) {
        circle.fill = "#FF8000";
      } else {
        circle.fill = "rgba(0, 200, 255, 0.75)";
      }
      this.circles[p.id] = circle;
    },
    async updatePlayer(p) {
      let circle = this.circles[p.id];
      // console.log(circle);
      circle.translation.set(p.x, p.y);
      circle.radius = p.r;
    },
  },
  mounted() {
    // let params = { width: 285, height: 200 };
    this.two = new Two().appendTo(this.$el);

    for (let k in this.centered_player) {
      this.drawPlayer(this.centered_player[k]);
    }

    // let circle = this.two.makeCircle(this.two.width / 2, this.two.height / 2, 50);
    // circle.fill = "#FF8000";
    // circle.translation.set(this.two.width / 2, 0);

    this.two
      .bind("update", () => {
        let newCircles = {};
        for (let k in this.centered_player) {
          if(this.circles[this.centered_player[k].id]) {
            this.updatePlayer(this.centered_player[k]);
          } else {
            this.drawPlayer(this.centered_player[k]);
          }
          newCircles[this.centered_player[k].id] = this.circles[this.centered_player[k].id];
          delete this.circles[this.centered_player[k].id];
        }
        for (let k in this.circles) {
          this.two.remove(this.circles[k]);
        }
        this.circles = newCircles;
      })
      .play();
  }
};
</script>


