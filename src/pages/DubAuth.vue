<template>
    <div>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
   
</template>

<script>

export default {
  name: 'DubAuth',
  data: () => ({
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
   transition: opacity .15s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
