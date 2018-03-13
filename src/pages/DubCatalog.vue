<template>

  <div class="catalog">
    <transition @enter="enterEl" @leave="leaveEl" :css="false" mode="out-in">
      <router-view :key="$route.params.category" />
    </transition>
  </div>

</template>

<script>
import { TweenLite, Power4 } from 'gsap';

export default {
  name: 'DubCatalog',
  methods: {
    // animations
    enterEl(el, done) {
      TweenLite.from(el, 0.15, {
        autoAlpha: 0,
        onComplete: done,
        ease: Power4.easeOut,
      });
    },
    leaveEl(el, done) {
      TweenLite.to(el, 0.15, {
        autoAlpha: 0,
        onComplete: done,
        ease: Power4.easeOut,
      });
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.catalog {
    position: relative;
    flex: 1;
    width: 100%;
    margin: 0 auto;
}

</style>