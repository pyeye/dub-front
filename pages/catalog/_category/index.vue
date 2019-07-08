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

    <catalog-tags :tags="tags" :selected-tags="filters.tags" @tag-selected="tagHandler"></catalog-tags>

    <div class="content">
      <div class="filter-panel">
        <catalog-facets 
          :sfacets="facets.sfacets"
          :selected-sfacets="filters.sfacets"
          :nfacets="filters.nfacets"
          @update-facet-values="updateFacetValues"
          @slider-selected="sliderHandler"
          @number-selected="numberHandler"
          @checkbox-selected="checkboxHandler"
        ></catalog-facets>
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
import CatalogTags from '@/components/catalog/CatalogTags';
import CatalogFacets from '@/components/catalog/CatalogFacets';
import DubPagination from '@/components/base/DubPagination';
import DubSelect from '@/components/base/DubSelect';

import debounce from '@/plugins/utils/debounce';

export default {
  name: 'ProductList',
  components: {
    CatalogItem,
    FilterItems,
    DubPagination,
    CatalogTags,
    CatalogFacets,
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
        size: 24,
      },
      sort: {
        by: {
          name: 'названию (А-Я)',
          value: 'name-asc',
        },
        options: [],
      },
    },
  }),
  async asyncData(context) {
    const { params, query, app } = context;
    const { category } = params;
    const [products, facets, tags] = await Promise.all([
      app.$api.getProducts({ category, query }),
      app.$api.getFacets({ category, query }),
      app.$api.getTags({ category, query }),
    ]);
    return {
      products: products.items,
      totalProducts: products.total,
      facets,
      tags,
    };
  },
  created() {
    const { query } = this.$route;
    this.filters = this.getFilters(query);
  },
  computed: {
    category() {
      const { category } = this.$route.params;
      return this.$store.getters['products/category'](category) || {};
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
      const encodedTags = tags.map(tag => tag.pk);
      return encodedTags.length === 0 ? [] : encodedTags.join();
    },
    encodeSFacet(facets) {
      const facetsQuery = {};
      const encodedFacets = [];
      facets.forEach(facet => {
        if (facet.facetSlug in facetsQuery === false) {
          facetsQuery[facet.facetSlug] = [];
        }
        facetsQuery[facet.facetSlug].push(facet.pk);
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
        const tag = this.tags.find(t => t.pk === tagCode);
        const decodedTag = {
          name: tag.name,
          pk: tag.pk,
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
      const values = facet.values.filter(v => codes.includes(v.pk));
      return values.map(value => ({
        facetSlug: facet.slug,
        facetName: facet.name,
        pk: value.pk,
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
      this.$set(this.filters.page, 'current', 1);
      query.page = 1;
      this.$router.push({ query });
      const [products, facets, tags] = await Promise.all([
        this.$api.getProducts({ category, query }),
        this.$api.getFacets({ category, query }),
        this.$api.getTags({ category, query }),
      ]);
      this.tags = tags;
      this.products = products.items;
      this.totalProducts = products.total;
      this.facets = facets;
    },
    async sliderHandler(payload) {
      const { value, nfacet } = payload;
      const nfacetIndex = this.filters.nfacets.findIndex(n => n.slug === nfacet.slug);
      this.filters.nfacets[nfacetIndex].value = value;
      await this.updateQuery();
    },
    async numberHandler(payload) {
      const { value, nfacet, type } = payload;
      const [minVal, maxVal] = nfacet.value;
      const nfacetIndex = this.filters.nfacets.findIndex(n => n.slug === nfacet.slug);
      if (type === 'min') {
        this.filters.nfacets[nfacetIndex].value = [Number(value), maxVal];
      } else {
        this.filters.nfacets[nfacetIndex].value = [minVal, Number(value)];
      }
      await this.debounceUpdateQuery();
    },
    async tagHandler(tag) {
      const index = this.filters.tags.findIndex(t => t.pk === tag.pk);
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
      const products = await this.$api.getProducts({ category, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async selectHandler(e) {
      this.filters.sort.by = e;
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.sort = this.filters.sort.by.value;
      this.$set(this.filters.page, 'current', 1);
      query.page = 1;
      this.$router.push({ query });
      const products = await this.$api.getProducts({ category, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async checkboxHandler(payload) {
      const sfacetIndex = this.filters.sfacets.findIndex(s => s.pk === payload.pk);
      if (sfacetIndex === -1) {
        this.filters.sfacets.push(payload);
      } else {
        this.filters.sfacets.splice(sfacetIndex, 1);
      }
      await this.updateQuery();
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
        const index = this.filters.tags.findIndex(tag => tag.pk === e.pk);
        this.filters.tags.splice(index, 1);
      }
      await this.updateQuery();
    },
    updateFacetValues(payload) {
      const { facet, values } = payload;
      const facetIndex = this.facets.sfacets.findIndex(sfacet => sfacet.slug === facet.slug);
      this.facets.sfacets[facetIndex].values = values;
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
.content {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  padding-top: 24px;
  .filter-panel {
    position: relative;
    height: 100%;
    width: 25%;
    background-color: $upper-layer-color;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 16px;
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
  width: 85%;
}
@media (max-width: 1450px) {
  .catalog-list {
    width: 85%;
  }
}
</style>
