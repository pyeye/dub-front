<template>
  <div class="gallery"> 
    <div class="image-box">
      <img 
        class="image"  
        ref="normal"
        :src="getAbsoluteUrl(activeImage.src)"
        :data-zoom="getAbsoluteUrl(activeImage.src)"
      >
    </div>
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
    <div ref="zoom" class="zoom" v-show="isZoomActive"></div>
  </div>
</template>

<script>
import Drift from 'drift-zoom';

export default {
  name: 'CatalogGallery',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    drift: null,
    activeImage: '',
    isZoomActive: false,
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  created() {
    this.activeImage = this.images.find(image => image.is_main);
  },
  mounted() {
    const { normal, zoom } = this.$refs;
    const options = {
      paneContainer: zoom,
      zoomFactor: 2,
      onShow: () => {
        this.isZoomActive = true;
      },
      onHide: () => {
        this.isZoomActive = false;
      },
    };
    this.drift = new Drift(normal, options);
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
  height: 100%;
}
.image-box {
  position: relative;
  text-align: center;
  padding: 0 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: bottom,
      justify-content: center,
    ),
    webkit ms
  );
}
.image {
  height: 500px;
  max-width: 100%;
  z-index: 1;
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
.zoom {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -105%;
  left: 105%;
  padding: 16px;
  margin: 16px 0;
  background-color: $upper_layer_color;
  border-radius: 4px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12),
    0 1px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
