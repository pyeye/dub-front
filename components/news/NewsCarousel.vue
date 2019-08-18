<template>
  <div class="slider">
    <div class="slider-box">
      
      <transition-group
        name="slide"
        tag="div" 
        class="transition-box "
        @before-leave="beforeLeaveHandler"
        @after-enter="afterEnterHandler"
      >
        <div
          class="transition-item"
          v-for="number in [activeArticleIndex]"
          :key="number"
          :style="getBgImage(activeArticle.image.src)"
        >
          <div class="article">
            <div class="article-cover"></div>
              <div class="active-article">
                <div class="text-secondary">
                  <div class="category">{{ activeArticle.category.name }}</div>
                  <div class="date">
                    {{ activeArticle.date_created.day }}
                    {{ activeArticle.date_created.month }}
                  </div>
                </div>
                <nuxt-link class="nuxt-link" :to="`/news/${activeArticle.pk}`">
                  <span class="article-title"><span class="bullet">{{ activeArticle.title }}</span></span>
                </nuxt-link>
              </div>
              <div class="flex"></div>
              <div class="slider-bullets">
                <span class="link" v-for="(article, index) in news" :key="article.pk">
                  <span 
                    class="bullet"
                    :class="{'actiive-bullet': activeArticle.pk === article.pk}"
                    @click="setSlide(index)"
                  >
                    {{ article.title }}
                  </span>
                </span>
              </div>
          </div>
        </div>
      </transition-group>

      <div class="slider-name">
        <nuxt-link class="news-link" to="/news"> новости </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsCarousel',
  props: {
    news: {
      type: Array,
    },
  },
  data: () => ({
    activeArticleIndex: 0,
    duration: 8000,
    sliderInterval: null,
    isAnimated: false,
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  computed: {
    activeArticle() {
      return this.news[Math.abs(this.activeArticleIndex) % this.news.length];
    },
  },
  mounted() {
    this.startSlider();
  },
  methods: {
    getBgImage(imageUrl) {
      return `background-image: url(${imageUrl});`;
    },
    setSlide(index) {
      if (this.isAnimated) {
        return;
      }
      this.activeArticleIndex = index;
      this.restartSlider();
    },
    nextSlide() {
      this.activeArticleIndex = this.activeArticleIndex + 1;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.slider {
  position: relative;
  width: 100%;
  height: 100px;
  z-index: 5;
}
.slider-box {
  position: relative;
  width: 25%;
  margin: 0 5% 0 auto;
  height: 500px;
  transform: translateY(-55%);
  border-radius: 2px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
.transition-box {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 2px;
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
  border-radius: 2px;
}
.article {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.article-cover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
  opacity: 0.7;
  border-radius: 2px;
}
.active-article {
  position: relative;
  z-index: 1;
  padding: 16px;
  color: $body_color;
}
a {
  margin: 0;
  padding: 0;
  color: $body_color;
  text-decoration: none;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}
.article-title {
  font-size: 20px;
  line-height: 22px;
  letter-spacing: 0.15px;
  font-weight: 600;
  font-family: $accent_font;
  text-decoration: none;
}
.text-secondary {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.15px;
  font-weight: 400;
  font-family: $accent_font;
  opacity: 0.7;
  margin-bottom: 8px;
  .date {
    margin-left: 8px;
    padding-bottom: 4px;
  }
  .category {
    padding-bottom: 4px;
    margin-right: 4px;
  }
}
.flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
}
.slider-bullets {
  z-index: 1;
  position: related;
  width: 100%;
  margin: 16px;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.15px;
  font-weight: 400;
  font-family: $accent_font;
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
  margin: 4px;
}
.bullet {
  cursor: pointer;
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
  top: 30%;
  right: -42px;
  font-size: 28px;
  letter-spacing: 3px;
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
.news-link {
  color: $text_color;
}
.slide-enter-active {
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.slide-leave-active {
  transition: all 0.6s linear;
}
.slide-leave-to {
  opacity: 0;
}
.slide-enter {
  opacity: 0;
}
.slide-enter-to {
  opacity: 1;
}
@media (max-width: 1450px) {
  .slider-box {
    height: 400px;
  }
  .slider-name {
    right: -34px;
    font-size: 24px;
  }
}
</style>
