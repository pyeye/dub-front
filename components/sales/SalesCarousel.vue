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
            <div class="transition-wrapper">
              <span class="slider-title-text">
          <span class="underline">
            <nuxt-link  :to="`/sales/${activeSale.pk}`">{{ activeSale.name }}</nuxt-link>
            
          </span>
        </span>
        <div class="slider-title-description">
          {{ activeSale.description }}
        </div>
        
        <div class="slider-pagination">
          <div class="pagination-link">
          </div>
          <div class="pagination-bullets">
            <span
              class="pagination-bullet"
              :class="{'pagination-bullet-active': index === realSaleIndex}" 
              v-for="(sale, index) in sales" :key="index"
              @click="setActiveSale(index)">
              0{{index + 1}}
            </span>
          </div>
        </div>
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
    manualNextSlide() {
      this.nextSlide();
      this.restartSlider();
    },
    manualPrevSlide() {
      this.prevSlide();
      this.restartSlider();
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
    setActiveSale(index) {
      this.stopSlider();
      this.activeSaleIndex = index;
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
  margin: 48px 0 48px 0;
  font-size: 164px;
  color: $overlay_color;
  font-weight: 300;
  line-height: 164px;
  height: 164px;
  letter-spacing: 16px;
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
  grid-column: full-start / 7;
  grid-row: 2;
  display: grid;
  grid-template-columns: [full-start] minmax(16px, 1fr) [main-start] repeat(
      5,
      [col-start] minmax(8px, 100px)
    );
  grid-column-gap: 24px;
  align-items: start;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
}

.slider-title-overlay {
  grid-column: full-start / -1;
  grid-row: 1;
  background-color: $overlay_color;
  position: relative;
  height: 100%;
  margin-top: 48px;
  z-index: 3;
}

.transition-wrapper {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}

.slider-title {
  grid-column: 2 / -1;
  grid-row: 1;
  position: relative;
  height: 350px;
  padding-right: 24px;
  z-index: 3;
}

.slider-title-text {
  position: relative;
  font-size: 64px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 64px;
  font-family: $accent_font;
  margin-right: 24px;
}

.slider-title-description {
  position: relative;
  margin: 32px 24px 32px 0;
  font-size: 20px;
  font-weight: 300;
  line-height: 28px;
  letter-spacing: 0px;
  color: $secondary_text_color;
}

.more-button {
  position: relative;
  align-self: flex-start;
  margin-left: 4px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.16px;
  text-transform: uppercase;
}

.slider-pagination {
  position: absolute;
  bottom: -24px;
  right: 24px;
  margin: 16px 0;
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
      align-items: center,
    ),
    webkit ms
  );
  .pagination-link {
    font-size: 20px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0px;
  }
  .pagination-bullet {
    margin-left: 8px;
    opacity: 0.4;
    cursor: pointer;
  }
  .pagination-bullet-active {
    opacity: 1;
  }
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
  grid-column: 6 / full-end;
  grid-row: 2;
  height: 750px;
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
  top: -750px;
  height: 750px;
  width: 100%;
}
.revealer-title-box {
  position: relative;
  overflow: hidden;
  top: -164px;
  height: 164px;
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
  .slider-title-wrapper {
    grid-column: full-start / 7;
    margin-top: -48px;
  }
  .slider-box {
    height: 550px;
  }
  .slider-header {
    margin: 32px 0;
    font-size: 106px;
    line-height: 106px;
    height: 106px;
    letter-spacing: 8px;
  }
  .revealer-box {
    top: -550px;
    height: 550px;
  }
  .revealer-title-box {
    top: -106px;
    height: 106px;
  }
  .lider-title {
    padding-right: 16px;
  }
  .slider-title {
    height: 300px;
    padding-right: 24px;
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
  .slider-pagination {
    font-size: 28px;
  }
  .link {
    margin: 8px;
  }
  .slider-title-overlay {
    margin-top: 32px;
  }
  .slider-title-text {
    font-size: 42px;
    line-height: 42px;
  }
  .slider-title-description {
    margin: 24px 16px 24px 0;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0px;
  }

  .more-button {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: -0.16px;
  }

  .slider-pagination {
    bottom: -16px;
    right: 16px;
    margin: 8px 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 36px;
    letter-spacing: 0px;

    .pagination-link {
      font-size: 20px;
      line-height: 26px;
      letter-spacing: 0px;
    }
    .pagination-bullet {
      margin-left: 8px;
    }
  }
}
</style>
