<template>
  <div class="news-detail">
    <div class="hero" :style="'background-image: url('+ sale.image.src +');'">
      <div class="cover"></div>
      <div class="hero-content">
        <div class="breadcrumbs">
          <div class="breadcrumb" v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.label">
            <div class="breadcrumb-label" :class="{'breadcrumb-disabled': index + 1 === breadcrumbs.length}">
              <nuxt-link :to="breadcrumb.link" >{{breadcrumb.label}}</nuxt-link>
            </div>
            <div class="breadcrumb-separator" v-if="index + 1 !== breadcrumbs.length">
              <dub-icon class="icon"><icon-right/></dub-icon>
            </div>
          </div>
        </div>
      
        <div class="cover-text">
          <div class="title">{{ sale.name }}</div>
          <div class="text-secondary">
            <div class="date">
              C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }}
              по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
            </div>
          </div>
        </div>
        <div class="description">
          {{ sale.description }}
        </div>
      </div>
      
    </div>
    <div class="sales-products">
      <div class="header">
        <div class="title">Товары</div>
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
     
  </div>
</template>

<script>
import CatalogItem from '@/components/catalog/CatalogItem';
import FilterItems from '@/components/catalog/FilterItems';
import CatalogTags from '@/components/catalog/CatalogTags';
import CatalogFacets from '@/components/catalog/CatalogFacets';
import DubPagination from '@/components/base/DubPagination';
import DubSelect from '@/components/base/DubSelect';
import CatalogMixin from '@/mixins/catalog';

export default {
  name: 'DubSaleDetail',
  components: {
    CatalogItem,
    FilterItems,
    DubPagination,
    CatalogTags,
    CatalogFacets,
    DubSelect,
  },
  mixins: [CatalogMixin],
  async asyncData(context) {
    const { query, params, app } = context;
    const { id } = params;
    const url = `sales/${id}/`;
    const [products, facets, tags, sale] = await Promise.all([
      app.$api.getProducts({ sales: id, query }),
      app.$api.getFacets({ sales: id, query }),
      app.$api.getTags({ sales: id, query }),
      app.$api.get(url),
    ]);
    return {
      sale: sale.data,
      products: products.items,
      totalProducts: products.total,
      facets,
      tags,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Акции', link: '/sales/catalog' },
        { label: this.sale.name, link: '' },
      ];
    },
  },
  methods: {
    async paginationHandler(e) {
      this.filters.page.current = e;
      const query = Object.assign({}, this.$route.query);
      const { id } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.page = this.filters.page.current;
      this.$router.push({ query });
      const products = await this.$api.getProducts({ sales: id, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async selectHandler(e) {
      this.filters.sort.by = e;
      const query = Object.assign({}, this.$route.query);
      const { id } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.sort = this.filters.sort.by.value;
      this.$router.push({ query });
      const products = await this.$api.getProducts({ sales: id, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async updateQuery() {
      const query = Object.assign({}, this.$route.query);
      const { id } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      this.$router.push({ query });
      const [products, facets, tags] = await Promise.all([
        this.$api.getProducts({ sales: id, query }),
        this.$api.getFacets({ sales: id, query }),
        this.$api.getTags({ sales: id, query }),
      ]);
      this.tags = tags;
      this.products = products.items;
      this.totalProducts = products.total;
      this.facets = facets;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-detail {
  position: relative;
  width: 100%;
  margin: 0 auto;
}
.sales-products {
  position: relative;
  width: 80%;
  margin: 0 auto;
}
.hero-content {
  position: relative;
  width: 80%;
  height: 100%;
  margin: 0 auto;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.hero {
  position: relative;
  width: 100%;
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #000;
  transition: opacity 0.25s ease;
  opacity: 0.9;
}
.cover-text {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      flex: 1,
      justify-content: flex-end,
    ),
    webkit ms
  );
  z-index: 1;
  color: #fafafa;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-family: 'Roboto', sans-serif;
  padding: 12px 0;
  opacity: 1;
  transition: opacity 0.25s ease;
  .text-secondary {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: flex-end,
      ),
      webkit ms
    );
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    font-weight: 400;
    opacity: 0.85;
    z-index: 1;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
  }
}
.description {
  padding: 12px 0 24px 0;
  font-size: 14px;
  z-index: 1;
  color: #fafafa;
}
.icon-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  font-weight: 400;
  width: 28px;
  height: 28px;
  color: $body_color;
}
a {
  text-decoration: none;
}
@media (max-width: 1450px) {
  .sales-products {
    width: 85%;
  }
  .hero-content {
    width: 85%;
  }
}
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

.breadcrumbs {
  margin: 0;
  color: #fafafa !important;
  z-index: 1;
  a {
    text-decoration: none;
    color: #fafafa;
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
.breadcrumbs {
  margin: 0;
  color: #fafafa !important;
  z-index: 1;
  padding-top: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.breadcrumb {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.breadcrumb-label {
  padding-bottom: 2px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
  letter-spacing: 0.01em;
  &:hover {
    border-bottom: 2px solid $primary_color;
    padding-bottom: 0;
  }
}
.breadcrumb-separator {
  width: 20px;
  height: 22px;
  opacity: 0.8;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.breadcrumb-disabled {
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  opacity: 0.7;
}
a {
  text-decoration: none;
  color: #fafafa;
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
