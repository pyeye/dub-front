<template>
  <div class="news-detail">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="detail-content">
      <div class="hero" :style="'background-image: url('+ sale.image.src +');'">
        <div class="cover"></div>
        <div class="cover-text">
          <div class="title">{{ sale.name }}</div>
          <div class="text-secondary">
            <div class="date">
              {{ sale.fdate_start.day }}
              {{ sale.fdate_start.month }}
              {{ sale.fdate_start.year }}
            </div>
          </div>
        </div>
      </div>
      <div class="description">
        {{ sale.description }}
      </div>
    </div>
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
    <div class="filter-tag-menu">
      <div v-swiper:tagSwiper="swiperTagOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="tag in tags" :key="tag.pk">
            <div
              class="tag"
              :class="{ 'tag-active': filters.tags.some(t => t.pk === tag.pk) }"
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
          <dub-collapse-item :ref="`${facet.slug}Collapse`" v-for="facet in facets.sfacets" :key="facet.slug">
            <div slot="header" class="collapse-title">{{facet.name}}</div>
             
            <div v-for="item in facet.values" :key="item.pk">
              <dub-check
                v-model="filters.sfacets"
                :val="item"
                :extend-val="{facetName: facet.name, facetSlug: facet.slug}"
                :label="`${item.name} (${item.count})`"
                @input="updateQuery"
              />
            </div>
            <div class="show-all" :ref="`${facet.slug}Show`" @click="getAllFacetValues(facet)">Показать все</div>
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

export default {
  name: 'DubSaleDetail',
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
  async asyncData(context) {
    const { store, params, app } = context;
    const sale = await this.getSale(store, params, app);
    return {
      sale,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Акции', link: '/news' },
        { label: this.sale.name, link: '' },
      ];
    },
  },
  methods: {
    async getSale(store, params, app) {
      const { id } = params;
      let sale = store.getters['sales/sale'](id);
      if (!sale) {
        const url = `sales/${id}/`;
        const { data } = await app.$api.get(url);
        sale = data;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-detail {
  position: relative;
  width: 80%;
  margin: 0 auto;
}
.detail-content {
  position: relative;
  margin: 24px auto;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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
  opacity: 0.65;
}
.cover-text {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  color: #fafafa;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 24px;
  font-family: 'Roboto', sans-serif;
  padding: 24px;
  opacity: 1;
  transition: opacity 0.25s ease;
  .text-secondary {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: center,
      ),
      webkit ms
    );
    font-size: 16px;
    line-height: 16px;
    margin-top: 16px;
    font-weight: 400;
    opacity: 0.85;
    .date {
      margin-right: 16px;
      padding-bottom: 4px;
    }
    .category {
      border-bottom: 2px solid $primary_color;
      color: $body_color;
      padding-bottom: 4px;
      font-size: 1em;
      letter-spacing: 0.2px;
    }
  }
}
.description {
  padding: 24px;
  font-size: 14px;
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
  .news-detail {
    width: 85%;
  }
}
</style>
