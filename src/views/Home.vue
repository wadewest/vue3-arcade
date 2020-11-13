<template>
  <div class="home">
    <h1>A Place to Play Around with Vuejs 3</h1>
    <h2>Games</h2>
    <ul>
      <li v-for="(game, index) in games" :key="index">
        <router-link v-if="!game.meta.hidden" :to="game.path">{{game.name}}</router-link>
        <div v-else class="unpublished">{{game.name}}</div>
      </li>
    </ul>
    <h2>Demos</h2>
    <ul>
      <li v-for="(game, index) in demos" :key="index">
        <router-link v-if="!game.meta.hidden" :to="game.path">{{game.name}}</router-link>
        <div v-else class="unpublished">{{game.name}}</div>
      </li>
    </ul>
    <div>
      <small>Source available at <a href="https://github.com/wadewest/vue3-arcade">https://github.com/wadewest/vue3-arcade</a></small>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { computed } from 'vue';

export default {
  setup() {
    const routes = router.getRoutes();
    const games = computed(() => routes.filter(r => (r as any).meta.category == 'game'));
    const demos = computed(() => routes.filter(r => (r as any).meta.category == 'demo'));
    return {
      games,
      demos,
    }
  }
}

</script>

<style scoped lang="scss">
.unpublished {
  color: darkslategrey;
  text-decoration: line-through;
}
</style>
