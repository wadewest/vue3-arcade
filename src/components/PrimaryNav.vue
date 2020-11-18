<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <div class="container-fluid">
      <!--a class="navbar-brand" href="#">Navbar</a-->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav">
          <NavLink @click="link_clicked" v-for="(link, index) in links" :link="link" :key="index"></NavLink>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import NavLink, { INavLinkInfo } from '@/components/NavLink.vue';

export default defineComponent({
  components: {
    NavLink,
  },
  setup() {
    const links: Ref<INavLinkInfo[]> = ref([
      {href: '/', label: 'Home'},
      {href: '/about', label: 'About'},
    ]);
    function link_clicked(event:MouseEvent): void {
      const link = event.target as HTMLAnchorElement;
      let nav_collapse = link.parentElement as HTMLElement;
      while(!nav_collapse.classList.contains('navbar-collapse')) {
        nav_collapse = nav_collapse.parentElement as HTMLElement;
        if(nav_collapse.nodeName==='BODY') {
          console.log("Didn't find nav element.")
          return;
        }
      }
      nav_collapse.classList.remove('show');
    }
    return{
      links,
      link_clicked,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>