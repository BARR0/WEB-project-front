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
      player: {},
    };
  },
  async created() {
    this.createPlayer('Andres');
    this.getUniverse();
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
  },
}
</script>
