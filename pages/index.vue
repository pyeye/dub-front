<template>
  <div class="home">
    <div class="home-wrapper">
      <sales-carousel class="lax carousel" data-lax-translate-y="(elh-300) 0, elh -50" :sales="sales">
      </sales-carousel>

      
      
      <!--
      <home-news class="lax" data-lax-translate-y="elh 0, (elh*8) -100" :news="news"></home-news>


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
     -->


    
    <div class="news-wrapper">
      <div class="news-title">Новости</div>
      <span class="news-all-link"><span>Все материалы</span></span>

      <div class="article-first">
        <news-item
          class="poster-item"
          :article="news[0]"
        ></news-item>
      </div>
      <div class="article-second">
        <news-item
          class="poster-item"
          :article="news[1]"
        ></news-item>
      </div>
      <div class="article-third">
        <news-item
          class="poster-item"
          :article="news[2]"
        ></news-item>
      </div>
    </div>

<!--
  <div class="title-row lax" data-lax-translate-y= "vh 200, (vh+600) 0 | speed=1">
      <div class="title">Новости </div>
      <div class="sub-title">от House of Dubbel</div>
    </div>
    <div class="posters">
        <news-item
          class="poster-item first lax"
          data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
          data-lax-translate-x="vh 0, (vh+600) 40 | speed=1"
          :article="news[0]"
        ></news-item>
      
      <news-item
        class="poster-item second lax"
        data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
        data-lax-translate-x="vh 0, (vh+600) 10 | speed=1"
        :article="news[1]"
      ></news-item>

      <news-item
        class="poster-item third lax"
        data-lax-translate-y="vh 200, (vh+600) 0 | speed=1"
        data-lax-translate-x="vh 40, (vh+600) -10 | speed=1"
        :article="news[2]"
      ></news-item>
    </div>
    -->

      <div class="title-row-new">
        <div class="title">Новинки</div>
      </div>

      <div class="grid-new-products">
        <catalog-item
          v-for="product in products"
          :key="product.pk"
          :product="product"
        ></catalog-item>
      </div>

      <div class="collection-hero">
          <div class="title">Коллекции</div>
          <div class="subtitle">от house of dubbel</div>
      </div>

      <div class="collection-wrapper first-collection-wrapper" v-if="collections[0].products">
        
        <div class="collection-description">
          <div class="name">{{collections[0].name}}</div>
          <div class="text">{{collections[0].description}}</div>
          <div class="more-link">все товары коллекции</div>
        </div>
        <div class="collection-products"><catalog-item
          v-for="product in collections[0].products.items.slice(4)"
          :key="product.pk"
          :product="product"
        ></catalog-item></div>
      </div>

      <div class="collection-wrapper second-collection-wrapper" v-if="collections[1].products">
        <div class="collection-description">
          <div class="name">{{collections[1].name}}</div>
          <div class="text">{{collections[1].description}}</div>
          <div class="more-link">все товары коллекции</div>
        </div>
        <div class="collection-products"><catalog-item
          v-for="product in collections[1].products.items.slice(4)"
          :key="product.pk"
          :product="product"
        ></catalog-item></div>
      </div>

      <div class="collection-wrapper third-collection-wrapper" v-if="collections[2].products">
        <div class="collection-description">
          <div class="name">{{collections[2].name}}</div>
          <div class="text">{{collections[2].description}}</div>
          <div class="more-link">все товары коллекции</div>
        </div>
        <div class="collection-products"><catalog-item
          v-for="product in collections[2].products.items.slice(4)"
          :key="product.pk"
          :product="product"
        ></catalog-item></div>
      </div>
    </div>
  </div>

</template>

<script>
import lax from 'lax.js';

import CatalogItem from '~/components/catalog/CatalogItem';
import NewsItem from '~/components/home/NewsItem';
import SalesCarousel from '~/components/sales/SalesCarousel';
import HomeNews from '~/components/home/HomeNews';

export default {
  name: 'DubHome',
  components: {
    CatalogItem,
    NewsItem,
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
    await Promise.all(
      collections.data.map(async collection => {
        const products = await app.$api.get('/products/', {
          params: { collections: collection.pk },
        });
        // eslint-disable-next-line no-param-reassign
        collection.products = products.data;
      })
    );
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
}
.home-wrapper {
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
}
.carousel {
  grid-column: full-start / full-end;
  grid-row: 1;
}
.news-wrapper {
  grid-column: full-start / full-end;
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
  margin: 96px 0;
  .news-title {
    grid-column: main-start / 7;
    grid-row: 1 / 2;
    font-size: 64px;
    font-weight: 300;
    line-height: 64px;
    letter-spacing: 0px;
    margin-bottom: 24px;
  }
  .news-all-link {
    grid-column: 13 / main-end;
    grid-row: 1 / 2;
    align-self: center;
    justify-self: center;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    margin-top: -16px;
    cursor: pointer;
    background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 0.4s ease;
    &:hover {
      background-size: 100% 100%;
    }
  }
  .article-first {
    grid-column: main-start / 7;
    grid-row: 2 / 3;
  }
  .article-second {
    grid-column: 7 / 13;
    grid-row: 1 / 3;
  }
  .article-third {
    grid-column: 13 / main-end;
    grid-row: 2 / 3;
  }
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
  overflow: hidden;
  grid-column: full-start / full-end;
  grid-row: 3;
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
  grid-column: main-start / 6;
  grid-row: 3;
}
.title-row-new {
  position: relative;
  grid-column: main-start / 8;
  grid-row: 4;
  .title {
    margin-bottom: 24px;
    font-size: 72px;
    font-weight: 300;
    letter-spacing: -0.64px;
    line-height: 80px;
    font-family: $accent_font;
    color: $text_color;
  }
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
.grid-new-products {
  grid-column: main-start / main-end;
  grid-row: 5;
  display: grid;
  grid-template-columns: repeat(16, [col-start] 1fr);
  grid-gap: 16px;
  padding: 24px 0;
}
.grid-new-products > div:not(.first) {
  grid-column-start: auto;
}
.grid-new-products > div {
  grid-column: col-start 1 / span 4;
}
.grid-new-products > div:not(:nth-child(4n))::after {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  right: -8px;
  top: 0;
  background-color: rgba(40, 40, 40, 0.2);
}
.collection-hero {
  grid-column: main-start / main-end;
  grid-row: 6;
  .title {
    font-size: 72px;
    font-weight: 300;
    letter-spacing: -0.64px;
    line-height: 80px;
    font-family: $accent_font;
    color: $text_color;
  }
  .subtitle {
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0px;
    line-height: 36px;
    font-family: $accent_font;
    color: $text_color;
  }
}
.first-collection-wrapper {
  grid-row: 7;
}
.second-collection-wrapper {
  grid-row: 8;
}
.third-collection-wrapper {
  grid-row: 9;
}
.collection-wrapper {
  grid-column: main-start / main-end;
  display: grid;
  grid-template-columns: repeat(16, [col-start] 1fr);
  grid-gap: 16px;
  align-items: baseline;
  .collection-description {
    grid-column: 1 / 9;
    grid-row: 1;
    position: sticky;
    top: 84px;
    .name {
      font-size: 56px;
      font-weight: 300;
      letter-spacing: -0.64px;
      line-height: 80px;
      font-family: $accent_font;
      color: $text_color;
    }
    .text {
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0px;
    }
    .more-link {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0px;
      line-height: 20px;
    }
  }
  .collection-products {
    grid-column: 9 / -1;
    display: grid;
    grid-template-columns: repeat(8, [col-start] 1fr);
    grid-gap: 16px;
  }
  .collection-products > div:not(.first) {
    grid-column-start: auto;
  }
  .collection-products > div {
    grid-column: col-start 1 / span 4;
  }
  .collection-products > div:not(:nth-child(2n))::after {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    right: -8px;
    top: 0;
    background-color: rgba(40, 40, 40, 0.2);
  }
}

@media (max-width: 1450px) {
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
