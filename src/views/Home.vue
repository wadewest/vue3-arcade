<template>
  <div class="home">
    <router-link :to="{name:'Disc Destroyer'}">Disc Destroyer</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, Ref } from 'vue';

export default {
  name: 'Home',
  components: {
  },
};

</script>

<style scoped lang="scss">
</style>
