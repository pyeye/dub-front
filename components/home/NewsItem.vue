<template>
<div class="news-item">
  <nuxt-link :to="`news/${article.pk}`">
    <img class="news-image" :src="article.image.src" />
    <div class="news-text">
        <span class="link"><span class="title">{{ article.title }}</span></span>
        <div class="subtitle">
          <div class="date">{{article.date_updated.day}} {{article.date_updated.month}}</div>
          <div class="category">{{article.category.name}}</div>
        </div>
        <div class="description">{{article.description}}</div>
        <dub-link :to="`news/${article.pk}`" class="more-link">читать дальше</dub-link>
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
  position: relative;
  width: 100%;
  font-family: $main_font;
}
.news-image {
  object-position: center bottom;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.link {
  text-decoration: none;
}
.more-link {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 20px;
  margin-top: 8px;
}
.title {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  font-size: 32px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 40px;
  font-family: $accent_font;
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
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 24px;
  .category {
    margin-left: 16px;
  }
}
.description {
  display: block;
  font-size: 16px;
  font-weight: 400;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
  margin: 8px 0 -8px 0;
  opacity: 0.7;
}
.news-text {
  color: $text_color;
  font-size: 28px;
  letter-spacing: -0.012em;
  line-height: 28px;
  padding: 16px 0;
}
.more {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  opacity: 0.7;
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
  .title {
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0px;
    line-height: 36px;
  }
  .subtitle {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
