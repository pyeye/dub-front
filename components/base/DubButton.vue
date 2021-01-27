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
        primary: this.type === 'primary',
        secondary: this.type === 'secondary',
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
  position: relative;
  box-sizing: border-box;
  padding: 8px 16px;
  text-decoration: none !important;
  outline: none;
  cursor: pointer;
  border: none;
  background-color: transparent;

  &.secondary {
    color: $text_color;

    &.secondary:after,
    &.secondary:before {
      content: '';
      display: block;
      position: absolute;
      top: 100%;
      left: 25%;
      width: 50%;
      height: 2px;
      background-color: $text_color;
      transition: all 0.3s ease;
      transform: scale(0.6);
    }

    &.secondary:hover:before {
      top: 0;
      transform: scale(1);
    }

    &.secondary:hover:after {
      transform: scale(1);
    }
  }

  &.primary {
    color: $text_color;

    &.primary::after,
    &.primary::before {
      content: '';
      display: block;
      position: absolute;
      width: 20%;
      height: 20%;
      border: 2px solid;
      transition: all 0.45s ease;
    }

    &.primary::after {
      bottom: 0;
      right: 0;
      border-top-color: transparent;
      border-left-color: transparent;
      border-bottom-color: $text_color;
      border-right-color: $text_color;
    }

    &.primary::before {
      top: 0;
      left: 0;
      border-bottom-color: transparent;
      border-right-color: transparent;
      border-top-color: $text_color;
      border-left-color: $text_color;
    }

    &.primary:hover:after,
    &.primary:hover:before {
      border-bottom-color: $text_color;
      border-right-color: $text_color;
      border-top-color: $text_color;
      border-left-color: $text_color;
      width: 100%;
      height: 100%;
    }
  }
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
