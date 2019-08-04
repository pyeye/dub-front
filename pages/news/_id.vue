<template>
  <div class="news-detail">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
        <div class="title">{{ article.title }}</div>
        <div class="sub-title">
          <nuxt-link :to="`/news?filter=${article.category.pk}`">
              <div class="category">{{ article.category.name }}</div>
          </nuxt-link>
          <div class="date">
            {{ article.date_created.day }}
            {{ article.date_created.month }}
            {{ article.date_created.year }}
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="description">
        <div class="description-text" v-html="markdown(article.description)"></div>
      </div>
      <div class="hero" :style="'background-image: url('+ article.image.src +');'"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'DubNewsDetail',
  async asyncData({ store, params, app }) {
    const { id } = params;
    let article = store.getters['news/article'](id);
    if (!article) {
      const url = `news/${id}/`;
      const { data } = await app.$api.get(url);
      article = data;
    }
    return {
      article,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Новости', link: '/news' },
        { label: this.article.title, link: '' },
      ];
    },
  },
  methods: {
    markdown(description) {
      if (!description) {
        return '';
      }
      const renderer = new marked.Renderer();
      renderer.image = (href, title, text) => {
        let out = `<img style="max-width:100%" src="${href}" alt="${text}"`;
        if (title) {
          out += `title="${title}"`;
        }
        out += '/>';
        return out;
      };
      return marked(description, {
        renderer,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-detail {
  position: relative;
  width: 80%;
  min-height: 800px;
  margin: 0 auto;
}
.detail-content {
  position: relative;
  margin: 24px auto;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.header {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.title-row {
  margin: 24px 0;
  width: 70%;
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.title {
  margin: 14px 0;
  font-size: 36px;
  letter-spacing: 5px;
  margin-right: -5px;
  line-height: 40px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
  text-align: center;
}
.sub-title {
  font-size: 14px;
  letter-spacing: 0.05em;
  line-height: 16px;
  font-family: 'Roboto', sans-serif;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
  text-align: center;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.hero {
  position: absolute;
  right: -5.5%;
  width: 70%;
  height: 600px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
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
      flex-direction: column,
    ),
    webkit ms
  );
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  color: #fafafa;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-family: 'Roboto', sans-serif;
  padding: 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
  .text-secondary {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: center,
      ),
      webkit ms
    );
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    font-weight: 400;
    opacity: 0.85;
  }
}
.category {
  color: $text_color;
  margin-right: 16px;
}
.content {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.description {
  width: 35%;
  margin-left: 5%;
  transform: translateY(20%);
  background-color: $upper_layer_color;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  z-index: 1;
}
.description-text {
  padding: 24px;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.15px;
  font-weight: 400;
  color: $text_color;
  opacity: 0.8;
}
.description-text::first-letter {
  font-size: 24px;
  font-weight: 600;
}
.icon-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  font-weight: 400;
  width: 28px;
  height: 28px;
  color: $body_color;
}
a {
  text-decoration: none;
}
@media (max-width: 1450px) {
  .news-detail {
    width: 90%;
  }
}
</style>
