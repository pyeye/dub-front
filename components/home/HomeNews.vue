<template>
  <div class="slider">
    <div class="slider-box">
      <news-item :article="mainArticle">
        <div slot="bullets" class="slider-bullets">
          <div class="bullet" v-for="article in restArticles" :key="article.pk">
            <div class="bullet-text-secondary">
              <div class="category">{{ article.category.name }}</div>
              <div class="date">
                {{ article.date_created.day }}
                {{ article.date_created.month }}
              </div>
            </div>
            <nuxt-link class="nuxt-link" :to="`/news/${article.pk}`">
              <span class="bullet-link">
                <span class="bullet-title">{{ article.title }}</span>
              </span>
            </nuxt-link>
          </div>
        </div>
      </news-item>

      <div class="slider-name">
        <nuxt-link class="news-link" to="/news"> новости </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import NewsItem from '~/components/news/NewsItem';

export default {
  name: 'HomeNews',
  components: {
    NewsItem,
  },
  props: {
    news: {
      type: Array,
    },
  },
  computed: {
    mainArticle() {
      const [article] = this.news;
      return article;
    },
    restArticles() {
      // eslint-disable-next-line no-unused-vars
      const [firstArticle, ...restArticles] = this.news;
      return restArticles;
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
  height: 400px;
  transform: translateY(-55%);
  border-radius: 2px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
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

.slider-name {
  position: absolute;
  top: 30%;
  right: -34px;
  font-size: 24px;
  letter-spacing: 3px;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
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
.slider-bullets {
  z-index: 1;
  position: relative;
  margin: 16px;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0.15px;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
  color: #eee;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.bullet {
  margin-bottom: 16px;
}
.bullet-link {
  text-decoration: none;
}
.bullet-title {
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
.bullet-text-secondary {
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
  font-family: 'Roboto', sans-serif;
  opacity: 0.7;
  .date {
    margin-left: 8px;
    padding-bottom: 4px;
  }
  .category {
    padding-bottom: 4px;
    margin-right: 4px;
  }
}
</style>
