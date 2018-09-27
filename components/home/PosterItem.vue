<template>
  <div v-if="poster" class="news-item" :style="'background-image: url('+ poster.image +');'">
    <nuxt-link :to="poster.url">
      <div class="cover"></div>
      <div class="cover-text">
          <div class="title">{{ poster.title }}</div>
      </div>
      <div class="cover-inspect"><div>ПОДРОБНЕЕ</div><icon class="icon-link"  name="angle-right"></icon></div>
    </nuxt-link>
  </div>
 
</template>

<script>
export default {
  name: 'PosterItem',
  props: {
    poster: {
      type: Object,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-item {
  cursor: pointer;
  border-radius: 2px;
  position: relative;
  width: 100%;
  height: 400px;
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
  opacity: 0.65;
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
  font-size: 26px;
  letter-spacing: -0.012em;
  line-height: 32px;
  font-family: 'Roboto', sans-serif;
  padding: 32px 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
}
.cover-inspect {
  color: $primary_color;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate3d(-50%, -30%, 1px);
  will-change: transfrom;
  transition: opacity 0.4s ease, transform 0.45s ease,
    -webkit-transform 0.45s ease;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}
.icon-link {
  width: 22px;
  height: 22px;
}
a {
  text-decoration: none;
}
@media (max-width: 1450px) {
  .news-item {
    height: 300px;
  }
}
</style>
