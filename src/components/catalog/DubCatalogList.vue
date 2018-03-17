<template>
  <div class="catalog-list">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="filter-menu">
      <div class="filter-item">
        <div class="filter-description">Форма поиска:</div>
        <el-switch  v-model="showFilter"></el-switch>
      </div>

      <div class="filter-item">
        <div class="filter-description">Сортировать по:</div>
        <div class="filter-description pointer" @click="sortBy = 'name'" :class="{ 'filter-sort-active': sortBy == 'name' }">Названию</div>
        <div class="filter-description pointer" @click="sortBy = 'price'" :class="{ 'filter-sort-active': sortBy == 'price' }">Цене</div>
        <div class="filter-description pointer" @click="sortBy = 'date'" :class="{ 'filter-sort-active': sortBy == 'date' }">Дате</div>
        <div class="filter-description pointer" @click="sortBy = 'hot'" :class="{ 'filter-sort-active': sortBy == 'hot' }">Популярности</div>
      </div>

      <div class="filter-item">
        <div class="filter-description">Показывать по:</div>
        <div class="filter-description pointer" @click="showBy = '15'" :class="{ 'filter-sort-active': showBy == '15' }">15</div>
        <div class="filter-description pointer" @click="showBy = '30'" :class="{ 'filter-sort-active': showBy == '30' }">30</div>
      </div>
      
    </div>

    <div class="filter-tag-menu">
      <swiper :options="swiperTagOption">
        <swiper-slide v-for="tag in tags" :key="tag">
            <div class="tag" :class="{ 'tag-active': tagBy.includes(tag) }" v-response.small.masked @click="setTag(tag)" >{{tag}}</div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="content">
         <el-collapse class="filter-panel" v-if="showFilter">
          <el-collapse-item>
            <div slot="title" v-response.small class="collapse-title">Цена</div>
            <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
          </el-collapse-item>
          <el-collapse-item>
            <div slot="title" v-response.small class="collapse-title">Бренды</div>
            <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
          </el-collapse-item>
          <el-collapse-item>
            <div slot="title" v-response.small class="collapse-title">Регион</div>
            <div>Simplify the process: keep operating process simple and intuitive;</div>
          </el-collapse-item>
          <el-collapse-item>
            <div slot="title" v-response.small class="collapse-title">Тип</div>
            <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
          </el-collapse-item>
        </el-collapse>

      <div class="grid" > 
        <dub-catalog-list-item class="grid-cell" v-for="product in filteredProducts" :key="product.pk" :product="product" :category="category"></dub-catalog-list-item>
      </div>
    </div>
  </div>
</template>

<script>
import DubCatalogListItem from '@/components/catalog/DubCatalogListItem';

export default {
  name: 'DubCatalogList',
  components: {
    DubCatalogListItem,
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
  computed: {
    products() {
      const category = this.$route.params.category;
      const products = this.$store.getters.getProducts(category);

      if (!products) {
        this.$store.dispatch('requestProducts', {
          category,
        });
      }
      return products;
    },
    category() {
      const routeCategory = this.$route.params.category;
      return this.$store.getters.getCategory(routeCategory) || {};
    },
    tags() {
      const category = this.$route.params.category;
      const tags = this.$store.getters.getProductTags(category);

      if (!tags) {
        this.$store.dispatch('requestProductTags', category);
      }

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
        this.filteredProducts = this.products.filter((product) => {
          const productTagsSet = new Set(product.tags);
          const intersection = new Set([...tagsSet].filter(x => productTagsSet.has(x)));
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

  @include prefix((
    display: flex,
    flex-direction: row,
    justify-content: space-between,
      align-items: center,
  ), webkit ms);

  .filter-item {
    @include prefix((
    display: flex,
    flex-direction: row,
  ), webkit ms);

  .filter-sort-active {
   
  border-bottom: 3px solid $primary_color;

  }
  }

  .filter-description {
    color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
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
  @include prefix((
    display: flex,
    flex-direction: row
  ), webkit ms);

  .filter-panel {
    position: relative;
    height: 100%;
    width: 20%;
    background-color: $upper-layer-color;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 32px;
    padding: 16px;

    .collapse-title {
      position: relative;
      color: $text_color;
      font-size: 16px;
          font-weight: 500;
          letter-spacing: -.012em;
          font-weight: 600;
      opacity: .7;
          
    }

  }

  .grid {
    @include prefix((
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
    ), webkit ms);
    width: 100%;

    .grid-cell {
      @include prefix((
        flex: 1 1,
        flex-basis: 24%,
      ), webkit ms);

      max-width: 24%;
      background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      padding: 32px;
      margin: 0 8px 32px 8px;
      transition: box-shadow .25s ease;

      &:hover {
        box-shadow: 0 5px 10px rgba(0,0,0,.2)
      }
    }

    
  }
}

.amount {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);

    .description {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }

    .value {
      @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;

    .item {
      opacity: .7;
    }
    .item:not(:last-of-type):after {
              content: "/";
              
            }
            .item:nth-last-of-type(2):before {
              content: none;
            }
    }
    
}

.slide {
  height: 550px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.catalog-swiper {
  box-shadow: 0 1px 1px rgba(0,0,0,.2);

}

.tag {
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
    border: 2px solid $primary_color;
  border-radius: 4px;
  transition: background-color .25s ease;
  font-weight: 600;
    opacity: .7;
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