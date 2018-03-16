<template>
  <div class="cart">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'DubCart',
  data: () => ({
  }),
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

.fade-enter-active, .fade-leave-active {
    transition: opacity .15s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


@media (max-width: 1450px) {
   .cart {
    width: 85%;
}

}

</style>
