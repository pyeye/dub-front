<template>
  <div class="catalog-list-wrapper">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="catalog-header">
      <div class="header-title">Результаты "{{ q }}"</div>
      
      <catalog-sort
        class="header-sort"
        :options="filters.sort.options"
        :active="filters.sort.by"
        @change-sort="sortHandler"
      ></catalog-sort>
    </div>
    <div class="product-list-wrapper">
      <catalog-item
        v-for="product in products"
        :key="product.pk"
        :product="product"
      ></catalog-item>
    </div>
    <dub-pagination
      class="pagination-grid"
      :value="filters.page.current"
      :total="filters.page.total"
      @change="paginationHandler"
    ></dub-pagination>
  </div>
<!--
  <div class="search-content">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="header">
      <div class="title">Результаты "{{ q }}"</div>
      <div class="filters">
        <div class="count">Найдено {{ total }}</div>
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
    <div class="product-content">
      <div class="grid">
        <catalog-item
          class="grid-cell"
          v-for="product in products"
          :key="product.pk"
          :product="product">
        </catalog-item>
      </div>
      <dub-pagination
            class="pagination"
            :value="filters.page.current"
            :total="filters.page.total"
            @change="paginationHandler"
          ></dub-pagination>
    </div>
  </div>
-->
</template>

<script>
import CatalogItem from '@/components/catalog/CatalogItem';
import CatalogSort from '@/components/catalog/CatalogSort';
import DubPagination from '@/components/base/DubPagination';
import { getFilters, getQuery } from '@/plugins/utils/catalog';

export default {
  name: 'SearchPage',
  components: {
    CatalogItem,
    CatalogSort,
    DubPagination,
  },
  async asyncData(context) {
    const { query, app } = context;
    const { q } = query;
    const response = await app.$api.get('search/', {
      params: { q },
    });
    const facets = { nfacets: [], sfacets: [] };
    const tags = [];
    const filters = getFilters(query, response.data, facets, tags);
    return {
      filters,
      q,
      products: response.data.items,
      totalProducts: response.data.total,
      facets,
      tags,
    };
  },
  data: () => ({
    breadcrumbs() {
      return [{ label: 'Главная', link: '/' }, { label: 'Поиск', link: '' }];
    },
  }),
  methods: {
    async paginationHandler(e) {
      this.$set(this.filters.page, 'current', e);
      const filtersQuery = getQuery(this.filters);
      const query = { ...this.$route.query, ...filtersQuery };
      query.page = this.filters.page.current;
      this.$router.push({ query });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.getProducts(query);
    },
    async sortHandler(e) {
      this.$set(this.filters.sort, 'by', e);
      const filtersQuery = getQuery(this.filters);
      const query = { ...this.$route.query, ...filtersQuery };
      query.sort =
        this.filters.sort.by.direction === 'none'
          ? undefined
          : `${this.filters.sort.by.code}-${this.filters.sort.by.direction}`;
      this.$set(this.filters.page, 'current', 1);
      query.page = 1;
      this.$router.push({ query });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.getProducts(query);
    },
    async getProducts(query) {
      const products = await this.$api.get('search/', {
        params: { q: this.q, query },
      });
      this.products = products.items;
      this.totalProducts = products.total;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.catalog-list-wrapper {
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
}
.catalog-header {
  margin: 32px 0 16px 0;
  grid-column: main-start / main-end;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
    ),
    webkit ms
  );
  .header-title {
    font-size: 28px;
    font-weight: 300;
    line-height: 32px;
    font-family: $main_font;
    letter-spacing: 0px;
    z-index: 1;
  }
  .total-products {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    font-family: $main_font;
    letter-spacing: 0px;
    margin: 0 24px 0 8px;
  }
  .header-sort {
    flex: 1;
  }
}
.product-list-wrapper {
  grid-column: main-start / main-end;
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  grid-gap: 16px;
  padding: 24px 0;
}
.product-list-wrapper > div:not(.first) {
  grid-column-start: auto;
}
.product-list-wrapper > div {
  grid-column: col-start 1 / span 3;
}
.product-list-wrapper > div:not(:nth-child(4n))::after {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  right: -8px;
  top: 0;
  background-color: rgba(40, 40, 40, 0.2);
}
.pagination-grid {
  grid-column: main-start / main-end;
  grid-row: 4;
}
.search-content {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
  padding-bottom: 24px;

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
    .title {
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 2px;
      letter-spacing: 0.025em;
      line-height: 42px;
      font-family: $accent_font;
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
  }
  .product-content {
    @include prefix(
      (
        display: flex,
        flex-direction: column,
      ),
      webkit ms
    );
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
    .pagination {
      margin-bottom: 24px;
    }
  }
}

@media (max-width: 1450px) {
  .search-content {
    width: 85%;
  }
}
</style>
