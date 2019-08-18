<template>
  <div class="breadcrumbs">
    <div class="breadcrumb" v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.label">
      <span class="breadcrumb-label" :class="{'breadcrumb-disabled': index + 1 === breadcrumbs.length}">
        <span class="breadcrumb-title"><nuxt-link :to="breadcrumb.link" >{{breadcrumb.label}}</nuxt-link></span>
      </span>
      <div class="breadcrumb-separator" v-if="index + 1 !== breadcrumbs.length">/</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DubBreadcrumbs',
  props: ['breadcrumbs'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.breadcrumbs {
  color: $text_color;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.breadcrumb {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.breadcrumb-label {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: $accent_font;
  color: $text_color;
  .breadcrumb-title {
    padding-bottom: 2px;
    width: calc(100%);
    background-image: linear-gradient(transparent calc(100% - 3px), $primary_color 3px);
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 0.3s ease;
  }
  &:hover {
    .breadcrumb-title {
      background-size: 100% 100%;
    }
  }
}
.breadcrumb-separator {
  width: 20px;
  height: 22px;
  opacity: 0.8;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.breadcrumb-disabled {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  opacity: 0.7;
}
a {
  text-decoration: none;
  color: $text_color;
}
</style>
