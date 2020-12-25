<template>
  <div class="slider">
    
    <div class="slider-header" v-response.fast>
        <div class="slider-header-box">
          <transition-group
            appear
            name="slide-title"
            tag="div" 
            class="transition-box"
            @before-leave="beforeLeaveHandler"
            @after-enter="afterEnterHandler"
          >
            <div
              class="transition-item"
              v-for="number in [activeSaleIndex]"
              :key="number"
            >
              {{ activeSale.name }}
            </div>
          </transition-group>
        
          <div class="revealer-title-box">
            <div :class="{'revealer-title-animated': isAnimated}" class="revealer-title"></div>  
          </div>
        </div>
    </div>
    
    <div class="slider-title-wrapper">
      <div class="slider-title-overlay"></div>
      <div class="slider-title">
        <transition-group
            appear
            name="sliderk"
            tag="div" 
            class="transition-box"
            @before-leave="beforeLeaveHandler"
            @after-enter="afterEnterHandler"
          >
            <div
              class="transition-item"
              v-for="number in [activeSaleIndex]"
              :key="number"
            >
              <span class="slider-title-text">
          <span class="underline">
            {{ activeSale.name }}
          </span>
        </span>
        <div class="slider-title-description">
          {{ activeSale.description }}
        </div>
        <div class="slider-pagination">
          <dub-icon  width=24 height=24 class="icon-link" @click.native="prevSlide"><icon-left/></dub-icon>
          {{ realSaleIndex + 1 }} / {{ sales.length }}
          <dub-icon  width=24 height=24 class="icon-link" @click.native="nextSlide"><icon-right/></dub-icon>
        </div>
            </div>
          </transition-group>
        
      </div>
    </div>

    <div class="slider-box" v-response.fast.masked>
      <transition-group
        appear
        name="slide"
        tag="div" 
        class="transition-box "
        @before-leave="beforeLeaveHandler"
        @after-enter="afterEnterHandler"
      >
        <div
          class="transition-item "
          v-for="number in [activeSaleIndex]"
          :key="number"
          :style="getBgImage(activeSale.image.src)"
        >
          <nuxt-link class="nuxt-link" :to="`/sales/${activeSale.pk}`"></nuxt-link>
        </div>
      </transition-group>

      <div class="revealer-box">
        <div :class="{'revealer-animated': isAnimated}" class="revealer"></div>  
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesCarousel',
  props: {
    sales: {
      type: Array,
    },
  },
  data: () => ({
    activeSaleIndex: 0,
    duration: 10000,
    sliderInterval: null,
    isAnimated: false,
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  computed: {
    activeSale() {
      return this.sales[this.realSaleIndex];
    },
    realSaleIndex() {
      return Math.abs(this.activeSaleIndex) % this.sales.length;
    },
  },
  mounted() {
    this.startSlider();
  },
  methods: {
    getBgImage(imageUrl) {
      return `background-image: url(${this.baseUrl}${imageUrl});`;
    },
    setSlide(index) {
      if (this.isAnimated) {
        return;
      }
      this.activeSaleIndex = index;
      this.restartSlider();
    },
    nextSlide() {
      this.activeSaleIndex = this.activeSaleIndex + 1;
    },
    prevSlide() {
      this.activeSaleIndex = this.activeSaleIndex - 1;
    },
    startSlider() {
      this.sliderInterval = setInterval(this.nextSlide, this.duration);
    },
    stopSlider() {
      clearInterval(this.sliderInterval);
      this.sliderInterval = null;
    },
    restartSlider() {
      this.stopSlider();
      this.startSlider();
    },
    beforeLeaveHandler() {
      this.isAnimated = true;
    },
    afterEnterHandler() {
      this.isAnimated = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.slider {
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
}
.slider-header {
  grid-column: 4 / full-end;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  margin: 24px 0 -36px 0;
  font-size: 136px;
  color: $overlay_color;
  font-weight: 700;
  line-height: 140px;
  height: 140px;
  font-family: $accent_font;
  letter-spacing: -0.64px;
  font-family: $accent_font;
  text-transform: uppercase;
  cursor: default;
  z-index: 1;
}
.slider-header-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-title-wrapper {
  grid-column: full-start / 6;
  grid-row: 2;
  display: grid;
  grid-template-columns: [full-start] minmax(16px, 1fr) [main-start] repeat(
      4,
      [col-start] minmax(8px, 100px)
    );
  grid-column-gap: 24px;
  align-items: start;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin: 96px 0 32px 0;
}

.slider-title-overlay {
  grid-column: full-start / -1;
  grid-row: 1;
  background-color: $overlay_color;
  position: relative;
  height: 100%;
  margin-top: 32px;
}

.slider-title {
  grid-column: 2 / -1;
  grid-row: 1;
  position: relative;
  height: 300px;
}

.slider-title-text {
  position: relative;
  font-size: 46px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 52px;
  font-family: $main_font;
}

.slider-title-description {
  position: relative;
  margin: 24px 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
}

.slider-pagination {
  position: relative;
  margin: 16px 0;
  font-size: 28px;
  font-weight: 300;
  line-height: 36px;
  letter-spacing: 0px;
  margin-left: auto;
}

.underline {
  cursor: pointer;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s ease;
  &:hover {
    background-size: 100% 100%;
  }
}
.icon-link {
  cursor: pointer;
}
.slider-bullets-reveal {
  z-index: 3;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
  border-radius: 4px;
}
.slider-bullets {
  z-index: 3;
  position: related;
  width: 300px;
  height: 100%;
  margin: 8px 8px 8px auto;
  font-size: 18px;
  line-height: 18px;
  letter-spacing: 0.15px;
  font-weight: 600;
  font-family: $accent_font;
  text-align: right;
  color: #eee;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.link {
  text-decoration: none;
  margin: 8px 8px 8px 64px;
}
.bullet {
  cursor: pointer;
  color: #eee;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $primary_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease, color 1.6s ease-in-out;
  &:hover {
    background-size: 100% 100%;
  }
}
.actiive-bullet {
  color: $primary_color;
}
.slider-name {
  position: absolute;
  top: 20%;
  right: -48px;
  font-size: 32px;
  letter-spacing: 4px;
  font-weight: 600;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.transition-item {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border-radius: 4px;
}
.nuxt-link {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
}
.link-title {
  cursor: pointer;
  color: $text_color;
  margin: 0;
  padding: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
  height: 100%;
  width: 100%;
}
.slider-box {
  position: relative;
  grid-column: 7 / full-end;
  grid-row: 2;
  height: 600px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.transition-box {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.revealer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $overlay_color;
  transform: translateX(-101%);
  z-index: 4;
}
.revealer-title {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $body_color;
  transform: translateX(101%);
  z-index: 4;
}
.revealer-box {
  position: relative;
  overflow: hidden;
  top: -600px;
  height: 600px;
  width: 100%;
  border-radius: 4px;
}
.revealer-title-box {
  position: relative;
  overflow: hidden;
  top: -80px;
  height: 80px;
  width: 100%;
}
.slide-enter-active {
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-delay: 0.7s;
}
.slide-leave-active {
  transition: all 0.01s linear;
  transition-delay: 0.7s;
}
.slide-leave-to {
  opacity: 0;
}
.slide-enter {
  opacity: 0;
  transform: scale(0.9) translateX(-7%);
}
.slide-enter-to {
  opacity: 1;
  transform: scale(1) translateX(0);
}
.sliderk-enter-active {
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-delay: 0.7s;
}
.sliderk-leave-active {
  transition: all 0.8s linear;
}
.sliderk-leave-to {
  opacity: 0;
  transform: translateX(10%);
}
.sliderk-enter {
  opacity: 0;
  transform: translateX(-10%);
}
.sliderk-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-title-enter-active {
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-delay: 0.7s;
}
.slide-title-leave-active {
  transition: all 0.01s linear;
  transition-delay: 0.7s;
}
.slide-title-leave-to {
  opacity: 0;
}
.slide-title-enter {
  opacity: 0;
  transform: translateX(7%);
}
.slide-title-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.revealer-animated {
  animation-name: slide-in, slide-out;
  animation-duration: 800ms, 800ms;
  animation-delay: 0ms, 800ms; /* add this */
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1),
    cubic-bezier(0.215, 0.61, 0.355, 1);
}

.revealer-title-animated {
  animation-name: slide-in-title, slide-out-title;
  animation-duration: 800ms, 800ms;
  animation-delay: 0ms, 800ms; /* add this */
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1),
    cubic-bezier(0.215, 0.61, 0.355, 1);
}
.revealer-title-description {
  animation-name: hide-desc, show-desc;
  animation-duration: 800ms, 800ms;
  animation-delay: 0ms, 800ms; /* add this */
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1),
    cubic-bezier(0.215, 0.61, 0.355, 1);
}
@keyframes hide-desc {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(7%);
  }
}
@keyframes show-desc {
  0% {
    opacity: 0;
    transform: translateX(7%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in {
  0% {
    transform: translateX(-101%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slide-out {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(101%);
  }
}
@keyframes slide-in-title {
  0% {
    transform: translateX(101%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slide-out-title {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-101%);
  }
}
a {
  margin: 0;
  padding: 0;
  color: $text_color;
  text-decoration: none;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}
@media (max-width: 1450px) {
  .slider-box {
    height: 450px;
  }
  .revealer-box {
    top: -450px;
    height: 450px;
  }
  .revealer-title-box {
    top: -140px;
    height: 140px;
  }
  .slider-name {
    right: -38px;
    font-size: 26px;
  }
  .slider-bullets {
    width: 200px;
    font-size: 16px;
    line-height: 16px;
  }
  .link {
    margin: 8px;
  }
}
</style>
