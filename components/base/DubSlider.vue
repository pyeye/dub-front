<template lang="html">
  <div
    :class="[
      `vs-slider-${color}`,
      {'disabledx':disabled}
    ]"
    class="con-vs-slider"
    @mousewheel.prevent="mousewheelx"
    @keydown.left="keydownLeft"
    @keydown.right="keydownRight">

    <button
      ref="slider"
      :disabled="disabled"
      class="vs-slider"
      @click="clickSlider($event),actived = true">
      <span
        :style="styleLineOne"
        :class="{'hasTransition':effect}"
        class="vs-slider-line-one"></span>
      <span class="vs-slider-line-two"></span>

      <span
        :class="{'run-effect':effect}"
        :style="styleEfect"
        class="vs-slider-line-efect"></span>

      <!-- vsTicks -->
      <span
        v-for="(tick,index) in countTicks"
        v-if="ticks&&tick"
        :key="index"
        :class="{'isEnd':index == countTicks-1}"
        :style="styleTicks(index)"
        class="vs-slider--tick">
      </span>
    </button>
    <button
      ref="circle1"
      :disabled="disabled"
      :class="{
        'hasTransition':effect,
        'isEquals':isEquals,
        'changeValue':changeValue,
        'isEndValue':value == max
      }"
      :style="styleCircle"
      class="vs-circle-slider vs-circles-slider vs-slider--circles vs-slider--circle"
      @touchstart="activeFocus($event),actived = true"
      @mousedown="activeFocus($event),actived = true">
      <span
        :style="styleText"
        class="text-circle-slider vs-slider--circle-text">
        {{ valueCircle1 }}
        <span v-if="textFixed">
          {{ textFixed }}
        </span>
        <vs-icon
          :icon-pack="iconPack"
          :icon="icon"
        ></vs-icon>
      </span>

    </button>
    <button
      v-if="Array.isArray(value)"
      ref="circle2"
      :disabled="disabled"
      :class="{
        'hasTransition':effect,
        'isEquals':isEquals,
        'changeValue':changeValue,
        'isEndValue':value == max
      }"
      :style="styleCircleTwo"
      class="vs-circle-slider-two vs-circles-slider vs-slider--circles vs-slider--circle-two"
      @touchstart="activeFocus($event),two = true,actived = true"
      @mousedown="activeFocus($event),two = true,actived = true">

      <span
        :style="styleText"
        class="text-circle-slider vs-slider--circle-text">
        {{ valueCircle2 }}
        <span v-if="textFixed">
          {{ textFixed }}
        </span>
        <i
          v-if="icon"
          translate="no"
          class="material-icons notranslate">
          {{ icon }}
        </i>
      </span>

    </button>
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */

export default {
  name: 'DubSlider',
  props: {
    value: {},
    disabled: {
      default: false,
      type: [Boolean, String],
    },
    color: {
      default: 'primary',
      type: String,
    },
    max: {
      default: 100,
      type: [Number, String],
    },
    min: {
      default: 0,
      type: Number,
    },
    ticks: {
      default: false,
      type: Boolean,
    },
    step: {
      default: 1,
      type: [Number, String],
    },
    icon: {
      default: null,
      type: String,
    },
    iconPack: {
      default: 'material-icons',
      type: String,
    },
    textFixed: {
      default: null,
      type: String,
    },
  },
  data: () => ({
    leftx: 0,
    leftTwo: 0,
    effect: false,
    two: false,
    actived: false,
    changeValue: false,
    valueCircle1: 0,
    valueCircle2: 0,
  }),
  computed: {
    isEquals() {
      // eslint-disable-next-line eqeqeq
      return Array.isArray(this.value) ? this.value[0] == this.value[1] : false;
    },
    countTicks() {
      return this.max + 1;
    },
    /*
     * styles component
     */
    styleSlider() {
      return {
        background: '#fc0',
      };
    },
    styleLineOne() {
      let widthx = this.leftTwo - this.leftx;
      let { leftx } = this;
      if (this.leftx > this.leftTwo) {
        widthx = this.leftx - this.leftTwo;
        leftx = this.leftTwo;
      }
      return {
        width: `${widthx}%`,
        left: `${leftx}%`,
        background: '#fc0',
      };
    },
    styleCircle() {
      return {
        left: `${this.leftx}%`,
        border: `2px solid #fc0`,
      };
    },
    styleCircleTwo() {
      return {
        left: `${this.leftTwo}%`,
        border: `2px solid #fc0`,
      };
    },
    styleEfect() {
      return {
        left: `${this.leftx}%`,
        background: '#fc0',
      };
    },
    styleText() {
      return {
        background: '#fc0',
      };
    },
  },
  watch: {
    value() {
      if (!this.actived) {
        this.changePosition();
      }
      this.changeValue = true;
      setTimeout(() => {
        this.changeValue = false;
      }, 300);
      this.$emit('change', this.value);
    },
    leftx() {
      if (Array.isArray(this.value)) {
        if (this.leftx > this.leftTwo) {
          this.valueCircle1 = this.value[1];
        } else {
          this.valueCircle1 = this.value[0];
        }
      } else {
        this.valueCircle1 = this.value;
      }
    },
    leftTwo: {
      handler() {
        if (this.leftTwo > this.leftx) {
          this.valueCircle2 = this.value[1];
        } else {
          this.valueCircle2 = this.value[0];
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.changePosition();
  },

  methods: {
    mousewheelx(evt) {
      if (!Array.isArray(this.value)) {
        if (evt.wheelDelta > 0) {
          let val = this.value + this.step;
          if (this.value >= this.max) {
            val = this.max;
          }
          this.leftx = val;
          this.$emit('input', val);
        } else {
          let val = this.value - this.step;
          if (this.value <= this.min) {
            val = this.min;
          }
          this.leftx = val;
          this.$emit('input', val);
        }
      }
    },
    keydownLeft() {
      if (!Array.isArray(this.value)) {
        let val = this.value - this.step;
        // eslint-disable-next-line eqeqeq
        if (this.value == this.min) {
          val = this.min;
        }
        this.leftx = val;
        this.$emit('input', val);
      }
    },
    keydownRight() {
      if (!Array.isArray(this.value)) {
        let val = this.value + this.step;
        if (this.value >= this.max) {
          val = this.max;
        }
        this.leftx = val;
        this.$emit('input', val);
      }
    },
    changePosition() {
      if (Array.isArray(this.value)) {
        this.leftx = ((this.value[1] - this.min) / (this.max - this.min)) * 100;
        this.leftTwo = ((this.value[0] - this.min) / (this.max - this.min)) * 100;
      } else {
        this.leftx = Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
      }
    },
    styleTicks(index) {
      const lengthPerStep = 100 / ((this.max - this.min) / this.step);
      const steps = index / lengthPerStep;
      return {
        left: `${steps * lengthPerStep}%`,
      };
    },
    activeFocus() {
      window.addEventListener('mousemove', this.mouseMovex);
      window.addEventListener('mouseup', this.removeEvents);
      window.addEventListener('touchmove', this.mouseMovex);
      window.addEventListener('touchend', this.removeEvents);
    },
    mouseMovex(evt) {
      const { slider } = this.$refs;
      let leftx;
      /*
      * change position left circle and bar
      */
      if (evt.type == 'touchmove') {
        // eslint-disable-next-line no-restricted-globals
        leftx = event.targetTouches[0].clientX - slider.getBoundingClientRect().left;
      } else {
        leftx = evt.clientX - slider.getBoundingClientRect().left;
      }

      if (Math.sign(leftx) == -1) {
        leftx = 0;
      } else if (leftx > slider.clientWidth) {
        leftx = slider.clientWidth;
      }

      this.changeLeft(leftx);
    },
    removeEvents() {
      // eslint-disable-next-line no-multi-assign
      this.two = this.actived = false;
      window.removeEventListener('mouseup', this.removeEvents);
      window.removeEventListener('mousemove', this.mouseMovex);
      window.removeEventListener('touchmove', this.mouseMovex);
      window.removeEventListener('touchend', this.removeEvents);
    },
    clickSlider(evt) {
      const { slider } = this.$refs;
      const leftx = evt.clientX - slider.getBoundingClientRect().left;
      this.effect = true;
      setTimeout(() => {
        this.effect = false;
      }, 200);

      const obtenerPorcentaje = (leftx / slider.clientWidth) * 100;
      const porcentajex = Math.round(obtenerPorcentaje);

      if (Array.isArray(this.value)) {
        if (Math.abs(porcentajex - this.leftx) > Math.abs(porcentajex - this.leftTwo)) {
          this.two = true;
        } else {
          this.two = false;
        }
      }

      this.changeLeft(leftx);
    },
    changeLeft(leftx) {
      const { slider } = this.$refs;
      const obtenerPorcentaje = (leftx / slider.clientWidth) * 100;
      const porcentajex = Math.round(obtenerPorcentaje);
      // let val = Math.round(porcentajex / 100 * (this.max))

      const lengthPerStep = 100 / ((this.max - this.min) / this.step);
      const steps = Math.round(porcentajex / lengthPerStep);
      let val = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
      val = Math.round(val);

      // let val = Math.round(porcentajex * (this.max - this.min) * 0.01 + this.min)
      if (this.ticks) {
        // val =  Math.round(porcentajex / 100 * (this.max / this.step)) * this.step
        if (val > this.max) {
          val = this.max;
          this[this.two ? 'leftTwo' : 'leftx'] = 100;
        } else {
          this[this.two ? 'leftTwo' : 'leftx'] = Math.round(steps * lengthPerStep);
        }
      } else {
        this[this.two ? 'leftTwo' : 'leftx'] = Math.round(steps * lengthPerStep);
      }

      if (Array.isArray(this.value)) {
        let valueNew = val;
        if (val == this.max) {
          valueNew = this.max;
        }
        const vals = this.value;
        const min = Math.round((this.leftTwo / 100) * (this.max / this.step)) * this.step;
        const max = Math.round((this.leftx / 100) * (this.max / this.step)) * this.step;
        if (this.two) {
          if (min < max) {
            this.$emit('input', [valueNew, vals[1]]);
          } else if (min > max) {
            this.$emit('input', [vals[0], valueNew]);
          } else {
            this.$emit('input', [valueNew, valueNew]);
          }
        } else if (min > max) {
          this.$emit('input', [valueNew, vals[1]]);
        } else if (min < max) {
          this.$emit('input', [vals[0], valueNew]);
        } else {
          this.$emit('input', [valueNew, valueNew]);
        }
      } else {
        this.$emit('input', val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.con-vs-slider {
  width: 100%;
  position: relative;
  left: 0px;
  margin: 16px 0px;
  display: block;
  min-width: 300px;
  z-index: 100;
  &.disabledx {
    opacity: 0.4;
    cursor: default;
    button {
      cursor: default !important;
      pointer-events: none;
    }
  }
}

.vs-slider {
  width: 100%;
  height: 4px;
  border-radius: 4px;
  background: rgb(240, 240, 240);
  position: relative;
  cursor: pointer;
  border: 0px;
  margin: 0px;
  display: block;
  overflow: hidden;
}

.vs-slider-line-one {
  width: 20px;
  height: 100%;
  top: 0px;
  position: absolute;
  left: 0px;
  z-index: 1;
  &.hasTransition {
    transition: all 0.2s ease;
  }
}

.vs-slider-line-efect {
  width: 0px;
  height: 100%;
  top: 0px;
  position: absolute;
  left: 0px;
  transition: opacity 0.3s ease, width 0.3s ease;
  transform: translate(-50%);
  &:not(.run-effect) {
    opacity: 0 !important;
    width: 0% !important;
  }

  &.run-effect {
    width: 100%;
    animation: example 0.3s ease;
    animation-iteration-count: 1;
  }
}

.vs-slider--tick {
  position: absolute;
  left: 100px;
  background: rgb(210, 210, 210);
  width: 4px;
  height: 100%;
  top: 0px;
  &.isEnd {
    transform: translate(-100%);
  }
}

.vs-slider--circles {
  transform: translate(-50%);
  transition: border 0.2s ease, transform 0.2s ease, border-radius 0.2s ease;
  display: block;
  background: rgb(255, 255, 255);
  &:active {
    border-width: 7px !important;
  }
  &.isEquals {
    &.vs-circle-slider-two {
      border-radius: 50% 50% 0px 0px;
      transform: translate(-50%, -7px) scale(0.9) !important;
    }
    &.vs-circle-slider {
      border-radius: 0px 0px 50% 50%;
      transform: translate(-50%, 6px) scale(0.9) !important;
    }
  }
  &.changeValue {
    &:active {
      border-width: 6px !important;
      .text-circle-slider {
        transform: translate(-50%, calc(-100% + -19px)) !important;
      }
    }
  }
  &.isEndValue {
    border-radius: 50% 0% 0% 50% !important;
  }
  &:hover:not(:active) {
    transform: scale(1.2) translate(-50%);
  }
  &:active {
    .text-circle-slider {
      opacity: 1;
      transform: translate(-50%, calc(-100% + -13px)) scale(1) rotate(0deg);
      visibility: visible;
    }
  }
}

// &:active
//   .text-circle-slider
//     transform: translate(-50%,calc(-100% + -15px)) scale(1) rotate(0deg)
.vs-slider--circle-text {
  color: rgb(255, 255, 255);
  position: absolute;
  padding: 2px 5px;
  display: block;
  border-radius: 5px;
  transform: translate(-50%, -20%) scale(0.3);
  top: 0px;
  left: 50%;
  font-size: 0.75rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  span {
    margin-left: 2px;
  }
  i {
    font-size: 0.8rem;
    margin-left: 2px;
  }
  &:after {
    content: '';
    width: 6px;
    height: 6px;
    display: block;
    position: absolute;
    background: inherit;
    left: 50%;
    bottom: -3px;
    transform: translate(-50%) rotate(45deg);
  }
}

.vs-slider--circle {
  width: 16px;
  height: 16px;
  padding: 0;
  position: absolute;
  top: -6px;
  border-radius: 50%;
  cursor: pointer;
  border: 0px;
  margin: 0px;
  z-index: 200;
  &.hasTransition {
    transition: all 0.2s ease;
  }
}

.vs-slider--circle-two {
  z-index: 100;
  width: 16px;
  height: 16px;
  padding: 0;
  position: absolute;
  top: -6px;
  border-radius: 50%;
  cursor: pointer;
  border: 0px;
  margin: 0px;
  color: rgb(255, 255, 255);
  &.hasTransition {
    transition: all 0.2s ease;
  }
}

@keyframes example {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.vs-slider-primary {
  .vs-slider-line-one {
    background: $primary_color;
  }
  .vs-circles-slider {
    border: 2px solid $primary_color;
  }

  .text-circle-slider {
    background: $primary_color;
  }
  .vs-slider-line-efect {
    background: $primary_color;
  }
}
</style>
