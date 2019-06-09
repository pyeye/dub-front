<template>
  <div class="header-panel"
    v-if="navActive || selfActive"
    @mouseover="selfActive = true"
    @mouseout="selfActive = false"
  >
    <div class="panel-content">
        <div class="content-categories">
          {{activeCategory.name}}
             <img class="image" src="~assets/images/beer.jpg">
             <dub-button type="secondary" class="show-all">
                показать все
            </dub-button>
        </div>
        <div class="content-meta">
            <div class="content-facets" v-for="facet in facets.sfacets" :key="facet.slug">
              <div class="collapse-title"> {{facet.name}} </div>
              <div v-for="item in facet.values" :key="item.pk">
                <div class="facets-values">{{item.name}}</div>
              </div>
            </div>
        </div>
        <div class="more-categories" v-if="Array.isArray(category)">
          <div 
          v-for="moreCategory in category" 
          :key="moreCategory.slug"
          @mouseover="activeCategory = moreCategory">
            {{ moreCategory.name }}
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
    activeCategory: {},
  }),
  computed: {
    facets() {
      const facets = this.$store.getters['products/facets'](this.category.slug);
      if (facets === null) {
        return [];
      }
      return facets;
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
  width: 85%;
  position: absolute;
  left: 50%;
  top: 100%;
  margin-left: -42.5%;
  background-color: $upper_layer_color;
  border-radius: 0 0 3px 3px;
  z-index: 2;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 24px 0;
}
.more-categories {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
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
    width: 20%;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 24px;
    position: relative;
  }
  .content-meta {
    width: 80%;
    padding-left: 24px;
    @include prefix(
      (
        display: flex,
        flex-direction: column,
        flex-wrap: wrap,
        flex-flow: column wrap,
        justify-content: flex-start,
        align-items: flex-start,
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
    height: 270px;
    margin: 0 auto;
  }

  .show-all {
    margin-top: 24px;
    height: 35px;
  }
}
</style>
