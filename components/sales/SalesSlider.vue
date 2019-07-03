<template>
  <div>
    <div class="header">
      <div class="title">Акции</div>
      <div class="flex"></div>
      <div class="secondary-title"><nuxt-link to="/sales">Все акции</nuxt-link></div>
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
              <div class="cover"></div>
              <div class="cover-text">
                <div class="text-secondary">
                  <div class="date">
                    C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }}
                    по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
                  </div>
                </div>
                <div class="title">{{ sale.name }}</div>
              </div>
              <div class="cover-inspect">
                <div>ПОДРОБНЕЕ</div>
                <dub-icon width=24 height=24><icon-right class="icon-link" /></dub-icon>
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

export default {
  name: 'SalesSlider',
  components: {
    Hooper,
    Slide,
    HooperPagination,
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
    transform: translateY(-2px);
    .cover {
      opacity: 0.9;
    }
    .cover-text {
      opacity: 0;
    }
    .cover-inspect {
      opacity: 1;
      -webkit-transform: translate3d(-50%, -50%, 1px);
      transform: translate3d(-50%, -50%, 1px);
    }
  }
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.7;
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
  padding: 12px;
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
    font-size: 14px;
    letter-spacing: 0.15px;
    line-height: 14px;
    opacity: 0.85;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
  }
}
.cover-inspect {
  color: $primary_color;
  font-size: 20px;
  letter-spacing: 0.25px;
  line-height: 20px;
  font-weight: 600;
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate3d(-50%, -30%, 1px);
  will-change: transfrom;
  transition: opacity 0.4s ease, transform 0.45s ease, -webkit-transform 0.45s ease;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}
</style>
