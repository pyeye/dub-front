<template>
  <div class="news-detail">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      </div>
    </div>
      <div class="description">
        <div class="description-title">
          {{ article.title }}
        </div>
        <div class="description-box">
          <div class="description-info">
            <div class="description-category">
              <nuxt-link class="link" :to="`/news?filter=${article.category.pk}`">
                <span class="category">{{ article.category.name }}</span>
            </nuxt-link>
            </div>
            <div class="description-date">
              {{ article.date_created.day }} {{ article.date_created.month }} {{ article.date_created.year }}
            </div>
          </div>
          <div class="description-text" v-html="markdown(article.description)"></div>
        </div>
      </div>
      <div class="hero" :style="'background-image: url('+ article.image.src +');'"></div>
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
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
}
.detail-content {
  position: relative;
  margin: 24px auto;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.header {
  grid-column: main-start / main-end;
  grid-row: 1;
}
.title-row {
  margin: 24px 0;
  width: 100%;
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.hero {
  grid-column: 9 / full-end;
  grid-row: 2;
  height: 800px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12),
    0 1px 8px 0 rgba(0, 0, 0, 0.2);
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
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-family: $accent_font;
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
  margin-top: 48px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.description {
  grid-column: main-start / 9;
  grid-row: 2;
}
.description-title {
  padding: 16px 0;
  font-family: $accent_font;
  color: $text_color;
  font-size: 42px;
  line-height: 50px;
  font-weight: 300;
  letter-spacing: 0px;
}
.description-box {
  background-color: $upper_layer_color;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  min-height: 300px;
}
.link {
  text-decoration: none;
}
.description-info {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  padding: 24px 0;
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.category {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  &:hover {
    background-size: 100% 100%;
  }
}
.description-text {
  padding: 16px 25% 24px 24px;
  opacity: 0.8;
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
  .description-title {
    padding: 16px 0;
  }
  .description-info {
    padding: 24px 0 8px 0;
  }
  .description-text {
    padding: 16px 0 24px 0;
  }
  .hero {
    height: 600px;
  }
}
</style>
