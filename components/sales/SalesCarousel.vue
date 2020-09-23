<template>
  <div class="slider">
    
    <div class="slider-title" v-response.fast>
      <nuxt-link class="link-title" :to="`/sales/${activeSale.pk}`">
        <div class="slider-title-box">
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
      </nuxt-link>
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

      <div class="slider-bullets-reveal">
        <div class="slider-bullets">
          <span class="link" v-for="(sale, index) in sales" :key="sale.pk">
            <span 
              class="bullet"
              :class="{'actiive-bullet': activeSale.pk === sale.pk}"
              @click="setSlide(index)"
            >
              {{ sale.name }}
            </span>
          </span>
        </div>
      </div>

      <div class="slider-name">
        <nuxt-link to="/sales/catalog">акции</nuxt-link>
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
      return this.sales[Math.abs(this.activeSaleIndex) % this.sales.length];
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
  width: 100%;
  margin-top: 36px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.slider-title {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  width: 87%;
  margin-left: 25%;
  font-size: 80px;
  letter-spacing: 2px;
  line-height: 80px;
  height: 80px;
  margin-bottom: 8px;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.slider-title-box {
  position: relative;
  width: 100%;
  height: 100%;
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
  width: 95%;
  height: 600px;
  margin-left: -13%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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
  background-color: #ddd;
  transform: translateX(-101%);
  z-index: 4;
}
.revealer-title {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #ddd;
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
    width: 85%;
    height: 450px;
    margin-left: -6%;
  }
  .revealer-box {
    top: -450px;
    height: 450px;
  }
  .slider-title {
    width: 85%;
  }
  .slider-title {
    width: 85%;
    margin-left: 20%;
    font-size: 70px;
    letter-spacing: 2px;
    line-height: 70px;
    height: 70px;
  }
  .revealer-title-box {
    top: -70px;
    height: 70px;
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
