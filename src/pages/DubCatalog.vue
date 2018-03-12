<template>

  <div class="catalog">
    <router-view></router-view>
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

</style>