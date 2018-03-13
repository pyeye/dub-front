<template>
  <div class="cart">
    <div class="title">Корзина</div>
    <transition @enter="enterEl" @leave="leaveEl" :css="false" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { TweenLite, Power4 } from 'gsap';

export default {
  name: 'DubCart',
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

.cart {
    position: relative;
    flex: 1;
    width: 80%;
    margin: 0 auto;
}

.title {
  padding: 24px 0;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin: 24px 0 8px 0;
}

@media (max-width: 1450px) {
   .cart {
    width: 85%;
}

}

</style>
