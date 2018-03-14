<template>
  <div class="cart">
    <div class="title">Корзина</div>
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

.title {
  padding: 24px 0;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin: 24px 0 8px 0;
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
