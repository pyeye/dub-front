<template>
  <div v-if="poster" class="news-item" :style="`background-image: url(${getAbsoluteUrl(poster.image.src)});`">
    <nuxt-link :to="`collections/${poster.pk}`">
      <div class="cover"></div>
      <div class="cover-text">
          <span class="link"><span class="title">{{ poster.name }}</span></span>
          
      </div>
    </nuxt-link>
  </div>

</template>

<script>
export default {
  name: 'PosterItem',
  props: {
    poster: {
      type: Object,
    },
  },
  data: () => ({
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  methods: {
    getAbsoluteUrl(imageUrl) {
      return this.baseUrl + imageUrl;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-item {
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform: translateY(0);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover {
    .title {
      background-size: 100% 100%;
    }
    .icon-link {
      opacity: 1;
    }
  }
}
.link {
  text-decoration: none;
}
.title {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $primary_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.65;
}
.cover-text {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  color: #fafafa;
  font-size: 28px;
  letter-spacing: -0.012em;
  line-height: 28px;
  font-family: $accent_font;
  padding: 24px;
  opacity: 1;
  transition: color 0.25s ease;
}
.icon-link {
  width: 24px;
  height: 24px;
  opacity: 0;
  transition: opacity 0.25s ease;
}
a {
  text-decoration: none;
}
@media (max-width: 1450px) {
  .news-item {
    height: 300px;
  }
}
</style>
