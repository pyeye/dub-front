<template>
  <div class="catalog-item ">
    <div class="link-box">
      <div class="description-box">
        <div class="name">
        <nuxt-link class="" :to="productLink">
          {{ product.name }}
        </nuxt-link>
      </div>
        <div class="amount">
          <div class="value">
            <div class="product-item product-item-active">
              {{product.instance.measure_count}}{{product.instance.measure_value}}
            </div>
          </div>
        </div>
        <!--
        <div class="facet-info">
          {{ strength }}%
        </div>
        -->
        <div class="facet-info" v-for="param in params" :key="param.pk">
          {{ param.values[0].name }}
        </div>
        <!--
        <div class="storage">
          <div class="value">В наличии</div>
        </div>
        -->
        <div class="flex"></div>
        <dub-price :regular-price="product.instance.price" :special-price="product.instance.new_price"></dub-price>
      </div>
      <div class="image-box">
        <nuxt-link class="" :to="productLink">
          <img class="image" :src="`http://api.mydubbelsite.ru/${image}`">
        </nuxt-link>
      </div>
    </div>
    <div class="floating" v-if="product.instance.sales.length !== 0">
      <sales-badge v-for="label in getSaleLabels(product.instance.sales)" :key="label">
        {{ label }}
      </sales-badge>
    </div>
  </div>
</template>

<script>
import DubPrice from '@/components/base/DubPrice';
import SalesBadge from '@/components/sales/SalesBadge';

export default {
  name: 'CatalogItem',
  components: {
    DubPrice,
    SalesBadge,
  },
  props: {
    product: {
      type: Object,
    },
  },
  data: () => ({
    productLink: '',
    display: {
      common: ['country', 'type'],
      beer: [],
    },
  }),
  computed: {
    params() {
      return this.product.string_facets.filter(facet => this.display.common.includes(facet.slug));
    },
    strength() {
      const strengthFacet = this.product.number_facets.filter(facet => facet.slug === 'strength');
      return strengthFacet[0].value;
    },
    image() {
      const mainImage = this.product.instance.images.find(i => i.is_main);
      if (!mainImage) {
        return this.product.instance.images[0].src;
      }
      return mainImage.src;
    },
  },
  created() {
    this.productLink = `/catalog/${this.product.category.slug}/${this.product.product_info_pk}-${
      this.product.instance.pk
    }-${this.product.name_slug}`;
  },
  methods: {
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.catalog-item {
  position: relative;
  margin-bottom: 32px;
  background-color: $upper_layer_color;
  border-radius: 2px;
  padding: 16px;
  transition: box-shadow 0.25s ease;
  &:hover {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
  .link-box {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );
    height: 100%;
    text-decoration: none;
    color: $text_color;
    .image-box {
      width: 45%;
      text-align: center;
      @include prefix(
        (
          align-self: center,
          flex: 1,
        ),
        webkit ms
      );
    }
    .image {
      max-height: 350px;
      max-width: 100%;
    }
    .name {
      padding: 16px 0 32px 0;
      font-family: $accent_font;
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0px;
      line-height: 30px;
    }
  }
}

.description-box {
  width: 55%;
  margin-right: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.facet-info {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.16px;
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
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  .description {
    font-size: 14px;
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
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    .product-item {
      opacity: 0.7;
      margin-right: 6px;
      cursor: pointer;
      position: relative;

      &-active {
        border-bottom: 2px solid $primary_color;
      }
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
  padding-bottom: 16px;
  .description {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }
  .value {
    color: #43a047;
    font-size: 14px;
    font-weight: 600;
  }
}
.flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
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
}
a {
  text-decoration: none;
  color: $text_color;
}
.button {
  width: 47%;
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
  top: 16px;
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
  font-size: 14px;
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
.floating {
  position: absolute;
  top: 0;
  left: 0;
  margin: 4px;
}
.floating-product {
  position: absolute;
  top: 2px;
  right: -2px;
}
</style>
