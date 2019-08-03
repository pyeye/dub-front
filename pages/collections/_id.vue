<template>
  <div class="news-detail">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
        <div class="title">{{ collection.name }}</div>
      </div>
    </div>
    <div class="hero-row">
      <div class="description-box">
        <div class="description-text">{{ collection.description }}</div>
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
  width: 80%;
  margin: 0 0 0 auto;
  min-height: 400px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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
.description-box {
  width: 30%;
  transform: translate(25%, 48px);
  background-color: $upper_layer_color;
  z-index: 1;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.description-text {
  padding: 24px;
  opacity: 0.7;
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
  margin: 14px 0;
  font-size: 36px;
  letter-spacing: 5px;
  margin-right: -5px;
  line-height: 40px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
  text-align: center;
}
.sub-title {
  font-size: 14px;
  letter-spacing: 0.05em;
  line-height: 16px;
  font-family: 'Roboto', sans-serif;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
  text-align: center;
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
  margin: 24px 0;
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
  width: 90%;
}
@media (max-width: 1450px) {
  .catalog-list {
    width: 90%;
  }
}
</style>
