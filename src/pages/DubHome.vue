<template>

  <div class="home">
    <div class="sales-news" v-if="banners.length > 1">
      <swiper :options="swiperOption" class="sales">
        <swiper-slide v-for="banner in banners" :key="banner.pk"><div class="slide" :style="`background-image: url(${banner.image.original});`"></div> </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="news">
        <div class="news-row" v-for="article in newsFeed" :key="article.pk">
          <dub-news-list-item class="news-item" :article="article"></dub-news-list-item>
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
      <dub-home-poster-item 
          class="poster-item" 
          v-for="poster in posters" 
          :key="poster.pk" 
          :poster="poster">
      </dub-home-poster-item>
    </div>
    
    
      <div class="title">Популярное</div>
      <swiper :options="swiperTagOption" class="best">
        <swiper-slide v-for="best in bestsellers" :key="best.pk" class="best-slide">
            <dub-home-bestsellers-item class="grid-cell" :product="best" :category="best.category"></dub-home-bestsellers-item>
        </swiper-slide>
      </swiper>
  </div>

</template>

<script>

import DubCatalogListItem from '@/components/catalog/DubCatalogListItem';
import DubNewsListItem from '@/components/news/DubNewsListItem';
import DubHomeBestsellersItem from '@/components/home/DubHomeBestsellersItem';
import DubHomePosterItem from '@/components/home/DubHomePosterItem';

export default {
  name: 'DubHome',
  components: {
    DubCatalogListItem,
    DubNewsListItem,
    DubHomeBestsellersItem,
    DubHomePosterItem,
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
  computed: {
    newsFeed() {
      const news = this.$store.getters['home/getNewsFeed'];

      if (news.length === 0) {
        this.$store.dispatch('home/requestNewsFeed');
      }

      return news;
    },
    banners() {
      const banners = this.$store.getters['home/getBanners'];

      if (banners.length === 0) {
        this.$store.dispatch('home/requestBanners');
      }

      return banners;
    },
    posters() {
      const posters = this.$store.getters['home/getPosters'];

      if (posters.length === 0) {
        this.$store.dispatch('home/requestPosters');
      }

      return posters;
    },
    bestsellers() {
      const bestsellers = this.$store.getters['home/getBestsellers'];

      if (bestsellers.length === 0) {
        this.$store.dispatch('home/requestBestsellers');
      }

      return bestsellers;
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
   @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    margin: 24px 0;
    height: 500px;
    font-size: 20px;
    
}


.sales {
  width: 70%;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);

}

.slide {
  position: relative;
  height: 100%;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
   background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.posters {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    margin-bottom: 24px;

    .poster-item {
      margin-right: 16px;
    }

    .poster-item:last-child {
      margin-right: 0;
    }
}



.news {
   @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
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
      @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    

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
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      
      transition: box-shadow .25s ease;
 }

.title {
width: 100%;
  padding: 16px 0;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 40px;
    font-family: 'Roboto', sans-serif;
    opacity: .9;
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
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    transition: box-shadow .25s ease, transform .25s ease;
}

.cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #000;
    transition: opacity .25s ease;
    opacity: .6;
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
    font-size: 24px;
    
    letter-spacing: .02em;
    line-height: 30px;
    font-family: 'Roboto', sans-serif; 
    padding: 48px 24px;
    opacity: 1;
    transition: opacity .25s ease;

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