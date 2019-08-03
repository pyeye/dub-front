<template>
  <div>
    <div class="slider">
      <vue-glide :options="slider" @glide:mount-after="loaded = true" v-show="loaded" :key="loaded">
        <vue-glide-slide v-for="sale in sales" :key="sale.pk">
          <div class="slide" :style="'background-image: url('+ sale.image.src +');'">
            <nuxt-link :to="`/sales/${sale.pk}`">
              <div class="cover-text">
                <div class="text-secondary">
                  <div class="date">
                    C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }}
                    по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
                  </div>
                </div>
                <span class="title"><span class="link">{{ sale.name }}</span></span>
              </div>
            </nuxt-link>
          </div>
        </vue-glide-slide>
        <template slot="control">
          <div class="nav-prev" data-glide-dir="<">
            <dub-icon width=24 height=24 class="prev-icon"><icon-left/></dub-icon>
          </div>
          <div class="nav-next" data-glide-dir=">">
            <dub-icon width=24 height=24 class="prev-icon"><icon-right/></dub-icon>
          </div>
        </template>
      </vue-glide>
      <div class="masked-box" v-show="!loaded">
        <div class="masked-item" v-for="i in slider.perView" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesSlider',
  props: {
    sales: {
      type: Array,
    },
  },
  data: () => ({
    slider: {
      type: 'carousel',
      perView: 2,
      autoplay: 8000,
      animationDuration: 3000,
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
}
.slider {
  height: 250px;
}
.slide {
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  border: 2px solid #fff;
  width: 100%;
  height: 250px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform: translateY(0);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    .link {
      background-size: 100% 100%;
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
.masked-box {
  height: 200px;
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
  height: 200px;
  width: 1450px;
  margin: 0 8px;
  border-radius: 2px;
  background-color: #ddd;
}
.reset-button {
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  /* Corrects inability to style clickable `input` types in iOS */
  -webkit-appearance: none;
  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
}
.nav-prev {
  position: absolute;
  top: 40%;
  left: 2px;
  padding: 10px;
  border-radius: 2px;
  background-color: #252525;
  transition: background-color 0.25s ease;
  opacity: 0.6;
  cursor: pointer;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  &:hover {
    background-color: $primary_color;
    opacity: 1;
    .prev-icon {
      color: #000;
    }
  }
}
.nav-next {
  position: absolute;
  top: 40%;
  right: 2px;
  padding: 10px;
  border-radius: 2px;
  background-color: #252525;
  transition: background-color 0.25s ease;
  opacity: 0.6;
  cursor: pointer;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  &:hover {
    background-color: $primary_color;
    opacity: 1;
    .prev-icon {
      color: #000;
    }
  }
}
.title {
  text-decoration: none;
}
.link {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $primary_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease;
  &:hover {
    background-size: 100% 100%;
  }
}
.prev-icon {
  position: relative;
  z-index: 2;
  color: #fff;
  transition: color 0.25s ease;
}
</style>
