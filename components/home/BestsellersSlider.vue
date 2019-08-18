<template>
  <div>
    <div class="watched-slider">
      <vue-glide :options="slider" @glide:mount-after="loaded = true" v-show="loaded" :key="loaded">
        <vue-glide-slide v-for="watchedProduct in products" :key="watchedProduct.pk" class="watched-slide">
          <bestsellers-item
            class="grid-cell"
            :product="watchedProduct"
            :category="watchedProduct.category"
          ></bestsellers-item>
          <div class="masked-box" v-show="!loaded">
            <div class="masked-item" v-for="i in slider.perView" :key="i"></div>
          </div>
        </vue-glide-slide>
      </vue-glide>
    </div>
  </div>
</template>

<script>
import BestsellersItem from '@/components/home/BestsellersItem';

export default {
  name: 'BestsellersSlider',
  components: {
    BestsellersItem,
  },
  props: {
    products: {
      type: Array,
    },
  },
  data: () => ({
    slider: {
      type: 'carousel',
      perView: 4,
      animationDuration: 4000,
    },
    loaded: false,
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
    font-family: $accent_font;
  }
  .secondary-title {
    color: $text_color;
    font-size: 18px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
  }
}
.watched-slider {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
  height: 350px;
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
.masked-box {
  height: 350px;
  overflow: hidden;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.masked-item {
  height: 350px;
  width: 1450px;
  margin: 0 8px;
  border-radius: 2px;
  background-color: #ddd;
}
</style>
