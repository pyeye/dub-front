<template>
  <div class="gallery"> 
    <div class="image-box" ref="container" @mousemove="moveBG">
      <div class="img normal"  :style="{ backgroundImage: getAbsoluteBgUrl(activeImage.src) }"></div>
      <div class="img zoom" ref="zoom" :style="{ backgroundImage: getAbsoluteBgUrl(activeImage.src) }"></div>
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
    getAbsoluteBgUrl(imageUrl) {
      const absoluteUrl = this.getAbsoluteUrl(imageUrl);
      return `url(${absoluteUrl})`;
    },
    getAbsoluteUrl(imageUrl) {
      return this.baseUrl + imageUrl;
    },
    moveBG(ev) {
      const { container, zoom } = this.$refs;
      const e = {
        w: zoom.offsetWidth,
        h: zoom.offsetHeight,
      };

      const c = {
        x: Math.round((ev.clientX - (container.offsetLeft - window.scrollX)) / (e.w / 100) / 2),
        y: Math.round((ev.clientY - (container.offsetTop - window.scrollY)) / (e.h / 100) - 37),
      };

      zoom.style.backgroundPosition = `${c.x}% ${c.y}%`;
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
  height: 500px;
  border: 0;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  transition: all 0.5s ease-out;
  &:hover {
    cursor: move;
    .normal {
      opacity: 0;
      transform: scale(1.1);
    }
  }
}
.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #fafafa;
  transition: all ease-out 0.3s;
}

.normal {
  z-index: 20;
  background-size: contain;
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
</style>
