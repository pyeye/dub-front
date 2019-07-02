<template>
  <div class="filter-tag-menu">
    <div v-swiper:tagSwiper="swiperTagOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="tag in tags" :key="tag.pk">
          <div class="tag"
            :class="{ 'tag-active': selectedTags.some(t => t.pk === tag.pk) }"
            @click="tagHandler(tag)"
            v-response.small.masked
          >{{tag.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogTags',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    selectedTags: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    swiperTagOption: {
      slidesPerView: 6,
      spaceBetween: 40,
      freeMode: true,
      speed: 2000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    },
  }),
  methods: {
    tagHandler(tag) {
      this.$emit('tag-selected', tag);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.filter-tag-menu {
  padding: 8px 0;
}
.tag {
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
  border: 2px solid $primary_color;
  border-radius: 4px;
  transition: background-color 0.25s ease;
  font-weight: 600;
  opacity: 0.7;
  font-size: 14px;

  &:hover {
    background-color: $primary_color;
  }
}
.tag-active {
  background-color: $primary_color;
}
</style>
