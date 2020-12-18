<template>
  <div id="app">
    <no-ssr>
      <dub-agreement/>
    </no-ssr>
    <dub-header/>
    <nuxt/>
    <dub-footer/>
  </div>
</template>

<script>
import DubAgreement from '~/components/base/DubAgreement';
import DubHeader from '~/components/base/DubHeader';
import DubFooter from '~/components/base/DubFooter';

export default {
  name: 'app',
  components: {
    DubAgreement,
    DubHeader,
    DubFooter,
  },
};
</script>


<style lang="scss" scoped>
#app {
  margin: 0;
  font-family: $main_font;
  line-height: 1.5;
  min-height: 100vh;
  background-color: $body_color;
  color: $text_color;
  display: flex;
  flex-direction: column;
}
.link {
  text-decoration: none;
}
</style>
