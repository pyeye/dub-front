<script>
export default {
  name: 'DubCheckbox',

  props: {
    value: {
      required: true,
    },
    val: {},

    trueValue: { default: true },
    falseValue: { default: false },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dark: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number],

    toggleIndeterminate: Boolean,
    indeterminateValue: { default: null },
  },

  computed: {
    isTrue() {
      return this.modelIsArray ? this.index > -1 : this.value === this.trueValue;
    },

    isFalse() {
      return this.modelIsArray ? this.index === -1 : this.value === this.falseValue;
    },

    // eslint-disable-next-line consistent-return
    index() {
      if (this.modelIsArray) {
        return this.value.indexOf(this.val);
      }
    },

    modelIsArray() {
      return Array.isArray(this.value);
    },

    computedTabindex() {
      return this.disable ? -1 : this.tabindex || 0;
    },

    isIndeterminate() {
      // eslint-disable-next-line no-void
      return this.value === void 0 || this.value === this.indeterminateValue;
    },

    classes() {
      return {
        disabled: this.disable,
        'q-checkbox--dark': this.dark,
        'q-checkbox--dense': this.dense,
        reverse: this.leftLabel,
      };
    },

    // eslint-disable-next-line consistent-return
    innerClass() {
      const color = `text-${this.color}`;

      if (this.isTrue) {
        return `q-checkbox__inner--active${this.color ? ` ${color}` : ''}`;
      }
      if (this.isIndeterminate) {
        return `q-checkbox__inner--indeterminate${this.color ? ` ${color}` : ''}`;
      }
      if (this.keepColor && this.color) {
        return color;
      }
    },
  },

  methods: {
    stopAndPrevent(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    toggle(e) {
      if (this.disable === true) {
        return;
      }

      // eslint-disable-next-line
      e !== void 0 && this.stopAndPrevent(e);

      let val;

      if (this.modelIsArray) {
        if (this.isTrue) {
          val = this.value.slice();
          val.splice(this.index, 1);
        } else {
          val = this.value.concat(this.val);
        }
      } else if (this.isTrue) {
        val = this.toggleIndeterminate ? this.indeterminateValue : this.falseValue;
      } else if (this.isFalse) {
        val = this.trueValue;
      } else {
        val = this.falseValue;
      }

      this.$emit('input', val);
    },

    __keyDown(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.stopAndPrevent(e);
        this.toggle();
      }
    },

    slot(slotName) {
      // eslint-disable-next-line
      return this.$scopedSlots[slotName] !== void 0 ? this.$scopedSlots[slotName]() : void 0;
    },
  },

  render(h) {
    return h(
      'div',
      {
        staticClass: 'q-checkbox cursor-pointer no-outline row inline no-wrap items-center',
        class: this.classes,
        attrs: { tabindex: this.computedTabindex },
        on: {
          click: this.toggle,
          // eslint-disable-next-line no-underscore-dangle
          keydown: this.__keyDown,
        },
      },
      [
        h(
          'div',
          {
            staticClass: 'q-checkbox__inner relative-position',
            class: this.innerClass,
          },
          [
            this.disable !== true
              ? h('input', {
                  staticClass: 'q-checkbox__native q-ma-none q-pa-none invisible',
                  attrs: { type: 'checkbox' },
                  on: { change: this.toggle },
                })
              : null,

            h(
              'div',
              {
                staticClass: 'q-checkbox__bg absolute',
              },
              [
                h(
                  'svg',
                  {
                    staticClass: 'q-checkbox__check fit absolute-full',
                    attrs: { viewBox: '0 0 24 24' },
                  },
                  [
                    h('path', {
                      attrs: {
                        fill: 'none',
                        d: 'M1.73,12.91 8.1,19.28 22.79,4.59',
                      },
                    }),
                  ]
                ),

                h('div', { staticClass: 'q-checkbox__check-indet absolute' }),
              ]
            ),
          ]
        ),

        // eslint-disable-next-line no-void
        this.label !== void 0 || this.$scopedSlots.default !== void 0
          ? h(
              'div',
              {
                staticClass: 'q-checkbox__label q-anchor--skip',
              },
              // eslint-disable-next-line no-void
              (this.label !== void 0 ? [this.label] : []).concat(this.slot('default'))
            )
          : null,
      ]
    );
  },
};
</script>

<style lang="scss" scoped>
$checkbox-transition: 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;

.q-checkbox {
  vertical-align: middle;
  display: inline-flex;
  outline: 0;
  cursor: pointer;
  align-items: center;
  flex-wrap: nowrap;

  &__inner:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.12;
    transform: scale3d(0, 0, 0);
    transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  &:focus:not(.disabled) {
    .q-checkbox__inner:before {
      transform: scale3d(1, 1, 1);
    }
  }

  &--dense:focus .q-checkbox__inner:before {
    transform: scale3d(2, 2, 2);
  }

  &__bg {
    position: absolute;
    left: 6px;
    top: 6px;
    right: auto;
    bottom: 0;
    width: 45%;
    height: 45%;
    border: 2px solid currentColor;
    border-radius: 2px;
    transition: background 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  &__native {
    width: 1px;
    height: 1px;
    visibility: hidden;
    margin: 0;
    padding: 0;
  }

  &__label {
    padding-left: 4px;
    font-size: 14px;
    line-height: 20px;
  }

  &.reverse &__label {
    padding-right: 4px;
  }

  &__check {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: white;
    width: 100%;
    height: 100%;

    path {
      stroke: currentColor;
      stroke-width: 3.12px;
      stroke-dashoffset: 29.78334;
      stroke-dasharray: 29.78334;
    }
  }

  &__check-indet {
    position: absolute;
    width: 100%;
    height: 0;
    left: 0;
    top: 50%;
    border-color: white;
    border-width: 1px;
    border-style: solid;
    transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, -280deg) scale3d(0, 0, 0);
  }

  &__inner {
    position: relative;
    width: 15px;
    min-width: 15px;
    height: 15px;
    padding: 8px;
    outline: 0;
    border-radius: 50%;
    color: rgba(0, 0, 0, 0.54);

    &--active,
    &--indeterminate {
      color: $primary_color;
      .q-checkbox__bg {
        background: currentColor;
      }
    }

    &--active {
      path {
        stroke-dashoffset: 0;
        transition: stroke-dashoffset 0.18s cubic-bezier(0.4, 0, 0.6, 1) 0ms;
      }
    }

    &--indeterminate {
      .q-checkbox__check-indet {
        transform: translate3d(0, -50%, 0) rotate3d(0, 0, 1, 0) scale3d(1, 1, 1);
        transition: transform $checkbox-transition;
      }
    }
  }

  &.disabled {
    opacity: 1 !important;
    .q-checkbox__inner,
    .q-checkbox__label {
      color: rgba(0, 0, 0, 0.26);
    }
    .q-checkbox__inner--active .q-checkbox__bg {
      border-color: transparent;
    }
  }

  &--dark {
    .q-checkbox__inner {
      color: rgba(255, 255, 255, 0.7);
      &:before {
        opacity: 0.32 !important;
      }
      &--active,
      &--indeterminate {
        color: $primary_color;
      }
    }

    &.disabled {
      .q-checkbox__inner,
      .q-checkbox__label {
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }

  &--dense {
    .q-checkbox__inner {
      width: 20px;
      min-width: 20px;
      height: 20px;
      padding: 0;
    }

    .q-checkbox__bg {
      left: 1px;
      top: 1px;
      width: 18px;
      height: 18px;
    }
  }
}

svg:not(:root) {
  overflow: hidden;
}
</style>
