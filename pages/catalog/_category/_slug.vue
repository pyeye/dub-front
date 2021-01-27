<template>
  <div class="product-detail">
    <div class="wrapper">
      <dub-breadcrumbs class="breadcrumbs" :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="hero-title"> {{ product.name }} </div>
      <div class="primary-wrapper">
        <div class="overlay"></div>
        <div class="primary">
          <h1 class="name">
            {{ product.name }}
          </h1>
          <h3 class="name-locale" v-if="product.extra.name_locale">{{ product.extra.name_locale }}</h3>
          <div class="primary-info">
            <div class="info-item">
              Доступно
              <div class="info-item-value" v-if="activeInstance.stock_balance > 0">В наличии</div>
              <div class="info-item-value" v-else>Нет в наличии</div>
            </div>
            <div class="info-item">
              Объем
              <div class="info-item-value">{{ formatMeasure(activeInstance.measure) }}</div>
            </div>
            <div class="info-item">
              Артикул
              <div class="info-item-value">{{ activeInstance.sku }}</div>
            </div>
            
            <div class="info-measures" v-if="product.instances.length > 1">
              <div class="info-measures-title">Варианты</div>
              <div class="info-measures-values">
                  <div 
                    class="info-measures-value measure-link" 
                    :class="{'measure-active': isActiveInstance(instance)}"
                    v-for="instance in product.instances" 
                    :key="instance.measure"
                    @click="selectInstance(instance)"
                  >
                    {{ formatMeasure(instance.measure) }}
                  </div>
              </div>
            </div>
          </div>

          <div class="detail-price">
            <span class="price-old" 
              v-if="formatPrice(activeInstance.price) !== formatPrice(activeInstance.base_price)"
            >
              {{ formatPrice(activeInstance.base_price) }} &#x20bd;
            </span>
            <span class="price-special" 
              v-if="formatPrice(activeInstance.price) !== formatPrice(activeInstance.base_price)">
              {{ formatPrice(activeInstance.price) }} &#x20bd;
            </span>
            <span class="price-regular" 
              v-if="formatPrice(activeInstance.price) === formatPrice(activeInstance.base_price)">
              {{ formatPrice(activeInstance.price) }} &#x20bd;
            </span>
          </div>
        </div>
      </div>
      
      <div class="image">
        <catalog-gallery :images="activeInstance.images"></catalog-gallery>
        <!--
        <div class="image-product"></div>
        <img class="image-shadow" src="http://api.mydubbelsite.ru/img/static/ombre-bouteille-3880.png" />
        -->
      </div>

      <div class="secondary">
        <div class="paragraph">Характеристики</div>      
        <div class="secondary-list" v-for="facet in product.facets" :key="`sfacet_${facet.pk}`">
          <div class="secondary-description">{{facet.name}}</div>
          <div v-if="facet.type === 'string'">
            <span class="secondary-value" v-for="value in facet.values" :key="`sfacet_val_${value.pk}`">
              <nuxt-link class="list-link"
                :to="`/catalog/${product.category.slug}?sfacets=${facet.slug}:${value.pk}`">
                {{ value.name }}
              </nuxt-link>
            </span>
          </div>
          <div v-else>
            <span class="secondary-value">
              <nuxt-link class="list-link"
                :to="`/catalog/${product.category.slug}
                  ?nfacets=${facet.slug}:${facet.value}-${facet.value}`"
              >
                {{facet.value}}{{facet.suffix}}
              </nuxt-link>
            </span>
          </div>
        </div>
        <div class="secondary-list">
          <div class="secondary-description">Кол-во в упаковке</div>
          <div class="secondary-value">{{ activeInstance.package_amount }}</div>
        </div>
      </div>

      <div class="description" v-if="product.description">
        <div class="description-paragraph">Описание</div>
        <div class="description-text">{{ product.description }}</div>
      </div>
    </div>
    
    
    
    <!--
    <div class="content">
      
      <div class="product-image">
        <catalog-gallery :images="product.instance.images"></catalog-gallery>
        <div class="floating" v-if="product.instance.sales.length !== 0">
          <sales-badge v-for="label in getSaleLabels(product.instance.sales)" :key="`sale_label_${label}`">
            {{ label }}
          </sales-badge>
        </div>
      </div>
      <div class="product-info">
        <div class="name">
          {{ product.name }},
          {{product.instance.measure}}
        </div>
        <div class="sales-conditions" v-if="salesWithCondition">
          <div v-for="sale in salesWithCondition" :key="`sale_${sale.pk}`">
            {{ sale.condition }}
          </div>
        </div>
        <div class="info">
          <div class="info-box">
            <div class="info-main">
              <div class="tab-panel">
                <span
                  v-response.small.fast
                  class="tab-item"
                  @click="tabIndex = 'main'"
                >
                  <span
                    class="tab-label"
                    :class="{ 'tab-label-active': tabIndex == 'main' }"
                  >
                    Характеристики
                  </span>
                </span>
                <span
                  v-response.small.fast
                  class="tab-item"
                  @click="tabIndex = 'description'"
                >
                  <span
                    class="tab-label"
                    :class="{ 'tab-label-active': tabIndex == 'description' }"
                  >
                    Описание
                  </span>
                </span>
              </div>

              <div v-if="tabIndex == 'main'">
                <div
                  class="info-list"
                  v-for="number_facet in displayNFacets"
                  :key="number_facet.pk"
                >
                  <div class="info-description">{{number_facet.name}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value row">
                    <span class="row-item">
                      <nuxt-link 
                        class="list-link"
  :to="`/catalog/${product.category.slug}?nfacets=${number_facet.slug}:${number_facet.value}-${number_facet.value}`">
                        {{number_facet.value}}{{number_facet.suffix}}
                      </nuxt-link>
                      
                    </span>
                  </div>
                </div>
              
                <div
                  class="info-list"
                  v-for="string_facet in product.string_facets"
                  :key="`sfacet_${string_facet.pk}`"
                >
                  <div class="info-description">{{string_facet.name}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value row">
                    <div class="description-flex"></div>
                    <div
                      class="row-item"
                      v-for="value in string_facet.values"
                      :key="`sfacet_val_${value.pk}`">
                      <nuxt-link 
                        class="list-link"
                        :to="`/catalog/${product.category.slug}?sfacets=${string_facet.slug}:${value.pk}`">
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
              <div class="price-row">
                <dub-price :special-price="product.instance.new_price">
                  <span slot="oldPrice" class="price-old" v-if="product.instance.new_price">
                    {{ product.instance.price }} &#x20bd;
                  </span>
                  <span slot="specialPrice" class="price-special" v-if="product.instance.new_price">
                    {{ product.instance.new_price }} &#x20bd;
                  </span>
                  <span slot="regularPrice" class="price-regular" v-if="!product.instance.new_price">
                    {{ product.instance.price }} &#x20bd;
                  </span>
                </dub-price>
              </div>
              <div class="info-list">
                <div class="info-description">Объемы:</div>
                <div class="description-flex"></div>
                <div class="info-value row">
                  <div class="description-flex"></div>
                  <div class="row-item measure-item measure-active">
                    {{product.instance.measure}}
                  </div>
                </div>
              </div>
              <div class="info-list">
                <div class="info-description">Артикул:</div>
                <div class="description-flex"></div>
                <div class="info-value row">
                  <div class="description-flex"></div>
                  <div class="row-item">
                    #{{product.instance.sku}}
                  </div>
                </div>
              </div>
              <div class="info-list">
                <div class="info-description">Кол-во в упаковке:</div>
                <div class="description-flex"></div>
                <div class="info-value row">
                  <div class="description-flex"></div>
                  <div class="row-item">
                    {{product.instance.package_amount}}
                  </div>
                </div>
              </div>
              <div class="info-list">
                <div class="info-description">В наличии:</div>
                <div class="description-flex"></div>
                <div class="info-value row storage">
                  <div class="description-flex"></div>
                  <div class="row-item value">
                    {{product.instance.stock_balance}} шт.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex"></div>
          <div class="secondary-info">
            <div class="tag-row">
              <div class="tag-title">Метки:</div>
              <div class="filter-tag-menu">
                <vue-glide 
                  :options="slider"
                  @glide:mount-after="loaded = true"
                  v-show="loaded"
                  :key="`loaded_${loaded}`"
                >
                  <vue-glide-slide v-for="tag in product.tags" :key="`tag_${tag.pk}`">
                    <div class="tag" v-response.small.masked>{{tag.name}}</div>
                  </vue-glide-slide>
                  <div class="masked-box" v-show="!loaded">
                    <div class="masked-item" v-for="i in slider.perView" :key="`slider_${i}`"></div>
                  </div>
                </vue-glide>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
    -->
  </div>
</template>

<script>
import DubPrice from '@/components/base/DubPrice';
import SalesBadge from '@/components/sales/SalesBadge';
import CatalogGallery from '@/components/catalog/CatalogGallery';

export default {
  name: 'ProductDetail',
  components: {
    DubPrice,
    SalesBadge,
    CatalogGallery,
  },
  data: () => ({
    slider: {
      type: 'carousel',
      perView: 5,
      autoplay: 5000,
      perTouch: 3,
      animationDuration: 4000,
    },
    loaded: false,
    exclude: {
      nfacets: ['price'],
    },
    tabIndex: 'main',
  }),
  async asyncData(context) {
    const { params, app, query } = context;
    const { slug } = params;
    const [productId, baseInstanceId] = slug.split('-');
    const url = `products/${productId}/`;
    const { data } = await app.$api.get(url);
    const activeInstanceId = query.active ? query.active : baseInstanceId;
    const activeInstance = data.instances.find(
      instance => instance.pk.toString() === activeInstanceId
    );
    return {
      product: data,
      activeInstance,
      baseInstanceId,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        {
          label: 'Каталог',
          link: `/catalog/${this.product.category.slug}`,
        },
        { label: this.product.name, link: '' },
      ];
    },
    displayNFacets() {
      return this.product.nfacets.filter(nfacet => !this.exclude.nfacets.includes(nfacet.slug));
    },
    salesWithCondition() {
      if (!this.product.instance.sales) {
        return [];
      }
      // return this.product.instance.sales.filter(sale => sale.type === 'condition');
      return '';
    },
  },
  methods: {
    selectInstance(instance) {
      this.activeInstance = instance;
      let query = Object.assign({}, this.$route.query);
      if (this.baseInstanceId === instance.pk.toString()) {
        query = {};
      } else {
        query.active = instance.pk;
      }
      this.$router.replace({ query });
    },
    getSaleLabels(sales) {
      let [hasFixed, hasCondition, hasPercent] = [false, false, false];
      const labels = [];
      sales.forEach(sale => {
        if (sale.type === 'fixed' && !hasFixed) {
          labels.push('Новая цена');
          hasFixed = true;
        }
        if (sale.type === 'condition' && !hasCondition) {
          labels.push('Акция');
          hasCondition = true;
        }
        if (sale.type === 'percent' && !hasPercent) {
          const percentLabel = `-${sale.percent}%`;
          labels.push(percentLabel);
          hasPercent = true;
        }
      });
      return labels;
    },
    formatMeasure(measure) {
      return measure >= 1000 ? `${measure / 1000} л.` : `${measure} мл.`;
    },
    formatPrice(price) {
      const [intPart, decimalPart] = price.split('.');
      return decimalPart === '00' ? intPart : price;
    },
    isActiveInstance(instance) {
      return instance.pk === this.activeInstance.pk;
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
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), #252525 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s ease;
  &:hover {
    background-size: 100% 100%;
  }
}

.product-detail {
  position: relative;
  min-height: 100vh;
}
.wrapper {
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.hero-title {
  font-size: 164px;
  color: $overlay_color;
  font-weight: 300;
  line-height: 180px;
  font-family: $accent_font;
  letter-spacing: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-transform: uppercase;
  grid-column: 5 / -1;
  grid-row: 2;
  margin: 24px 0;
  cursor: default;
}
.primary-wrapper {
  grid-column: full-start / 7;
  grid-row: 3 / 4;
  display: grid;
  grid-template-columns: minmax(48px, 1fr) repeat(5, minmax(12px, 160px));
  align-items: start;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 48px;
}
.primary {
  grid-column: 2 / -1;
  grid-row: 1;
  position: relative;
  padding: 0 48px 24px 0;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  .name {
    font-size: 64px;
    font-weight: 300;
    letter-spacing: 0px;
    line-height: 68px;
    font-family: $accent_font;
  }
  .name-locale {
    font-size: 28px;
    font-weight: 300;
    line-height: 36px;
    letter-spacing: 0px;
    opacity: 0.5;
  }
  .primary-info {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        flex-wrap: wrap,
        justify-content: space-between,
      ),
      webkit ms
    );
    margin-top: 32px;
    .info-item {
      margin-bottom: 8px;
      font-weight: 500;
      .info-item-title {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.16px;
      }
      .info-item-value {
        font-size: 20px;
        font-weight: 300;
        line-height: 28px;
        letter-spacing: 0px;
      }
    }
    .info-measures {
      width: 100%;
      position: relative;

      .info-measures-title {
        margin: 24px 0 16px 0;
        padding-bottom: 8px;
        font-size: 20px;
        line-height: 28px;
        font-weight: 400;
        letter-spacing: 0px;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          background-color: rgba(40, 40, 40, 0.2);
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
      .info-measures-values {
        @include prefix(
          (
            display: flex,
            flex-direction: row,
            flex-wrap: wrap,
          ),
          webkit ms
        );
        .info-measures-value {
          margin-right: 24px;
          cursor: pointer;
          font-size: 20px;
          line-height: 28px;
          font-weight: 400;
          letter-spacing: 0px;
          opacity: 0.7;

          background-image: linear-gradient(transparent calc(100% - 2px), #252525 2px);
          background-repeat: no-repeat;
          background-size: 0% 100%;
          transition: background-size 0.3s ease;
          &:hover {
            background-size: 100% 100%;
            opacity: 1;
          }
        }
        .measure-active {
          background-size: 100% 100%;
          opacity: 1;
        }
      }
    }
  }
  .detail-price {
    margin-top: 48px;
    @include prefix(
      (
        display: flex,
        flex-direction: column,
      ),
      webkit ms
    );
  }
}
.overlay {
  position: relative;
  height: 100%;
  margin-top: 38px;
  grid-column: 1 / -1;
  grid-row: 1;
  background-color: $overlay_color;
}
.image {
  grid-column: 8 / 12;
  grid-row: 3 / 4;
  z-index: 1;
  margin-top: -10vh;
  height: 90vh;
  .image-shadow {
    left: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    max-width: 100vw;
    position: relative;
    right: 50%;
    width: 99vw;
    opacity: 0.7;
  }
}
.paragraph {
  margin: 16px 0;
  padding-bottom: 16px;
  position: relative;
  font-size: 24px;
  line-height: 30px;
  font-weight: 300;
  letter-spacing: 0px;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: rgba(40, 40, 40, 0.2);
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.secondary {
  grid-column: 13 / main-end;
  grid-row: 3 / 5;
  margin-top: 96px;
  padding-left: 24px;
  position: relative;
  font-size: 14px;
  z-index: 1;
  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: rgba(40, 40, 40, 0.2);
    left: 0;
    top: 0;
  }
  .secondary-list {
    margin-bottom: 16px;
    .secondary-description {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0.16px;
    }
    .secondary-value {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      letter-spacing: 0.16px;
      margin-right: 4px;
    }
  }
}
.description {
  position: relative;
  grid-column: main-start / 13;
  margin-top: 128px;
  padding-top: 32px;
  grid-row: 4;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  &:after {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: rgba(40, 40, 40, 0.2);
    top: 0;
    right: 0;
  }
}
.description-paragraph {
  padding-right: 10%;
  position: relative;
  font-size: 64px;
  line-height: 70px;
  font-weight: 300;
  font-family: $accent_font;
  letter-spacing: -1px;
}
.description-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  padding: 16px 24px;
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
  width: 100%;
}
.product-image-old {
  position: absolute;
  left: 0;
  top: 0;
  width: 25%;
  padding: 16px;
  margin: 16px 0;
  background-color: $upper_layer_color;
  border-radius: 4px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12),
    0 1px 8px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.product-info {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  width: 80%;
  margin-left: 20%;
  .name {
    padding: 32px 32px 32px 12%;
    font-size: 42px;
    opacity: 0.7;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 50px;
    font-family: $accent_font;
  }
}
.image-box {
  position: relative;
  text-align: center;
  padding: 0 16px;
}
.info {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  background-color: $upper_layer_color;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding-left: 10%;
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
    padding: 24px;
    .title {
      padding: 4px;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.01em;
      line-height: 36px;
      font-family: $accent_font;
    }
  }
  .info-price {
    margin: 24px 0;
    padding: 0 24px;
    border-left: 1px solid #e6e3da;
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
      margin-bottom: 22px;
    }
    .price-value {
      font-family: $main_font;
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
.info-list {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  font-size: 14px;
  font-weight: 500;
  opacity: 0.7;
  letter-spacing: 0.16px;
  line-height: 20px;
  font-family: $main_font;
  .info-description {
    margin-right: 4px;
  }
  .description-flex {
    flex: 1;
    border-bottom: 1px dotted $text_color;
    margin-bottom: 4px;
    margin-right: 4px;
    opacity: 0.7;
  }
}
.flex {
  flex: 1;
}
.storage {
  .value {
    color: #43a047;
    font-size: 16px;
    font-weight: 600;
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
  margin: 24px 0;
  .title {
    padding: 16px 24px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 36px;
    font-family: $accent_font;
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
      flex-wrap: wrap,
      justify-content: flex-end,
    ),
    webkit ms
  );
}
.button {
  margin-top: 16px;
  width: 47%;
}
.row-item {
  text-decoration: none;
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
  font-family: $accent_font;
  opacity: 0.9;
  color: $text_color;
}

.filter-tag-menu {
  position: relative;
  width: 80%;
  padding: 8px 0 8px 0;
}
.breadcrumbs {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: left,
      justify-content: left,
    ),
    webkit ms
  );
  margin: 16px 0;
  grid-column: main-start / main-end;
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
  overflow: hidden;
  margin-right: 4px;
}
.tag:hover {
  background-color: $primary_color;
}
.tag-active {
  background-color: $primary_color;
}
.measure-item {
  cursor: pointer;
}

.tab-panel {
  z-index: 1;
  margin-bottom: 32px;
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
  text-decoration: none;
  position: relative;
  margin: 0 24px 4px 0;
  color: $text_color;
  padding-bottom: 3px;
  cursor: pointer;
  font-weight: 600;
  opacity: 0.7;
  font-size: 16px;
}

.tab-label {
  padding-bottom: 4px;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 3px), $primary_color 3px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s ease;
  &:hover {
    background-size: 100% 100%;
  }
}
.tab-label-active {
  background-size: 100% 100%;
}

.price-special {
  color: #e83841;
  font-size: 42px;
  font-weight: 300;
  line-height: 50px;
  font-family: $main_font;
  letter-spacing: 0px;
  align-self: flex-end;
}
.price-regular {
  font-size: 42px;
  font-weight: 300;
  line-height: 50px;
  font-family: $main_font;
  letter-spacing: 0px;
  align-self: flex-end;
}
.price-old {
  align-self: flex-end;
  text-decoration: line-through;
  font-size: 16px;
  line-height: 16px;
  opacity: 0.6;
}
.floating {
  position: absolute;
  top: 0;
  left: 0;
  margin: 4px;
}
.floating-measure {
  position: absolute;
  top: 2px;
  right: -2px;
}
.sales-conditions {
  margin: -24px 24px 16px 24px;
  color: #e83841;
  font-size: 16px;
  font-weight: 600;
  padding-left: 10%;
}
.masked-box {
  height: 33px;
  overflow: hidden;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.masked-item {
  height: 33px;
  width: 450px;
  margin: 0 4px;
  border-radius: 2px;
  background-color: #ddd;
}
@media (max-width: 1450px) {
  .primary {
    padding: 0 24px 24px 0;
    .name {
      font-size: 42px;
      font-weight: 300;
      letter-spacing: 0px;
      line-height: 50px;
    }
    .name-locale {
      font-size: 20px;
      font-weight: 300;
      line-height: 28px;
      letter-spacing: 0px;
    }
    .primary-info {
      .info-item {
        font-size: 16px;
        line-height: 20px;
        font-weight: 400;
        letter-spacing: 0.16px;
        .info-item-value {
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          letter-spacing: 0.16px;
        }
      }
      .info-measures {
        .info-measures-title {
          font-size: 16px;
          line-height: 20px;
          font-weight: 400;
          letter-spacing: 0.16px;
        }
        .info-measures-values {
          .info-measures-value {
            font-size: 16px;
            line-height: 20px;
            font-weight: 400;
            letter-spacing: 0.16px;
          }
        }
      }
    }
  }
  .image {
    height: 100vh;
  }
  .hero-title {
    font-size: 106px;
    line-height: 106px;
    letter-spacing: 8px;
    margin: 16px 0;
  }
  .overlay {
    margin-top: 32px;
  }
  .price-regular {
    font-size: 36px;
  }
  .description {
    padding-top: 48px;
    padding-right: 48px;
    @include prefix(
      (
        flex-direction: column,
      ),
      webkit ms
    );
    &:after {
      width: 0;
      height: 0;
    }
  }
  .description-paragraph {
    margin: 16px 0;
    padding-bottom: 16px;
    position: relative;
    font-size: 24px;
    line-height: 30px;
    font-weight: 300;
    letter-spacing: 0px;
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: rgba(40, 40, 40, 0.2);
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .description-text {
    padding: 16px 0;
  }
}
</style>
