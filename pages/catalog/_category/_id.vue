<template>
  <div class="product-detail">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="content">
      <div class="product-image">
        <div class="image-box">
          <img class="image" :src="'http://api.mydubbelsite.ru/' + selectedInstance.image">
        </div>
      </div>
      <div class="product-info">
        <div class="name">
          {{ product.category.name }}
          {{ product.name }},
          {{selectedInstance.measure_count}}
          {{selectedInstance.measure_value}}
        </div>
        <div class="info-box">
          <div class="info-main">
            <div class="tab-panel">
              <div
                v-response.small.fast
                class="tab-item"
                @click="tabIndex = 'main'"
                :class="{ 'tab-item-active': tabIndex == 'main' }">
                Характеристики
              </div>
              <div
                v-response.small.fast
                class="tab-item"
                @click="tabIndex = 'description'"
                :class="{ 'tab-item-active': tabIndex == 'description' }">
                Описание
              </div>
            </div>

            <div v-if="tabIndex == 'main'">
              <div
                class="info-list"
                v-for="number_facet in displayNFacets"
                :key="number_facet.code"
              >
                <div class="info-description">{{number_facet.name}}:</div>
                <div class="description-flex"></div>
                <div class="info-value row">
                  <div class="row-item">
                    <nuxt-link 
                      class="list-link"
:to="`/catalog/${product.category.slug}?nfacets=${number_facet.slug}:${number_facet.value}-${number_facet.value}`">
                      {{number_facet.value}}{{number_facet.suffix}}
                    </nuxt-link>
                    
                  </div>
                </div>
              </div>
            
              <div
                class="info-list"
                v-for="string_facet in product.string_facets"
                :key="string_facet.code"
              >
                <div class="info-description">{{string_facet.name}}:</div>
                <div class="description-flex"></div>
                <div class="info-value row">
                  <div
                    class="row-item"
                    v-for="value in string_facet.values"
                    :key="value.code">
                    <nuxt-link 
                      class="list-link"
                      :to="`/catalog/${product.category.slug}?sfacets=${string_facet.slug}:${value.code}`">
                      {{ value.name }}
                    </nuxt-link>
                  </div>
                </div>
            </div>
            
            </div>
            <div class="secondary-text" v-if="tabIndex == 'description'">
            Brancott Estate, Marlborough Sauvignon Blanc — необычайно яркое и насыщенное вино,
            произведенное из винограда, выращенного в уникальном терруаре новозеландского
            региона Мальборо. Совиньон Блан выращивается на виноградниках,
            расположенных в южной части долины Вайрау. Сбор начинается середине марта,
            а заканчивается — в середине апреля. Свежий фруктовый вкус вина многим обязан
            специальной технологии винификации. Один из главных моментов винификации —
            чрезвычайно тщательный и мягкий отжим плодов с целью получения чистого,
            прозрачного сока для ферментации, которая проходит при низкой температуре в
            стальных емкостях.
          </div>

          </div>
          <div class="info-price">
            <div class="amount">
              <div class="description">Объемы:</div>
              <div class="value">
                <div
                  class="item"
                  v-response.small.fast
                  v-for="productInstance in product.products"
                  :key="productInstance.sku"
                  :class="{ 'price-active': selectedInstance.sku == productInstance.sku }"
                  @click="selectInstance(productInstance)"
                >{{productInstance.measure_count}}{{productInstance.measure_value}}</div>
              </div>
            </div>
            <div class="amount">
              <div class="description">Артикул:</div>
              <div class="value">#{{selectedInstance.sku}}</div>
            </div>
            <div class="amount">
              <div class="description">Кол-во в упаковке:</div>
              <div class="value">{{selectedInstance.package_amount}}</div>
            </div>
            <div class="storage">
              <div class="description">В наличии:</div>
              <div class="value">{{selectedInstance.stock_balance}} шт.</div>
            </div>
            <div class="price-row">
              <div class="price-value">{{selectedInstance.price}}&#x20bd;</div>
            </div>
          </div>
        </div>
        <div class="flex"></div>
        <div class="secondary-info">
          <div class="tag-row">
            <div class="tag-title">Метки:</div>
            <div class="filter-tag-menu">
      <div v-swiper:tagSwiper="swiperTagOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="tag in product.tags" :key="tag.code">
            <div class="tag" v-response.small.masked>{{tag.name}}</div>
          </div>
        </div>
      </div>
    </div>
          </div>

        </div>
      </div>
    </div>


    <div class="watched-products" v-if="watchedProducts.length > 0">
      <div class="watched-title">Вы смотрели:</div>
      <div v-swiper:watchedSwiper="swiperBestOption" class="watched-slider">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide watched-slide"
            v-for="watchedProduct in watchedProducts"
            :key="watchedProduct.pk"
          >
            <bestsellers-item
              class="grid-cell"
              :product="watchedProduct"
              :category="watchedProduct.category"
            ></bestsellers-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BestsellersItem from '@/components/home/BestsellersItem';

export default {
  name: 'ProductDetail',
  components: {
    BestsellersItem,
  },
  data: () => ({
    swiperBestOption: {
      slidesPerView: 'auto',
      spaceBetween: 15,
      freeMode: true,
      speed: 2000,
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
    exclude: {
      nfacets: ['price'],
    },
    tabIndex: 'main',
  }),
  async asyncData(context) {
    const { store, params, app, query } = context;
    const { id, category } = params;
    let product = store.getters['products/product'](category, id);
    if (!product) {
      const url = `products/${id}/`;
      const { data } = await app.$api.get(url);
      product = data;
    }
    const { sku } = query;
    let [selectedInstance] = product.products;
    if (sku !== undefined) {
      selectedInstance = product.products.find(p => p.sku === Number(sku));
    }
    return {
      product,
      selectedInstance,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        {
          label: this.product.category.name,
          link: `/catalog/${this.product.category.slug}`,
        },
        { label: this.product.name, link: '' },
      ];
    },
    watchedProducts() {
      const watchedFromStore = this.$store.getters['session/watched/products'];
      const watched = watchedFromStore.filter(product => product.pk !== this.product.pk);
      return watched;
    },
    displayNFacets() {
      return this.product.number_facets.filter(
        nfacet => !this.exclude.nfacets.includes(nfacet.slug)
      );
    },
  },
  async mounted() {
    await this.$store.dispatch('session/watched/addProduct', this.product);
  },
  methods: {
    selectInstance(instance) {
      this.selectedInstance = instance;
      const query = Object.assign({}, this.$route.query);
      query.sku = instance.sku;
      this.$router.push({ query });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: $text_color;
}
.list-link {
  &:hover {
    border-bottom: 2px solid $primary_color;
  }
}

.product-detail {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.content {
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  width: 100%;
  margin: 24px 0;
}
.product-image {
  width: 25%;
  padding: 16px;
  margin: 32px 0;
  border-right: 1px solid #e6e3da;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: bottom,
      justify-content: center,
    ),
    webkit ms
  );
}
.product-info {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  width: 70%;
  .name {
    padding: 24px;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
  }
}
.image-box {
  position: relative;
  text-align: center;
  padding: 0 16px;
}
.image {
  max-height: 450px;
  max-width: 100%;
}
.info-box {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .info-main {
    width: 65%;
    border-right: 1px solid #e6e3da;
    padding: 0 24px 24px 24px;
    .title {
      padding: 4px;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.01em;
      line-height: 36px;
      font-family: 'Roboto', sans-serif;
    }
    .info-list {
      @include prefix(
        (
          display: flex,
          flex-direction: row,
        ),
        webkit ms
      );
      padding: 2px;
      font-size: 16px;
      font-weight: 600;
      opacity: 0.7;
      letter-spacing: -0.012em;
      line-height: 24px;
      text-transform: capitalize;
      .description-flex {
        flex: 1;
      }
    }
  }
  .info-price {
    padding: 66px 24px 24px 24px;
    width: 35%;
    .price-row {
      @include prefix(
        (
          display: flex,
          flex-direction: row-reverse,
          justify-content: space-between,
        ),
        webkit ms
      );
      padding-bottom: 24px;
    }
    .price-value {
      font-family: 'Roboto', sans-serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 0.8px;
      line-height: 36px;
    }
    .za {
      margin-top: 5px;
      margin-right: 8px;
      font-size: 18px;
      line-height: 25px;
    }
    .price-selector {
      width: 90px;
    }
  }
}
.flex {
  flex: 1;
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
  padding: 2px 0;
  .description {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    line-height: 24px;
  }
  .item {
    position: relative;
    opacity: 0.7;
    margin-left: 8px;
    cursor: pointer;
  }
  .value {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    line-height: 24px;
    .price-active {
      border-bottom: 3px solid $primary_color;
      opacity: 1;
    }
  }
}
.storage {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );
  padding: 2px 0 16px 0;
  .description {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    line-height: 24px;
  }
  .value {
    color: #43a047;
    font-size: 16px;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: -0.012em;
    line-height: 24px;
  }
}
.actions {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );
  .quantity-action {
    margin-top: 16px;
    width: 47%;
    .num {
      width: 100%;
      height: 150px;
    }
  }
}
.secondary-info {
  margin-top: 24px;
  .title {
    padding: 16px 24px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 36px;
    font-family: 'Roboto', sans-serif;
  }
  .secondary-text {
    padding: 8px 24px;
    font-size: 14px;
    letter-spacing: -0.01em;
    line-height: 26px;
    opacity: 0.7;
  }
}
.row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.button {
  margin-top: 16px;
  width: 47%;
}
.row-item:not(:last-of-type):after {
  content: ',';
  margin-right: 4px;
}
.ribbon {
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  height: 30px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  padding: 0 8px;
  position: absolute;
  left: -8px;
  top: 24px;
  opacity: 0.9;
}
.ribbon:before,
.ribbon:after {
  content: '';
  position: absolute;
}
.ribbon:before {
  height: 0;
  width: 0;
  top: -8.5px;
  left: 0.1px;
  border-left: 9px solid transparent;
}
.rating {
  font-size: 16px;
  letter-spacing: -0.012em;
  font-weight: 600;
  opacity: 0.8;
}
.no-rating {
  color: $text_color;
  background: $primary_color;
}
.no-rating:before {
  border-bottom: 9px solid darken($primary_color, 10);
}
.bad-rating {
  color: $upper_layer_color;
  background: $error_color;
}
.bad-rating:before {
  border-bottom: 9px solid darken($error_color, 10);
}
.meh-rating {
  color: $upper_layer_color;
  background: #f4511e;
}
.meh-rating:before {
  border-bottom: 9px solid darken(#f4511e, 10);
}
.good-rating {
  color: $upper_layer_color;
  background: #42a85f;
}
.good-rating:before {
  border-bottom: 9px solid darken(#42a85f, 10);
}
.rating-popover {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  padding: 0 4px;
}
.popover-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  margin: 4px 0;
}
.popover-title {
  color: $text_color;
  font-size: 18px;
  letter-spacing: -0.012em;
  font-weight: 600;
  opacity: 0.7;
  line-height: 22px;
}
.popover-value {
  color: $text_color;
  font-size: 16px;
  letter-spacing: -0.012em;
  font-weight: 600;
  opacity: 0.7;
  line-height: 20px;
  margin-left: 16px;
}
.popover-flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
}
.popover-button {
  margin-top: 4px;
  width: 100%;
}
.bad-rating-value {
  color: $error_color;
}
.meh-rating-value {
  color: #f4511e;
}
.good-rating-value {
  color: #42a85f;
}
.watched-products {
  margin: 24px 0;
}
.watched-title {
  width: 100%;
  padding: 16px 0;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 0.025em;
  line-height: 40px;
  font-family: 'Roboto', sans-serif;
  opacity: 0.9;
  color: $text_color;
}
.watched-slider {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
}
.watched-slide {
  width: 20%;
}
.grid-cell {
  position: relative;
  height: 100%;
  margin-bottom: 32px;
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.25s ease;
}

.filter-tag-menu {
  position: relative;
  width: 80%;
  padding: 8px 0 8px 0;
}

.tag-row {
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}

.tag-title {
  font-weight: 600;
  opacity: 0.7;
  font-size: 16px;
  margin: 12px 16px 16px 24px;
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
  width: 100px;
}
.tag:hover {
  background-color: $primary_color;
}
.tag-active {
  background-color: $primary_color;
}

.tab-panel {
  z-index: 1;
  margin: 4px 0 16px 0;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}

.tab-item {
  position: relative;
  margin: 16px 24px 4px 0;
  color: $text_color;
  padding-bottom: 3px;
  cursor: pointer;
  font-weight: 600;
  opacity: 0.7;
  font-size: 16px;
}
.tab-item:hover {
  border-bottom: 3px solid $primary_color;
  padding-bottom: 0;
}

.tab-item-active {
  border-bottom: 3px solid $primary_color;
  opacity: 1;
  padding-bottom: 0;
}

@media (max-width: 1450px) {
  .product-detail {
    width: 85%;
  }
}
</style>
