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
  computed: {
    centered_player() {
      let px = -this.player[this.id].x + this.two.width / 2;
      let py = -this.player[this.id].y + this.two.height / 2;
      return Object.keys(this.player).map(key => ({
        id: this.player[key].id,
        x: this.player[key].x + px,
        y: this.player[key].y - py,
        r: this.player[key].radius
      }));
      // return this.player.map(p => ({
      //   id: p.id,
      //   x: p.x - px,
      //   y: p.y - py,
      //   r: p.radius
      // }));
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
    }
  },
  mounted() {
    // let params = { width: 285, height: 200 };
    this.two = new Two().appendTo(this.$el);

    for (let k in this.centered_player) {
      this.drawPlayer(this.centered_player[k]);
    }
    // var circle = this.two.makeCircle(this.two.width / 2, this.two.height / 2, 50);
    // circle.fill = "#FF8000";

    // group.translation.set(this.two.width / 2, this.two.height / 2);
    this.two.play(); // Finally, start the animation loop
  }
};
</script>


