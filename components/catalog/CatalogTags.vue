<template>
  <div class="filter-tag-menu">
    <vue-glide @glide:mount-after="loaded = true" v-show="loaded" :key="tagKey" :options="slider">
      <vue-glide-slide v-for="tag in tags" :key="tag.pk">
        <div class="tag"
          :class="{ 'tag-active': selectedTags.some(t => t.pk === tag.pk) }"
          @click="tagHandler(tag)"
          v-response.small.masked
        >
          {{tag.name}}
        </div>
      </vue-glide-slide>
    </vue-glide>
    
    <div class="masked-box" v-show="!loaded">
      <div class="masked-item" v-for="i in 6" :key="i"></div>
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
    slider: {
      type: 'carousel',
      perView: 6,
      autoplay: 5000,
      perTouch: 3,
      animationDuration: 4000,
    },
    loaded: false,
  }),
  computed: {
    tagKey() {
      const random = Math.random();
      return `${this.loaded}_${random * this.tags.length}`;
    },
  },
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
.slide {
  border: 3px solid $body_color;
}
.masked-box {
  height: 33px;
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
  height: 33px;
  width: 450px;
  margin: 0 4px;
  border-radius: 2px;
  background-color: #ddd;
}
</style>
