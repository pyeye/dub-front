<template>
  <div class="gallery"> 
    <img class="product-image" :src="getAbsoluteUrl(activeImage.src)" />
    <img class="img-shadow" src="http://api.mydubbelsite.ru/img/static/rombre-bouteille-3880.png" />
    <!--
    <div class="image-box" ref="container">
      <div class="img"  :style="{ backgroundImage: getAbsoluteBgUrl(activeImage.src) }"></div>
    </div>
    <img class="img-shadow" src="http://api.mydubbelsite.ru/img/static/rombre-bouteille-3880.png" />

    <div class="thumbnails" v-if="images.length > 1">
      <div
        class="thumbnail-box"
        v-for="image in images"
        :key="image.pk"
        :class="{'thumbnail-active': image.pk === activeImage.pk }"
        @click="activeImage = image"
      >
        <img class="thumbnail" :src="getAbsoluteUrl(image.src)">
      </div>
    </div>
    -->
  </div>
</template>

<script>
export default {
  name: 'CatalogGallery',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    activeImage: '',
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  created() {
    this.activeImage = this.images.find(image => image.is_main);
  },
  methods: {
    getAbsoluteBgUrl(imageUrl) {
      const absoluteUrl = this.getAbsoluteUrl(imageUrl);
      return `url(${absoluteUrl})`;
    },
    getAbsoluteUrl(imageUrl) {
      return this.baseUrl + imageUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  width: 100%;
  height: 90vh;
}
.product-image {
  object-position: center bottom;
  object-fit: contain;
  height: 100%;
  width: 100%;
}
.image-box {
  position: relative;
  height: 100vh;
  border: 0;
  overflow: hidden;
  max-width: 100%;
  max-height: 90vh;
  transition: all 0.5s ease-out;
}
.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  transition: all ease-out 0.3s;
  background-size: contain;
  z-index: 1;
}

.img-shadow {
  left: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width: 100vw;
  position: absolute;
  right: 50%;
  width: 99vw;
  opacity: 0.4;
  bottom: -1.3%;
}

.zoom {
  z-index: 10;
  transition: none;
}
.thumbnails {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
    ),
    webkit ms
  );
}
.thumbnail-box {
  max-height: 100px;
  min-width: 60px;
  padding: 8px;
  cursor: pointer;
  margin-top: 8px;
  text-align: center;
}
.thumbnail {
  max-height: 100px;
}
.thumbnail-active {
  border: 2px solid $primary-color;
  padding: 6px;
}
@media (max-width: 1450px) {
  .gallery {
    height: 100vh;
  }
  .image-box {
    max-height: 100vh;
  }
}
</style>
