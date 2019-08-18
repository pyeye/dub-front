<template>
  <div class="home">
      <sales-carousel class="lax" data-lax-translate-y="(elh-300) 0, elh -50" :sales="sales"></sales-carousel>

      <home-news class="lax" data-lax-translate-y="elh 0, (elh*8) -100" :news="news"></home-news>
      
      <!--
      <div class="news">
        <div
          v-for="(article, index) in news"
          :key="article.pk" class="news-row"
          :style="`background-image: url(${article.image.src});`"
          :class="{'news-row-first': index === 0}"
        >
          <nuxt-link :to="`news/${article.pk}`">
            <div class="news-cover"></div>
            <div class="news-hover-content">
              <div class="news-cover-text">
                 <span class="article-link"><span class="article-title">{{ article.title }}</span></span>
              </div>
              <div class="news-cover-info">
                <div class="info-category">{{article.category.name}}</div>
                <div class="info-date">{{article.date_updated.day}} {{article.date_updated.month}}</div>
              </div>
            </div>
            <div class="news-relative-text">{{article.title}}</div>
          </nuxt-link>
        </div>
        <div class="news-row base-news">
          <nuxt-link to="news">
            <div class="news-cover"></div>
             <div class="news-hover-content">
              <div class="news-cover-text">
                <span class="article-link"><span class="article-title">Все новости</span></span>
              </div>
             </div>
            <div class="news-relative-text">Все новости</div>
          </nuxt-link>
        </div>
      </div>
      -->
    <div class="about-row">
      <div
        class="about-text lax"
        data-lax-translate-y="(elh-300) 150, (elh+300) 0"
      >
        <div class="about-text-logo">
          <img src="~/assets/images/dubbel_text.png" class="img-logo">
        </div>
        <div class="about-text-row">Тысячи алкогольных напитков</div>
        <div class="about-text-row">Лучшие цены</div>
        <div class="about-text-row">Эксклюзивные коллекции</div>
        <div class="about-text-row">Внимание и забота о клиентах</div>
      </div>
      <div
        class="about base-news lax"
        data-lax-translate-y="(elh-300) 150, (elh+150) 0"
        
      >
      <div class="cover"></div>
      </div>
    </div>


    
    <div class="title-row lax" data-lax-translate-y= "vh 200, (vh+600) 0 | speed=1">
      <div class="title">Коллекции </div>
      <div class="sub-title">от House of Dubbel</div>
    </div>


    <div class="posters">
        <poster-item
          class="poster-item first lax"
          data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
          data-lax-translate-x="vh 0, (vh+600) 40 | speed=1"
          :poster="collections[0]"
        ></poster-item>
      
      <poster-item
        class="poster-item second lax"
        data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
        data-lax-translate-x="vh 0, (vh+600) 10 | speed=1"
        :poster="collections[1]"
      ></poster-item>

      <poster-item
        class="poster-item third lax"
        data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
        data-lax-translate-x="vh 40, (vh+600) -10 | speed=1"
        :poster="collections[2]"
      ></poster-item>
    </div>

    <div class="title-row lax" data-lax-translate-y= "(vh*2) 200, (vh*2+600) 0 | speed=1">
      <div class="title">Новинки</div>
    </div>

    <div class="grid lax" data-lax-translate-y= "(vh*2) 200, (vh*2+600) 0 | speed=1">
      <catalog-item
        class="grid-cell"
        v-for="product in products"
        :key="product.pk"
        :product="product"
      ></catalog-item>
    </div>
  </div>

</template>

<script>
import lax from 'lax.js';

import CatalogItem from '~/components/catalog/CatalogItem';
import PosterItem from '~/components/home/PosterItem';
import SalesCarousel from '~/components/sales/SalesCarousel';
import HomeNews from '~/components/home/HomeNews';

export default {
  name: 'DubHome',
  components: {
    CatalogItem,
    PosterItem,
    SalesCarousel,
    HomeNews,
  },
  data: () => ({
    slider: {
      type: 'carousel',
      perView: 1,
      autoplay: 5000,
      animationDuration: 2000,
    },
    loaded: false,
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  async asyncData(context) {
    const { app } = context;
    const [news, sales, collections, newProducts] = await Promise.all([
      app.$api.get('/home/news/'),
      app.$api.get('/home/sales/'),
      app.$api.get('/home/collections/'),
      app.$api.get('/home/new/', { params: { sort: 'created_at-desc' } }),
    ]);
    return {
      news: news.data,
      sales: sales.data,
      collections: collections.data,
      products: newProducts.data,
    };
  },
  mounted() {
    lax.setup();

    document.addEventListener(
      'scroll',
      () => {
        lax.update(window.scrollY);
      },
      false
    );
  },
  methods: {
    getBgImage(imageUrl) {
      return `background-image: url(${this.baseUrl}${imageUrl});`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
}
.sales-news {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  margin: 48px 0;
  height: 420px;
  font-size: 20px;
}
.sales {
  width: 70%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.slide {
  position: relative;
  height: 420px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.posters {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
      align-items: center,
    ),
    webkit ms
  );
  margin-bottom: 164px;
  .poster-item {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
  .first {
    width: 27%;
    height: 550px;
  }
  .second {
    width: 35%;
    height: 700px;
  }
  .third {
    width: 30%;
    height: 600px;
  }
}
.news {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  position: relative;
  width: 30%;
  margin-left: 8px;
  .news-row {
    cursor: pointer;
    position: relative;
    width: 100%;
    margin-bottom: 4px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    transition: flex 0.7s ease;
    flex: 1;
    &:hover {
      flex: 10;
      .article-title {
        background-size: 100% 100%;
      }
    }
    &:hover .news-relative-text {
      opacity: 0;
    }
    &:hover .news-hover-content {
      opacity: 1;
    }
  }
  .news-row-first {
    flex: 3;
  }
  .news-row:last-of-type {
    margin-bottom: 0;
  }
}
.article-link {
  text-decoration: none;
}
.article-title {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $primary_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
}
.title-row {
  margin: 48px 0;
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
    ),
    webkit ms
  );
}
.title {
  font-size: 42px;
  letter-spacing: 20px;
  margin-right: -20px;
  line-height: 50px;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.sub-title {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 16px;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.about {
  margin: 64px 0 64px 0;
  border-radius: 2px;
  position: absolute;
  width: 100%;
  height: 650px;
  z-index: 1;
  top: 0;
  right: -12.5%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-image: url('http://mydubbelsite.ru/img/static/all_news.jpg');
}
.about-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  position: relative;
  margin: 36px 0 164px 0;
  min-height: 800px;
}
.about-text {
  position: absolute;
  padding: 36px;
  top: -10%;
  left: 10%;
  width: 22%;
  height: 400px;
  z-index: 10;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  background-color: #fafafa;
}
.about-text-logo {
  position: relative;
  margin: 0 auto 24px auto;
  width: 60%;
  opacity: 0.8;
}
.img-logo {
  position: relative;
  width: 100%;
}
.about-text-row {
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
  margin: 16px 8px;
  opacity: 0.7;
  font-family: $accent_font;
  color: $text_color;
}
.icon-link {
  width: 18px;
  height: 18px;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.5;
}
.news-hover-content {
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  position: absolute;
  transition: opacity 0.6s ease;
}
.news-cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.7;
}
.news-cover-text {
  position: relative;
  padding: 8px;
  z-index: 1;
  color: $primary_color;
  font-size: 18px;
  font-family: $accent_font;
}
.news-relative-text {
  transition: opacity 0.6s ease;
  opacity: 1;
  position: relative;
  padding: 8px;
  z-index: 1;
  color: #fafafa;
  font-size: 18px;
  font-family: $accent_font;
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
  font-size: 24px;
  letter-spacing: 0.02em;
  line-height: 30px;
  font-family: $accent_font;
  padding: 48px 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
}
.cover-title {
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  margin-bottom: 16px;
  opacity: 0.7;
}
.cover-content {
  position: absolute;
}
.news-cover-info {
  padding: 8px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.info-category {
  border-bottom: 2px solid $primary_color;
  color: #fafafa;
  z-index: 1;
  padding-bottom: 4px;
  font-size: 14px;
}
.info-date {
  color: #fafafa;
  z-index: 1;
  padding: 0 0 4px 12px;
  font-size: 14px;
}
a {
  text-decoration: none;
}
.grid {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
      justify-content: center,
    ),
    webkit ms
  );
  width: 100%;
  .grid-cell {
    @include prefix(
      (
        flex: 1 1,
        flex-basis: 19.2%,
      ),
      webkit ms
    );
    max-width: 19.2%;
    background-color: $upper_layer_color;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    padding: 24px;
    margin: 0 8px 32px 8px;
    transition: box-shadow 0.25s ease;
    &:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    }
  }
}
@media (max-width: 1450px) {
  .home {
    width: 90%;
  }
  .sales-news {
    height: 420px;
  }
  .about {
    margin: 64px 0 64px 20%;
    width: 80%;
    height: 450px;
    right: -5.5%;
  }
  .about-text {
    padding: 36px;
    top: -10%;
    left: 10%;
    width: 20%;
    height: 300px;
  }
  .about-row {
    min-height: 500px;
  }
  .posters {
    .first {
      width: 27%;
      height: 400px;
    }
    .second {
      width: 35%;
      height: 550px;
    }
    .third {
      width: 30%;
      height: 450px;
    }
  }
}
</style>
