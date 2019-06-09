<template>
  <div class="home">
    <div class="sales-news">
      <div v-swiper:mySwipe="swiperOption" class="sales">
        <div class="swiper-wrapper">
          <div v-for="banner in banners" :key="banner.pk" class="swiper-slide">
            <div :style="`background-image: url(${banner.image});`" class="slide"/>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets"/>
      </div>
      <div class="news">
        <div v-for="article in news" :key="article.pk" class="news-row">
          <news-item :article="article" class="news-item"/>
        </div>
      </div>
    </div>
    <!--
    <div class="about" :style="'background-image: url(http://houseofdubbel.tk/img/static/tom-sodoge-61701.jpg);'">
      <div class="cover"></div>
      <div class="cover-text">
        <div class="cover-title">House of Dubbel это:</div>
        <div>Более 70 000 напитков</div>
        <div>Лучшие цены</div>
        <div>Эксклюзивные коллекции</div>
        <div>Внимание и забота о клиентах</div>
      </div>
    </div>
    -->
    <div class="title">Подборки от House of Dubbel</div>
    <div class="posters">
      <poster-item v-for="poster in posters" class="poster-item" :key="poster.pk" :poster="poster"/>
    </div>


    <div class="title">Популярное</div>
    <div v-swiper:best="swiperTagOption" class="best">
      <div class="swiper-wrapper">
        <div v-for="best in bestsellers" class="swiper-slide best-slide" :key="best.pk">
          <bestsellers-item :product="best" class="grid-cell" :category="best.category"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import CatalogItem from '~/components/catalog/CatalogItem';
import NewsItem from '~/components/news/NewsItem';
import BestsellersItem from '~/components/home/BestsellersItem';
import PosterItem from '~/components/home/PosterItem';

export default {
  name: 'DubHome',
  components: {
    CatalogItem,
    NewsItem,
    BestsellersItem,
    PosterItem,
  },
  data: () => ({
    swiperOption: {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    },
    swiperTagOption: {
      slidesPerView: 'auto',
      spaceBetween: 15,
      freeMode: true,
      speed: 2000,
    },
    swiperNewOption: {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 2000,
    },
  }),
  async fetch({ store }) {
    await Promise.all([
      store.dispatch('home/requestNews'),
      store.dispatch('home/requestBanners'),
      store.dispatch('home/requestPosters'),
      store.dispatch('home/requestBestsellers'),
    ]);
  },
  computed: mapGetters({
    news: 'home/news',
    banners: 'home/banners',
    posters: 'home/posters',
    bestsellers: 'home/bestsellers',
  }),
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
  margin: 24px 0;
  height: 500px;
  font-size: 20px;
}
.sales {
  width: 70%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
.slide {
  position: relative;
  height: 100%;
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
    ),
    webkit ms
  );
  margin-bottom: 24px;
  .poster-item {
    margin-right: 16px;
  }
  .poster-item:last-child {
    margin-right: 0;
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
    position: relative;
    width: 100%;
    height: 100%;
    margin-bottom: 8px;
  }
  .news-row:last-of-type {
    margin-bottom: 0;
  }
  .column {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );
    .column-item {
      margin-left: 8px;
    }
  }
}
.best {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
}
.best-slide {
  width: 20%;
}
.grid-cell {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease;
}
.title {
  width: 100%;
  padding: 16px 0;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 0.025em;
  line-height: 40px;
  font-family: 'Roboto', sans-serif;
  opacity: 0.9;
  color: $text_color;
}
.bestseller-swiper-item {
  position: relative;
  height: 100%;
}
.about {
  margin-bottom: 24px;
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform: translateY(0);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.6;
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
  font-family: 'Roboto', sans-serif;
  padding: 48px 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
  .cover-title {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    margin-bottom: 16px;
  }
}
@media (max-width: 1450px) {
  .home {
    width: 85%;
  }
  .sales-news {
    height: 400px;
  }
  .about {
    height: 350px;
  }
}
</style>
