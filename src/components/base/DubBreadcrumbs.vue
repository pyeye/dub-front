<template>
  <div class="breadcrumbs">
    <div class="breadcrumb" v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.label">
      <div class="breadcrumb-label" :class="{'breadcrumb-disabled': index + 1 === breadcrumbs.length}"><router-link :to="breadcrumb.link" >{{breadcrumb.label}}</router-link></div>
      <div class="breadcrumb-separator" v-if="index + 1 !== breadcrumbs.length"><icon class="icon"  name="angle-right"></icon></div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'DubBreadcrumbs',
  props: ['breadcrumbs'],
  data: () => ({
  }),
  computed: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .breadcrumbs {
      margin: 16px 0;
      @include prefix((
      display: flex,
      flex-direction: row, 
    ), webkit ms);
  }

  .breadcrumb {
      @include prefix((
      display: flex,
      flex-direction: row, 
    ), webkit ms);
  }

  .breadcrumb-label {
      color: $text_color;
      padding-bottom: 2px;
    font-size: 14px;
    font-weight: 600;
    opacity: .8;
    letter-spacing: .01em;

    &:hover {
        border-bottom: 2px solid $primary_color;
        padding-bottom: 0;
    }
  }

  .breadcrumb-separator {
      width: 20px;
      height: 22px;
      opacity: .8;
      color: $text_color;
      @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center, 
    ), webkit ms);
  }

  .breadcrumb-disabled {
    pointer-events: none;
    cursor: default;
    text-decoration:none;
    opacity: .7;
  }

  a {
      text-decoration: none;
      color: $text_color;
  }

</style>
