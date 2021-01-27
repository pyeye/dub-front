


<template lang="html">
  <div
    :class="[
      `vs-input-number-size-${size}`,
      `vs-input-number-${color}`,
      {'isChangeValue':isChangeValue}
    ]"
    class="vs-input-number">
    <button
      v-repeat-click="less"
      :disabled="$attrs.disabled"
      :class="{
        limit:value <= min
      }"
      :style="{
        background:getColor
      }"
      class="btn-less vs-input-number--button-less"
      type="button">
      <dub-icon iconName="Минус" class="icon"><icon-minus/></dub-icon>
    </button>
    <span v-if="label">{{ label }}</span>
    <input
      ref="input"
      :style="styleInput"
      :value="value"
      v-bind="$attrs"
      type="number"
      class="vs-input-number--input"
      v-on="listeners">
    <button
      v-repeat-click="plus"
      :disabled="$attrs.disabled"
      :class="{
        limit:value >= max && max !== null
      }"
      :style="{
        background:getColor
      }"
      class="btn-plus vs-input-number--button-plus"
      type="button">
    <dub-icon iconName="Плюс" class="icon"><icon-plus/></dub-icon>
    </button>
  </div>
</template>

<script>
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable func-names */
export default {
  name: 'DubNumberInput',
  directives: {
    repeatClick: {
      bind(el, binding, vnode) {
        let intervalx = null;
        let startT;
        const functionx = () => vnode.context[binding.expression].apply();
        const bucle = () => {
          if (new Date() - startT < 100) {
            functionx();
          }
          clearInterval(intervalx);
          intervalx = null;
        };
        const eventx = e => {
          if (e.button !== 0) return;
          startT = new Date();
          var escuchando = function() {
            if (bucle) {
              // eslint-disable-next-line prefer-rest-params
              bucle.apply(this, arguments);
            }
            el.removeEventListener('mouseup', escuchando, false);
          };
          el.addEventListener('mouseleave', escuchando, false);
          el.addEventListener('mouseup', escuchando, false);
          clearInterval(intervalx);
          intervalx = setInterval(functionx, 100);
        };
        el.addEventListener('mousedown', eventx, false);
      },
    },
  },
  inheritAttrs: false,
  props: {
    value: {},
    color: {
      default: 'primary',
      type: String,
    },
    label: {
      default: null,
      type: String,
    },
    max: {
      default: null,
      type: [Number, String],
    },
    min: {
      default: 0,
      type: [Number, String],
    },
    size: {
      default: null,
      type: String,
    },
    iconPack: {
      default: 'material-icons',
      type: String,
    },
    iconDec: {
      default: 'remove',
      type: String,
    },
    iconInc: {
      default: 'add',
      type: String,
    },
    step: {
      default: 1,
      type: [Number, String],
    },
  },
  data: () => ({
    isChangeValue: false,
  }),
  computed: {
    styleInput() {
      return {
        width: `${this.getLength}px`,
      };
    },
    getLength() {
      if (this.value) {
        return this.value.toString().length * 9.1;
      }
      return 0;
    },
    getColor() {
      return '#282828';
    },
    listeners() {
      return {
        ...this.$listeners,
        blur: evt => {
          if (parseFloat(this.value) > parseFloat(this.max)) {
            this.$emit('input', this.max);
          } else if (parseFloat(this.value) < parseFloat(this.min)) {
            this.$emit('input', this.min);
            this.$emit('blur', evt);
          }
        },
        input: evt => {
          this.$emit('input', evt.target.value);
        },
      };
    },
  },
  watch: {
    value() {
      this.isChangeValue = true;
      setTimeout(() => {
        this.isChangeValue = false;
      }, 200);
    },
  },
  methods: {
    plus() {
      let newValue;
      if (!this.value) {
        newValue = 0;
      }
      if (this.max ? parseFloat(this.value) < parseFloat(this.max) : true) {
        newValue = parseFloat(this.value) + parseFloat(this.step);
        if (!Number.isInteger(newValue)) {
          const fixedLength = Number.isInteger(this.step) ? 1 : `${this.step}`.split('.')[1].length;
          newValue = newValue.toFixed(fixedLength);
        }
        this.$emit('input', newValue);
      }
    },
    less() {
      let newValue;
      if (!this.value) {
        newValue = 0;
      }
      if (this.min ? parseFloat(this.value) > parseFloat(this.min) : true) {
        newValue = parseFloat(this.value) - parseFloat(this.step);
        if (!Number.isInteger(newValue)) {
          const fixedLength = Number.isInteger(this.step) ? 1 : `${this.step}`.split('.')[1].length;
          newValue = newValue.toFixed(fixedLength);
        }
        this.$emit('input', newValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vs-input-number {
  position: relative;
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 10px;
  background: rgb(245, 245, 245);
  padding: 2px;
  border-radius: 5px;
  &.isChangeValue {
    .vs-input-number--input {
      transform: translate(0, -2px);
      opacity: 0.5;
    }
  }
  .vs-input-number--input {
    transition: all 0.2s ease;
    width: 40px;
    min-width: 40px;
    border: 0px;
    text-align: center;
    background: transparent;
    padding: 4px;
    -moz-appearance: textfield;
  }

  .vs-input-number--input[type='number']::-webkit-inner-spin-button,
  .vs-input-number--input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  button {
    min-width: 22px;
    min-height: 22px;
    padding: 0px;
    margin: 0px;
    display: block;
    position: relative;
    border: 0px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: $overlay_color;
    backface-visibility: hidden;
    &:disabled {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    }
    i {
      font-size: 0.9rem;
    }

    &.vs-input-number--button-plus {
      transform: translate(10px);
      &:active {
        transform: scale(0.9) translate(10px);
      }
      &:disabled {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    &.vs-input-number--button-plus.limit {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
      background-color: rgba(0, 0, 0, 0.5);
    }
    &.vs-input-number--button-less {
      transform: translate(-10px);
      &:active {
        transform: scale(0.9) translate(-10px);
      }
      &:disabled {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    &.vs-input-number--button-less.limit {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}

.vs-input-number-primary {
  button {
    background: $text_color;

    &:hover {
      box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
