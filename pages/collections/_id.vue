<template>
<div class="catalog-list-wrapper">
  <dub-breadcrumbs :breadcrumbs="breadcrumbs" class="breadcrumbs"></dub-breadcrumbs>

  <div class="catalog-header">
    <div class="header-title">{{ collection.name }}</div>
    <div class="total-products">Найдено {{ totalProducts }}</div>
    
    <filter-items class="badges" :filters="filters" @delete-badge="deleteBadge"></filter-items>
    <catalog-sort
      class="header-sort"
      :options="filters.sort.options"
      :active="filters.sort.by"
      @change-sort="sortHandler"
    ></catalog-sort>
  </div>

  <div class="filter-panel-wrapper">
    <div class="overlay"></div>
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
  <div class="news-detail">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      </div>
    </div>
    <div class="hero-row">
      <div class="description">
        <div class="description-title">
          {{ collection.name }}
        </div>
        <div class="description-box">
          <div class="description-text">{{ collection.description }}</div>
        </div>
      </div>
      <div class="hero" :style="getBgImage(collection.image.src)"></div>
    </div>

    <div class="header">
      <div class="title-row">
        <div class="title">Товары в коллекции</div>
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
  -->
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
  name: 'DubCollectionDetail',
  components: {
    CatalogItem,
    FilterItems,
    DubPagination,
    CatalogTags,
    CatalogFacets,
    DubSelect,
  },
  mixins: [CatalogMixin],
  data: () => ({
    baseUrl: 'http://api.mydubbelsite.ru/',
  }),
  async asyncData(context) {
    const { query, params, app } = context;
    const { id } = params;
    const url = `collections/${id}/`;
    const [products, facets, tags, collection] = await Promise.all([
      app.$api.getProducts({ collections: id, query }),
      app.$api.getFacets({ collections: id, query }),
      app.$api.getTags({ collections: id, query }),
      app.$api.get(url),
    ]);
    return {
      collection: collection.data,
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
        { label: 'Коллекции', link: '' },
        { label: this.collection.name, link: '' },
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
      const products = await this.$api.getProducts({ collections: id, query });
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
      const products = await this.$api.getProducts({ collections: id, query });
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
        this.$api.getProducts({ collections: id, query }),
        this.$api.getFacets({ collections: id, query }),
        this.$api.getTags({ collections: id, query }),
      ]);
      this.tags = tags;
      this.products = products.items;
      this.totalProducts = products.total;
      this.facets = facets;
    },
    getBgImage(imageUrl) {
      return `background-image: url(${this.baseUrl}${imageUrl});`;
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
.breadcrumbs {
  margin: 16px 0;
  grid-column: main-start / main-end;
}
.catalog-header {
  margin: 32px 0 4px 0;
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
    font-size: 54px;
    font-weight: 300;
    line-height: 64px;
    font-family: $main_font;
    letter-spacing: 0px;
    margin-bottom: -24px;
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

.filter-panel-wrapper {
  grid-column: full-start / 6;
  grid-row: 3 / 4;
  display: grid;
  grid-template-columns: [full-start] minmax(16px, 1fr) [main-start] repeat(
      4,
      [col-start] minmax(8px, 100px)
    );
  grid-column-gap: 24px;
  align-items: start;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.filter-panel {
  grid-column: 2 / -1;
  grid-row: 1;
  position: relative;
  padding: 24px 0;
}
.overlay {
  position: relative;
  height: 100%;
  grid-column: 1 / -1;
  grid-row: 1;
  background-color: $overlay_color;
}
.product-list-wrapper {
  grid-column: 6 / main-end;
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  grid-gap: 16px;
  padding: 24px 0;
}
.product-list-wrapper > div:not(.first) {
  grid-column-start: auto;
}
.product-list-wrapper > div {
  grid-column: col-start 1 / span 4;
}
.product-list-wrapper > div:not(:nth-child(3n))::after {
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
  right: -5.5%;
  width: 70%;
  min-height: 500px;
  z-index: 1;
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
  margin-bottom: 48px;
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
  font-family: $accent_font;
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
.description-text {
  padding: 16px 32% 24px 24px;
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
  font-family: $accent_font;
  opacity: 0.7;
  color: $text_color;
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
    width: 90%;
  }
  .hero-content {
    width: 90%;
  }
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
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
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
  .filter-sort-active {
    border-bottom: 3px solid $primary_color;
  }
}
.badges {
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
  letter-spacing: -0.012em;
  margin: 8px 8px 8px 0;
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
