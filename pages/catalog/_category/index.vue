<template>
  <div class="catalog-list">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="header">
      <div class="title">{{ category.name }}</div>
      <div class="filters">
        <div class="count">Найдено {{ totalProducts }}</div>
        <filter-items class="badges" :filters="filters" @delete-badge="deleteBadge"></filter-items>
      </div>

      <div class="sort">
        <div class="sort-description">Сортировать по:</div>
        <dub-select
          :selected="filters.sort.by"
          :options="filters.sort.options"
          @updateOption="selectHandler"
        ></dub-select>
      </div>
    </div>
    <div class="filter-tag-menu">
      <div v-swiper:tagSwiper="swiperTagOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="tag in tags" :key="tag.code">
            <div
              class="tag"
              :class="{ 'tag-active': filters.tags.some(t => t.code === tag.code) }"
              @click="tagHandler(tag)"
              v-response.small.masked
            >{{tag.name}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="filter-panel">
        <dub-collapse>
          <dub-collapse-item v-for="facet in facets.sfacets" :key="facet.slug">
            <div slot="header" class="collapse-title">{{facet.name}}</div>
            <div v-for="item in facet.values" :key="item.code">
              <dub-check
                v-model="filters.sfacets"
                :val="item"
                :extend-val="{facetName: facet.name, facetSlug: facet.slug}"
                :label="`${item.name} (${item.count})`"
                @input="updateQuery"
              />
            </div>
          </dub-collapse-item>
          <dub-collapse-item v-for="nfacet in filters.nfacets" :key="nfacet.slug">
            <div slot="header" class="collapse-title">{{nfacet.name}} ({{nfacet.suffix}})</div>
            <div class="nfacet-item">
              <div class="nfacet-num-row">
                <dub-number-input
                  :value="nfacet.value[0]"
                  :min="nfacet.stats.min"
                  :max="nfacet.stats.max"
                  :step="getInterval(nfacet.stats.min, nfacet.stats.max)"
                  @input="numberHandler($event, nfacet, 'min')"
                />
                <dub-number-input
                  :value="nfacet.value[1]"
                  :min="nfacet.stats.min"
                  :max="nfacet.stats.max"
                  :step="getInterval(nfacet.stats.min, nfacet.stats.max)"
                  @input="numberHandler($event, nfacet, 'max')"
                />
              </div>

              <vue-slider
                class="nfacet-slider"
                :value="nfacet.value"
                :min="nfacet.stats.min"
                :max="nfacet.stats.max"
                :tooltip-placement="'bottom'"
                :lazy="true"
                :interval="getInterval(nfacet.stats.min, nfacet.stats.max)"
                @change="sliderHandler($event, nfacet)"
              ></vue-slider>
            </div>
          </dub-collapse-item>
        </dub-collapse>
      </div>

      <div class="product-content">
          <div class="grid">
            <catalog-item
              class="grid-cell"
              v-for="product in products"
              :key="product.pk"
              :product="product"
            ></catalog-item>
          </div>
          <dub-pagination
            class="pagination"
            :value="filters.page.current"
            :total="filters.page.total"
            @change="paginationHandler"
          ></dub-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import CatalogItem from '@/components/catalog/CatalogItem';
import FilterItems from '@/components/catalog/FilterItems';
import DubCollapse from '@/components/base/DubCollapse';
import DubCollapseItem from '@/components/base/DubCollapseItem';
import DubCheck from '@/components/base/DubCheck';
import DubPagination from '@/components/base/DubPagination';
import DubSelect from '@/components/base/DubSelect';
import DubNumberInput from '@/components/base/DubNumberInput';
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min';
import 'vue-slider-component/dist-css/vue-slider-component.css';

// import theme
import '~/assets/slider/theme.scss';

import debounce from '@/plugins/utils/debounce';

export default {
  name: 'ProductList',
  components: {
    CatalogItem,
    FilterItems,
    DubCollapse,
    DubCollapseItem,
    DubCheck,
    VueSlider,
    DubNumberInput,
    DubPagination,
    DubSelect,
  },
  data: () => ({
    filters: {
      sfacets: [],
      nfacets: [],
      tags: [],
      page: {
        total: 1,
        current: 1,
        size: 5,
      },
      sort: {
        by: {
          name: 'названию (А-Я)',
          value: 'name-asc',
        },
        options: [],
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
  async fetch(ctx) {
    const { store, params, query } = ctx;
    const { category } = params;
    await Promise.all([
      store.dispatch('products/requestProducts', { category, query }),
      store.dispatch('products/requestFacets', { category, query }),
      store.dispatch('products/requestTags', { category }),
    ]);
  },
  created() {
    const { query } = this.$route;
    this.filters = this.getFilters(query);
  },
  computed: {
    products() {
      const { category } = this.$route.params;
      const products = this.$store.getters['products/products'](category);
      return products;
    },
    totalProducts() {
      return this.$store.getters['products/total'];
    },
    category() {
      const { category } = this.$route.params;
      return this.$store.getters['products/category'](category) || {};
    },
    facets() {
      const { category } = this.$route.params;
      const facets = this.$store.getters['products/facets'](category);
      return facets;
    },
    tags() {
      const { category } = this.$route.params;
      const tags = this.$store.getters['products/tags'](category);
      return tags;
    },
    breadcrumbs() {
      return [{ label: 'Главная', link: '/' }, { label: this.category.name, link: '' }];
    },
    debounceSliderHandler() {
      return debounce(this.sliderHandler, 500);
    },
    debounceUpdateQuery() {
      return debounce(this.updateQuery, 500);
    },
  },
  methods: {
    encodeTags(tags) {
      const encodedTags = tags.map(tag => tag.code);
      return encodedTags.length === 0 ? [] : encodedTags.join();
    },
    encodeSFacet(facets) {
      const facetsQuery = {};
      const encodedFacets = [];
      facets.forEach(facet => {
        if (facet.facetSlug in facetsQuery === false) {
          facetsQuery[facet.facetSlug] = [];
        }
        facetsQuery[facet.facetSlug].push(facet.code);
      });
      Object.keys(facetsQuery).forEach(key => {
        const codes = facetsQuery[key].join(',');
        const str = `${key}:${codes}`;
        encodedFacets.push(str);
      });
      return encodedFacets;
    },
    encodeNFacet(facets) {
      const encodedFacets = [];
      facets.forEach(facet => {
        const [minVal, maxVal] = facet.value;
        console.log(typeof facet.stats.min);
        if (minVal !== facet.stats.min || maxVal !== facet.stats.max) {
          const str = `${facet.slug}:${minVal}-${maxVal}`;
          encodedFacets.push(str);
        }
      });
      return encodedFacets;
    },
    decodeTags(queryTags) {
      if (queryTags === undefined) {
        return [];
      }
      const decodedTags = [];
      const tagsCodes = queryTags.split(',').map(Number);
      tagsCodes.forEach(tagCode => {
        const tag = this.tags.find(t => t.code === tagCode);
        const decodedTag = {
          name: tag.name,
          code: tag.code,
        };
        decodedTags.push(decodedTag);
      });
      return decodedTags;
    },
    decodeSFacets(queryFacets) {
      let decodedFacets = [];
      if (queryFacets === undefined) {
        return [];
      }

      if (Array.isArray(queryFacets)) {
        queryFacets.forEach(queryFacet => {
          const decodedFacet = this.decodeSFacet(queryFacet);
          decodedFacets = decodedFacets.concat(decodedFacet);
        });
      } else {
        decodedFacets = this.decodeSFacet(queryFacets);
      }
      return decodedFacets;
    },
    decodeSFacet(queryFacet) {
      const [slug, strCodes] = queryFacet.split(':');
      const codes = strCodes.split(',').map(Number);
      const facet = this.facets.sfacets.find(f => f.slug === slug);
      const values = facet.values.filter(v => codes.includes(v.code));
      return values.map(value => ({
        facetSlug: facet.slug,
        facetName: facet.name,
        code: value.code,
        name: value.name,
        count: value.count,
      }));
    },
    decodeNFacets(queryFacets) {
      const { nfacets } = this.facets;
      const decodedFacets = nfacets.map(nfacet => ({
        slug: nfacet.slug,
        name: nfacet.name,
        suffix: nfacet.suffix,
        stats: {
          min: nfacet.stats.min,
          max: nfacet.stats.max,
        },
        value: [nfacet.stats.min, nfacet.stats.max],
      }));

      if (typeof queryFacets !== 'undefined') {
        if (Array.isArray(queryFacets)) {
          queryFacets.forEach(queryFacet => {
            const [slug, stats] = queryFacet.split(':');
            const [minVal, maxVal] = stats.split('-').map(Number);
            const facetIndex = decodedFacets.findIndex(facet => facet.slug === slug);
            decodedFacets[facetIndex].value = [minVal, maxVal];
          });
        } else {
          const [slug, stats] = queryFacets.split(':');
          const [minVal, maxVal] = stats.split('-').map(Number);
          const facetIndex = decodedFacets.findIndex(facet => facet.slug === slug);
          decodedFacets[facetIndex].value = [minVal, maxVal];
        }
      }

      return decodedFacets;
    },
    getFilters(query) {
      const defaultFilters = this.filters;
      const sfacets = this.decodeSFacets(query.sfacets);
      const nfacets = this.decodeNFacets(query.nfacets);
      const tags = this.decodeTags(query.tags);

      const { page } = defaultFilters;
      if (query.page !== undefined) {
        page.current = Number(query.page);
      }
      page.total = Math.ceil(this.totalProducts / page.size);

      const { sort } = defaultFilters;
      sort.options = [
        { name: 'цене (по возрастанию)', value: 'price-asc' },
        { name: 'цене (по убыванию)', value: 'price-desc' },
        { name: 'названию (А-Я)', value: 'name-asc' },
        { name: 'названию (Я-А)', value: 'name-desc' },
      ];
      if (query.sort !== undefined) {
        const queryOption = sort.options.find(option => option.value === query.sort);
        sort.by = queryOption;
      }

      return {
        sfacets,
        nfacets,
        tags,
        page,
        sort,
      };
    },
    async updateQuery() {
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      this.$router.push({ query });
      await Promise.all([
        this.$store.dispatch('products/requestProducts', { category, query }),
        this.$store.dispatch('products/requestFacets', { category, query }),
      ]);
    },
    async sliderHandler(e, nfacet) {
      // eslint-disable-next-line no-param-reassign
      nfacet.value = e;
      await this.updateQuery();
    },
    async numberHandler(e, nfacet, type) {
      const [minVal, maxVal] = nfacet.value;
      if (type === 'min') {
        // eslint-disable-next-line no-param-reassign
        nfacet.value = [Number(e), maxVal];
      } else {
        // eslint-disable-next-line no-param-reassign
        nfacet.value = [minVal, Number(e)];
      }
      await this.debounceUpdateQuery();
    },
    async tagHandler(tag) {
      const index = this.filters.tags.findIndex(t => t.code === tag.code);
      if (index === -1) {
        this.filters.tags.push(tag);
      } else {
        this.filters.tags.splice(index, 1);
      }
      await this.updateQuery();
    },
    async paginationHandler(e) {
      this.filters.page.current = e;
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.page = this.filters.page.current;
      this.$router.push({ query });
      await this.$store.dispatch('products/requestProducts', {
        category,
        query,
      });
    },
    async selectHandler(e) {
      this.filters.sort.by = e;
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.sort = this.filters.sort.by.value;
      this.$router.push({ query });
      await this.$store.dispatch('products/requestProducts', {
        category,
        query,
      });
    },
    getInterval(min, max) {
      const delta = max - min;
      return delta > 10 ? 10 : 0.1;
    },
    async deleteBadge(e) {
      if (e.filter.type === 'nfacets') {
        const index = this.filters.nfacets.findIndex(nfacet => nfacet.slug === e.filter.slug);
        const { stats } = this.filters.nfacets[index];
        this.filters.nfacets[index].value = [stats.min, stats.max];
      } else if (e.filter.type === 'sfacets') {
        const index = this.filters.sfacets.findIndex(sfacet => sfacet.slug === e.filter.slug);
        this.filters.sfacets.splice(index, 1);
      } else if (e.filter.type === 'tags') {
        const index = this.filters.tags.findIndex(tag => tag.code === e.code);
        this.filters.tags.splice(index, 1);
      }
      await this.updateQuery();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.title {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 2px;
  letter-spacing: 0.025em;
  line-height: 42px;
  font-family: 'Roboto', sans-serif;
}

.catalog-list {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
  padding-bottom: 24px;
}
.filter-tag-menu {
  padding: 8px 0;
}
.header {
  margin-top: 24px;
  padding-bottom: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
    ),
    webkit ms
  );
  .filter-description {
    color: $text_color;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    margin-right: 8px;
  }
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    border-bottom: 3px solid $primary_color;
  }
}
.filters {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      flex: 1,
    ),
    webkit ms
  );
  .count {
    color: $text_color;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.5;
    margin-left: 8px;
    margin-bottom: 3px;
  }
  .badges {
    color: $text_color;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    margin-right: 8px;
  }
  .filter-sort-active {
    border-bottom: 3px solid $primary_color;
  }
}
.sort {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .sort-description {
    color: $text_color;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    margin-right: 8px;
  }
}
.nfacet-item {
  padding: 6px;
}
.nfacet-slider {
  margin: 0 8px 16px 8px;
}
.nfacet-num-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  padding-bottom: 8px;
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
    width: 30%;
    background-color: $upper-layer-color;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 16px;
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
          flex-basis: 26%,
        ),
        webkit ms
      );
      max-width: 25.6%;
      background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      padding: 24px;
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
.facets-checkbox {
  justify-content: left;
  margin: 8px 0;
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
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
}
.tag:hover {
  background-color: $primary_color;
}
.tag-active {
  background-color: $primary_color;
}
.pagination {
  margin-bottom: 24px;
}
.product-content {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
@media (max-width: 1450px) {
  .catalog-list {
    width: 85%;
  }
}
</style>
