<template>
<div class="news-item">
  <nuxt-link :to="`news/${article.pk}`">
    <div class="news-image" :style="`background-image: url(${article.image.src});`"></div>
      <div class="news-text">
          <span class="link"><span class="title">{{ article.title }}</span></span>
          <div class="subtitle">
            <div class="date">{{article.date_updated.day}} {{article.date_updated.month}}</div>
            <div class="category">{{article.category.name}}</div>
          </div>
          <div class="description">{{article.description}}</div>
          <span class="more-link"><span class="more">читать дальше</span></span>
      </div>
  </nuxt-link>
</div>
  

</template>

<script>
export default {
  name: 'NewsItem',
  props: {
    article: {
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
}
.news-image {
  height: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.link {
  text-decoration: none;
}
.more-link {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 20px;
}
.title {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 36px;
  &:hover {
    background-size: 100% 100%;
  }
}
.subtitle {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
    ),
    webkit ms
  );
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 24px;
  .category {
    margin-left: 16px;
  }
}
.description {
  display: block;
  font-size: 16px;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
  margin: 8px 0 -8px 0;
}
.news-text {
  color: $text_color;
  font-size: 28px;
  letter-spacing: -0.012em;
  line-height: 28px;
  font-family: $accent_font;
  padding: 16px 0;
}
.more {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  &:hover {
    background-size: 100% 100%;
  }
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
  .news-image {
    height: 300px;
  }
}
</style>
