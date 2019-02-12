<template>
  <div>
    Hello:
    {{universe}}
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      universe: {}
    };
  },
  async created() {
    this.getUniverse();
  },
  methods: {
    async getUniverse() {
      const response = await api.getUniverse();
      this.universe = response;
    },
  },
}
</script>
