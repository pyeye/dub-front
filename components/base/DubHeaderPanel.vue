<template>
  <div class="header-panel">
    <div class="panel-content">
        <div class="content-categories">
          <dir class="product-name" @click="closePanel">
            <nuxt-link :to="`/catalog/${activeCategory.category.slug}/${activeCategory.pk}`" class="nav-category link">
              {{activeCategory.category.name}} {{activeCategory.name}}
            </nuxt-link>
          </dir>
            <nuxt-link :to="`/catalog/${activeCategory.category.slug}/${activeCategory.pk}`" class="nav-category link">
              <img class="image" :src="`http://api.mydubbelsite.ru/${productImage}`" @click="closePanel">
            </nuxt-link>
             <dub-button type="secondary" class="show-all">
                <nuxt-link :to="`/catalog/${activeCategory.category.slug}`" class="nav-category">
                  <span class="button" @click="closePanel">показать все</span>
                </nuxt-link>
            </dub-button>
        </div>
        <div class="content-meta">
            <div class="content-facets" v-for="facet in facets" :key="facet.slug">
              <div class="collapse-title"> {{facet.name}} </div>
              <div v-for="item in facet.values.slice(0,8)" :key="item.pk">
                <a 
                  :href="`/catalog/${activeCategory.category.slug}?sfacets=${facet.slug}:${item.pk}`"
                  class="nav-category link"
                >
                  <div class="facets-values" @click="closePanel">{{item.name}}</div>
                </a>
              </div>
            </div>
        </div>
        <div class="more-categories" v-if="Array.isArray(category)">
          <div
            class="more-category"
            v-for="moreCategory in category" 
            :key="moreCategory.slug"
            @mouseover="activeCategory = moreCategory"
          >
           <nuxt-link :to="`/catalog/${moreCategory.category.slug}`" class="nav-category">
                <span class="button" @click="closePanel">{{ moreCategory.category.name }}</span>
            </nuxt-link>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DubHeaderPanel',
  props: {
    category: {
      type: [Object, Array],
    },
    navActive: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    selfActive: false,
    activeCategory: { category: {} },
  }),
  computed: {
    facets() {
      return this.activeCategory.facets;
    },
    productImage() {
      if (!this.activeCategory.products) {
        return '';
      }
      const mainImage = this.activeCategory.products[0].images.find(i => i.is_main);
      if (!mainImage) {
        return this.activeCategory.products[0].images[0].src;
      }
      return mainImage.src;
    },
  },
  methods: {
    closePanel() {
      this.$emit('close-panel');
    },
  },
  watch: {
    category: {
      handler(val) {
        this.activeCategory = Array.isArray(val) ? val[0] : val;
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header-panel {
  width: 90%;
  position: absolute;
  left: 50%;
  top: 100%;
  margin-left: -42.5%;
  background-color: $upper_layer_color;
  border-radius: 0 0 3px 3px;
  z-index: -1;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 24px 0;
}
.more-categories {
  min-width: 170px;
  border-left: 1px solid #e6e3da;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  .more-category {
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
}
.link {
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: $text_color;
  &:hover {
    text-decoration: underline;
  }
}
.button {
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: $text_color;
}
.product-name {
  position: relative;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: 4px 8px;
  opacity: 0.7;
  font-size: 14px;
  font-weight: 400;
}
.panel-content {
  height: 350px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .content-categories {
    @include prefix(
      (
        display: flex,
        flex-direction: column,
        align-items: center,
        justify-content: center,
      ),
      webkit ms
    );
    border-right: 1px solid #e6e3da;
    min-width: 15%;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 24px;
    position: relative;
  }
  .content-meta {
    width: 90%;
    overflow: hidden;
    padding: 0 24px;
    @include prefix(
      (
        display: grid,
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)),
        grid-template-rows: 350px,
      ),
      webkit ms
    );

    .content-facets {
      padding: 8px;
    }
  }

  .collapse-title {
    color: $text_color;
    font-size: 16px;
    letter-spacing: -0.012em;
    font-weight: 600;
    opacity: 0.7;
  }

  .facets-values {
    margin: 4px 0;
    color: $text_color;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.7;
  }

  .image {
    height: 250px;
    margin: 0 auto;
  }

  .show-all {
    margin-top: 20px;
    height: 35px;
  }
}
</style>
