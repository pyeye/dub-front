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
  background-color: #f5f4f0;
  color: #252525;
  display: flex;
  flex-direction: column;
}
.link {
  text-decoration: none;
}
.dub-notification {
  padding: 10px;
  margin: 0 5px 5px;
  font-size: 12px;
  text-decoration: none;
  color: #fafafa;
  background: #44a4fc;
  border-left: 5px solid #187fe7;
  .notification-title {
    font-size: 14px;
  }
  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }
  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }
  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
  }
  &.info {
    /*
    Style for specific type of notification, will be applied when you
    call notification with "type" parameter:
    this.$notify({ type: 'my-type', message: 'Foo' })
    */
    background: #fc0;
    border-left-color: #fc0;
  }
}
</style>
