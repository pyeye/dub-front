<template>
  <div class="dub-link">
    <nuxt-link :to="to" class="underline">
      <span><slot/></span>
      <svg viewBox="0 0 13 20"><polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" /></svg>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'DubLink',
  props: {
    to: {
      type: String,
    },
  },
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.underline {
  text-decoration: none;
  color: $text_color;
  position: relative;
  span {
    background-image: linear-gradient(0deg, $text_color 0%, $text_color 100%);
    background-position: 100% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    transition: background-size 0.2s linear 0.15s;
    transform: translateZ(0);
  }
  svg {
    vertical-align: top;
    display: inline;
    line-height: 1;
    width: 15px;
    height: 24px;
    position: relative;
    left: -2px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1px;
    stroke: $text_color;
    stroke-dasharray: 7.95 30;
    stroke-dashoffset: 46;
    transition: stroke-dashoffset 0.15s linear 0s;
  }
  &:hover {
    span {
      background-size: 0% 1px;
      transition: background-size 0.2s linear 0s;
    }
    svg {
      stroke-dashoffset: 26;
      transition: stroke-dashoffset 0.3s cubic-bezier(0.3, 1.5, 0.5, 1) 0.195s;
    }
  }
}
</style>
