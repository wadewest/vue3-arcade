<template>
  <li class="nav-item">
    <router-link class="nav-link" :to="$props.link.href">{{$props.link.label}}</router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface INavLinkInfo {
  href: string;
  label: string;
};

export default defineComponent({
  props: {
    link: {
      type: Object as PropType<INavLinkInfo>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/styles.scss";

.nav-item .nav-link.router-link-active[aria-current="page"] {
  color: $primary;
}

</style>