<template>
<div class="news">
<transition name="fade" mode="out-in">
    <router-view :key="$route.path"/>
  </transition>
</div>
</template>

<script>

export default {
  name: 'DubNews',
  data: () => ({
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.news {
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
