<template>
  <PrimaryNav />
  <div class="container-md">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PrimaryNav from '@/components/PrimaryNav.vue';

export default defineComponent({
  components: {
    PrimaryNav,
  }
})
</script>

<style lang="scss">
@import "@/assets/css/styles.scss";
</style>
