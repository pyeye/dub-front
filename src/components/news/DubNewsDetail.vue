<template>
  <div class="news-detail">
     <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="detail-content">
   
      <div class="hero" :style="'background-image: url('+ article.image.original +');'">
        <div class="cover"></div>
        <div class="cover-text">
          
          <div class="title">{{ article.title }}</div>
          <div class="text-secondary">
            <div class="date">{{ article.date.day }} {{ article.date.month }} {{ article.date.year }}г.</div>
            <router-link :to="`/news?filter=${article.category.code}`"><div class="category">{{ article.category.name }}</div></router-link>
          </div>

        </div>    
      </div>
      <div class="description" v-html="markdown(article.description)"></div>
  </div>
  </div>
</template>

<script>
import request from '@/request/index';
import marked from 'marked';

export default {
  name: 'DubNewsDetail',
  data: () => ({
    articleFromRequest: { image: {}, date: {}, category: {} },
  }),
  computed: {
    articleFromState() {
      const id = this.$route.params.id;
      const article = this.$store.getters['news/detail'](id);

      if (!article) {
        this.getArticleFromRequest(id);
        return null;
      }

      return article;
    },
    article() {
      return this.articleFromState || this.articleFromRequest;
    },
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Новости', link: '/news' },
        { label: this.article.title, link: '' }];
    },
  },
  methods: {
    getArticleFromRequest(id) {
      const url = `news/${id}/`;
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      request.get(url).then((response) => {
        const article = response.data;
        let date = new Date(article.updated_at);
        date = date.toLocaleString('ru', options).split(/ |,|\./g);
        article.date = {
          weekday: date[0],
          year: date[4],
          day: date[2],
          month: date[3],
        };
        this.articleFromRequest = article;
      });
    },
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
    margin: 0 auto;

}

.detail-content {
    position: relative;
     margin: 24px auto;
     background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
}

.hero {
    position: relative;
    width: 100%;
    height: 300px;
     background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #000;
    transition: opacity .25s ease;
    opacity: .65;
}

.cover-text {
   @include prefix((
     display: flex,
     flex-direction: column,
   ), webkit ms);
   position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    color: #fafafa;
    font-size: 36px;
    font-weight: 600;
    letter-spacing: .02em;
    line-height: 24px;
    font-family: 'Roboto', sans-serif; 
    padding: 24px;
    opacity: 1;
    transition: opacity .25s ease;

    .text-secondary {
        @include prefix((
          display: flex,
          flex-direction: row,
          align-items: center,
        ), webkit ms);
        font-size: 16px;
        line-height: 16px;
        margin-top: 16px;
        font-weight: 400;
        opacity: .85;

        .date {
            margin-right: 16px;
            padding-bottom: 4px;
            
        }

        .category {
           border-bottom: 2px solid $primary_color;
            color: $body_color;
            padding-bottom: 4px;
            font-size: 1em;
            letter-spacing: .2px;
        }
    }
}


.description {
  padding: 24px;
  font-size: 14px;
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
     width: 85%;
}
}




</style>
