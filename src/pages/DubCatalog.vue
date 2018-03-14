<template>

  <div class="catalog">
    <transition name="fade" mode="out-in">
      <router-view :key="$route.params.category" />
    </transition>
  </div>

</template>

<script>

export default {
  name: 'DubCatalog',
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


</style>