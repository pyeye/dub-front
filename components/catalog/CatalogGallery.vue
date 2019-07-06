<template>
  <div> 
    <div class="image-box">
      <img class="image" :src="getAbsoluteUrl(activeImage.src)">
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
    getAbsoluteUrl(imageUrl) {
      return this.baseUrl + imageUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
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
  max-height: 450px;
  max-width: 100%;
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
</style>
