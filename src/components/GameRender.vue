<template>
  <div id="draw-shapes"></div>
</template>

<script>
import Two from "two.js";

export default {
  mounted() {
    let params = { width: 285, height: 200 };
    let two = new Two(params).appendTo(this.$el);

    // two has convenience methods to create shapes.
    let circle = two.makeCircle(72, 100, 50);
    let rect = two.makeRectangle(213, 100, 100, 100);

    // The object returned has many stylable properties:
    circle.fill = "#FF8000";
    circle.stroke = "orangered"; // Accepts all valid css color
    circle.linewidth = 5;

    rect.fill = "rgb(0, 200, 255)";
    rect.opacity = 0.75;
    rect.noStroke();

    // Don't forget to tell two to render everything
    // to the screen
    two.update();
  }
};
</script>


