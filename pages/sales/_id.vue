<template>
  <div class="news-detail">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      </div>
    </div>
    <div class="hero-row">
      <div class="description">
        <div class="description-title">
          {{ sale.name }}
        </div>
        <div class="description-box">
          <div class="description-date">
            C {{ sale.fdate_start.day }} {{ sale.fdate_start.month }}
            по {{ sale.fdate_end.day }} {{ sale.fdate_end.month }}
          </div>
          <div class="description-text">{{ sale.description }}</div>
        </div>
      </div>
      
      <div class="hero" :style="'background-image: url('+ sale.image.src +');'"></div>
    </div>

    <div class="header">
      <div class="title-row">
        <div class="title">Товары в акции</div>
        <div class="sub-title"> Найдено {{ totalProducts }}</div>
      </div>
    </div>

    <div class="sales-products">
      <div class="header">
        <div class="filters">
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
  width: 1500px;
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
  position: absolute;
  width: 65%;
  top: 0;
  right: 0;
  z-index: 1;
  min-height: 500px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12),
    0 1px 8px 0 rgba(0, 0, 0, 0.2);
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
  font-family: $accent_font;
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
.hero-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  position: relative;
}
.description {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  width: 35%;
  margin-left: 10%;
}
.description-title {
  padding: 16px 32% 16px 24px;
  opacity: 0.7;
  color: $text_color;
  font-size: 36px;
  line-height: 42px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.description-box {
  background-color: $upper_layer_color;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  min-height: 450px;
}
.description-date {
  padding: 24px 32% 8px 24px;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.description-text {
  padding: 16px 32% 24px 24px;
  opacity: 0.8;
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
.title {
  font-size: 42px;
  letter-spacing: 8px;
  line-height: 50px;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.sub-title {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 16px;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.filter-tag-menu {
  padding: 8px 0;
}
.header {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
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
.title-row {
  margin: 26px 0;
  width: 60%;
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
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
    width: 22%;
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
          flex-basis: 19.62%,
        ),
        webkit ms
      );
      max-width: 19.62%;
      background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      padding: 24px;
      margin: 0 0 32px 16px;
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
  width: 100%;
}
@media (max-width: 1680px) {
  .description {
    margin-left: 5%;
  }
  .description-title {
    padding: 16px 20% 16px 24px;
  }
  .description-date {
    padding: 24px 20% 8px 24px;
  }
  .description-text {
    padding: 16px 20% 24px 24px;
  }
}
@media (max-width: 1599px) {
  .sales-products {
    width: 1250px;
  }
  .content {
    .grid {
      .grid-cell {
        max-width: 26.68%;
        @include prefix(
          (
            flex-basis: 26.68%,
          ),
          webkit ms
        );
      }
    }
  }
}
@media (max-width: 1350px) {
  .sales-products {
    width: 1150px;
  }
  .content {
    .filter-panel {
      width: 25%;
    }
    .grid {
      .grid-cell {
        max-width: 25.9%;
        @include prefix(
          (
            flex-basis: 25.9%,
          ),
          webkit ms
        );
      }
    }
  }
  .hero {
    min-height: 400px;
  }
  .description-box {
    min-height: 300px;
  }
}
</style>
