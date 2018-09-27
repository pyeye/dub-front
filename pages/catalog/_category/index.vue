<template>
  <div class="catalog-list">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="filter-menu">
      <div class="filter-item">
        <div class="filter-description">Форма поиска:</div>
        <dub-switch  v-model="showFilter"></dub-switch>
      </div>

      <div class="filter-item">
        <div class="filter-description">Сортировать по:</div>
        <div class="filter-description pointer" 
            @click="sortBy = 'name'" 
            :class="{ 'filter-sort-active': sortBy == 'name' }">
            Названию
        </div>
        <div class="filter-description pointer" 
            @click="sortBy = 'price'" 
            :class="{ 'filter-sort-active': sortBy == 'price' }">
            Цене
        </div>
        <div class="filter-description pointer" 
            @click="sortBy = 'date'" 
            :class="{ 'filter-sort-active': sortBy == 'date' }">
            Дате
        </div>
        <div class="filter-description pointer" 
            @click="sortBy = 'hot'" 
            :class="{ 'filter-sort-active': sortBy == 'hot' }">
            Популярности
        </div>
      </div>

    
      
    </div>

    <div class="filter-tag-menu">
      <div v-swiper:tagSwiper="swiperTagOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="tag in tags" :key="tag">
            <div class="tag" 
                :class="{ 'tag-active': tagBy.includes(tag) }" 
                v-response.small.masked @click="setTag(tag)">
              {{tag}}
            </div>
        </div>
        </div>
      </div>
    </div>

    <div class="content">
         <div class="filter-panel" v-if="showFilter"></div>

      <div class="grid" > 
        <catalog-item class="grid-cell" 
            v-for="product in products" 
            :key="product.pk" 
            :product="product" 
            :category="category">
        </catalog-item>
      </div>
    </div>
  </div>
</template>

<script>
import CatalogItem from '@/components/catalog/CatalogItem';
import DubSwitch from '@/components/base/DubSwitch';

export default {
  name: 'ProductList',
  components: {
    CatalogItem,
    DubSwitch,
  },
  data: () => ({
    showFilter: true,
    sortBy: 'name',
    showBy: '15',
    categories: [],
    filteredProducts: [],
    tagBy: [],
    categoryName: '',
    swiperOption: {
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    },
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
  async fetch({ store, params }) {
    const { category } = params;
    await Promise.all([
      store.dispatch('products/requestProducts', category),
      store.dispatch('products/requestTags', category),
    ]);
  },
  computed: {
    products() {
      const { category } = this.$route.params;
      const products = this.$store.getters['products/products'](category);

      return products;
    },
    category() {
      const routeCategory = this.$route.params.category;
      return this.$store.getters['products/category'](routeCategory) || {};
    },
    tags() {
      const { category } = this.$route.params;
      const tags = this.$store.getters['products/tags'](category);

      return tags;
    },
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: this.category.name, link: '' },
      ];
    },
  },
  methods: {
    setTag(tag) {
      const index = this.tagBy.indexOf(tag);
      if (index === -1) {
        this.tagBy.push(tag);
      } else {
        this.tagBy.splice(index, 1);
      }
    },
  },
  watch: {
    products: {
      immediate: true,
      handler(val) {
        this.filteredProducts = val;
      },
    },
    tagBy: {
      handler(val) {
        // if (!this.tags || !this.products) {
        //   this.filteredProducts = this.products;
        //   return;
        // }
        if (val.length === 0) {
          this.filteredProducts = this.products;
          return;
        }

        const tagsSet = new Set(val);
        this.filteredProducts = this.products.filter(product => {
          const productTagsSet = new Set(product.tags);
          const intersection = new Set(
            [...tagsSet].filter(x => productTagsSet.has(x))
          );
          return intersection.size === tagsSet.size;
        });
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.catalog-list {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
}

.filter-tag-menu {
  padding: 16px 0 32px 0;
}

.filter-menu {
  padding: 16px 0;

  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
      align-items: center,
    ),
    webkit ms
  );

  .filter-item {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );

    .filter-sort-active {
      border-bottom: 3px solid $primary_color;
    }
  }

  .filter-description {
    color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    margin-right: 16px;
  }

  .pointer {
    cursor: pointer;
  }

  .pointer:hover {
    border-bottom: 3px solid $primary_color;
  }
}

.content {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );

  .filter-panel {
    position: relative;
    height: 100%;
    width: 20%;
    background-color: $upper-layer-color;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 32px;
    padding: 16px;

    .collapse-title {
      position: relative;
      color: $text_color;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: -0.012em;
      font-weight: 600;
      opacity: 0.7;
    }
  }

  .grid {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        flex-wrap: wrap,
      ),
      webkit ms
    );
    width: 100%;

    .grid-cell {
      @include prefix(
        (
          flex: 1 1,
          flex-basis: 24%,
        ),
        webkit ms
      );

      max-width: 24%;
      background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      padding: 32px;
      margin: 0 8px 32px 8px;
      transition: box-shadow 0.25s ease;

      &:hover {
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.amount {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );

  .description {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }

  .value {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;

    .item {
      opacity: 0.7;
    }
    .item:not(:last-of-type):after {
      content: '/';
    }
    .item:nth-last-of-type(2):before {
      content: none;
    }
  }
}

.slide {
  height: 550px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.catalog-swiper {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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
}

.tag:hover {
  background-color: $primary_color;
}

.tag-active {
  background-color: $primary_color;
}

@media (max-width: 1450px) {
  .catalog-list {
    width: 85%;
  }
}
</style>
