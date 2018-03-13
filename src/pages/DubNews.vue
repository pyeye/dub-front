<template>
  <transition @enter="enterEl" @leave="leaveEl" :css="false" mode="out-in">
    <router-view/>
  </transition>
</template>

<script>
import { TweenLite, Power4 } from 'gsap';

export default {
  name: 'DubNews',
  data: () => ({
  }),
  methods: {
    // animations
    enterEl(el, done) {
      TweenLite.from(el, 0.2, {
        autoAlpha: 0,
        onComplete: done,
        ease: Power4.easeOut,
      });
    },
    leaveEl(el, done) {
      TweenLite.to(el, 0.1, {
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

</style>
