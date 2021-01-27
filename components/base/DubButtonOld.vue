<template>
  <div v-response.masked.large="active"
    class="my-button"
    :class="btnStyle">
    <div v-if="active">
      <hollow-dots-spinner
        :animation-duration="1000"
        :dot-size="10"
        :dots-num="3"
        :color="'#252525'"
      />
     </div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'DubButton',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnStyle() {
      return {
        'my-button-primary': this.type === 'primary',
        'my-button-secondary': this.type === 'secondary',
        'button-active': this.active,
        'button-primary-disabled': this.type === 'primary' && this.disabled,
        'button-secondary-disabled': this.type === 'secondary' && this.disabled,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.my-button {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: center,
      align-items: center,
    ),
    webkit ms
  );
  position: relative;
  box-sizing: border-box;
  min-width: 5.14em;
  padding: 0.7em 0.57em;
  height: 40px;
  color: #252525;
  text-transform: uppercase;
  text-decoration: none !important;
  font-size: 12px;
  outline: none;
  vertical-align: baseline;
  font-weight: 700;
  line-height: 1.5;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  letter-spacing: 0.025em;
  transition: box-shadow 0.25s ease, border 0.25s ease, background-color 0.25s ease;
  cursor: pointer;
}
.my-button-primary {
  background-color: #fc0;
  border-top: 1px solid #ffd633;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2);
  border: none;
}
.my-button-primary:hover {
  background-color: #fcc403;
}
.my-button-secondary {
  border: 2px solid #ffd633;
}
.my-button-secondary:hover {
  background-color: #ffd633;
}
.button-active {
  cursor: default;
  pointer-events: none;
}
.button-primary-disabled {
  background-color: $disable_color;
  border-top: 1px solid darken($disable_color, 5%);
  color: darken($disable_color, 30%);
  cursor: default;
  pointer-events: none;
}
.button-secondary-disabled {
  border: 2px solid $disable_color;
  color: darken($disable_color, 20%);
  cursor: default;
  pointer-events: none;
}
</style>
