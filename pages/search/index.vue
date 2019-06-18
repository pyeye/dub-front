<template>
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
</template>

<script>
import CatalogItem from '@/components/catalog/CatalogItem';

import DubSelect from '@/components/base/DubSelect';
import DubPagination from '@/components/base/DubPagination';

export default {
  name: 'SearchPage',
  watchQuery: true,
  components: {
    CatalogItem,
    DubPagination,
    DubSelect,
  },
  async asyncData(context) {
    const { query, app } = context;
    const { q } = query;
    const { data } = await app.$api.get('search/', {
      params: { q },
    });

    const { total, items: products } = data;

    const page = {
      total: 1,
      current: 1,
      size: 4,
    };

    if (query.page !== undefined) {
      page.current = Number(query.page);
    }
    page.total = Math.ceil(total / page.size);

    const sort = {
      by: {
        name: 'названию (А-Я)',
        value: 'name-asc',
      },
      options: [
        { name: 'цене (по возрастанию)', value: 'price-asc' },
        { name: 'цене (по убыванию)', value: 'price-desc' },
        { name: 'названию (А-Я)', value: 'name-asc' },
        { name: 'названию (Я-А)', value: 'name-desc' },
      ],
    };

    if (query.sort !== undefined) {
      const queryOption = sort.options.find(option => option.value === query.sort);
      sort.by = queryOption;
    }
    return {
      total,
      products,
      q,
      filters: {
        page,
        sort,
      },
    };
  },
  data: () => ({
    breadcrumbs: [],
  }),
  methods: {
    async selectHandler(e) {
      this.filters.sort.by = e;
      const query = Object.assign({}, this.$route.query);
      query.sort = this.filters.sort.by.value;
      this.$router.push({ query });
      const { data } = await this.$api.get('search/', {
        params: {
          q: this.q,
          sort: query.sort,
          page: query.page,
        },
      });
      this.total = data.total;
      this.products = data.items;
    },
    async paginationHandler(e) {
      this.filters.page.current = e;
      const query = Object.assign({}, this.$route.query);
      query.page = this.filters.page.current;
      this.$router.push({ query });
      const { data } = await this.$api.get('search/', {
        params: {
          q: this.q,
          sort: query.sort,
          page: query.page,
        },
      });
      this.total = data.total;
      this.products = data.items;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
      font-family: 'Roboto', sans-serif;
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
