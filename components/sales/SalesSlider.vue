<template>
  <div>
    <div class="header">
      <div class="title">Акции</div>
    </div>
    <div class="slider">
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
        <slide v-for="sale in sales" :key="sale.pk">
          <div class="slide" :style="'background-image: url('+ sale.image.src +');'">
            <nuxt-link :to="`/sales/${sale.pk}`">
              <div class="cover-text">
                <div class="text-secondary">
                  <div class="date">
                    C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }}
                    по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
                  </div>
                </div>
                <div class="title">{{ sale.name }}</div>
              </div>
            </nuxt-link>
          </div>
        </slide>
        <hooper-pagination v-if="sales.length > 2" slot="hooper-addons"></hooper-pagination>
      </hooper>
    </div>
  </div>
</template>

<script>
import { Hooper, Slide, Pagination as HooperPagination } from 'hooper';
import '@/assets/slider/hooper.css';

import SalesBanner from '@/components/sales/SalesSlider';

export default {
  name: 'SalesSlider',
  components: {
    Hooper,
    Slide,
    HooperPagination,
    SalesBanner,
  },
  props: {
    sales: {
      type: Array,
    },
  },
  data: () => ({
    hooper: {
      itemsToShow: 2,
      infiniteScroll: true,
      autoPlay: false,
      playSpeed: 5000,
      mouseDrag: false,
      touchDrag: false,
      wheelControl: false,
      transition: 500,
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
  height: 200px;
}
.slide {
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  border: 2px solid #fff;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform: translateY(0);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    .cover-text {
      text-decoration: underline;
    }
  }
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
  font-size: 22px;
  letter-spacing: 0.25px;
  line-height: 22px;
  font-family: 'Roboto', sans-serif;
  height: 60%;
  padding: 12px;
  opacity: 1;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
  transition: opacity 0.25s ease;
  opacity: 1;
  .text-secondary {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: flex-end,
      ),
      webkit ms
    );
    font-size: 14px;
    letter-spacing: 0.15px;
    line-height: 14px;
    opacity: 1;
    flex: 1;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
  }
}
</style>
