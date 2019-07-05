<template>
  <div>
    <div class="watched-slider">
      <hooper
        :itemsToShow="hooper.itemsToShow"
        :infiniteScroll="hooper.infiniteScroll"
        :autoPlay="hooper.autoPlay"
        :playSpeed="hooper.playSpeed"
        :mouseDrag="hooper.mouseDrag"
        :touchDrag="hooper.touchDrag"
        :wheelControl="hooper.wheelControl"
        :transition="hooper.transition"
      >
        <slide v-for="watchedProduct in products" :key="`watched${watchedProduct.pk}`" class="watched-slide">
          <bestsellers-item
            class="grid-cell"
            :product="watchedProduct"
            :category="watchedProduct.category"
          ></bestsellers-item>
        </slide>
      </hooper>
    </div>
  </div>
</template>

<script>
import { Hooper, Slide, Pagination as HooperPagination } from 'hooper';
import '@/assets/slider/hooper.css';

import BestsellersItem from '@/components/home/BestsellersItem';

export default {
  name: 'BestsellersSlider',
  components: {
    Hooper,
    Slide,
    HooperPagination,
    BestsellersItem,
  },
  props: {
    products: {
      type: Array,
    },
  },
  data: () => ({
    hooper: {
      itemsToShow: 4,
      infiniteScroll: false,
      autoPlay: false,
      playSpeed: 5000,
      mouseDrag: true,
      touchDrag: false,
      wheelControl: false,
      transition: 2000,
    },
  }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
}
a {
  text-decoration: none;
  color: $text_color;
  &:hover {
    text-decoration: underline;
  }
}
.header {
  margin-top: 24px;
  padding-bottom: 8px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
    ),
    webkit ms
  );
  .title {
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 2px;
    letter-spacing: 0.025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
  }
  .secondary-title {
    color: $text_color;
    font-size: 18px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
  }
}
.hooper {
  height: 350px;
}
.watched-slider {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
}
.watched-slide {
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
</style>
