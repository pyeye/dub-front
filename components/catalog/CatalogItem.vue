<template>
  <div class="catalog-item ">
    <div class="link-box">
      <div class="image-box">
        <nuxt-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">
          <img class="image" :src="product.main_image">
        </nuxt-link>
      </div>
      <div class="name"> 
        <nuxt-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">
          {{ product.name }}  
        </nuxt-link>
      </div>
        <div class="amount">
          <div class="description">Объемы:</div>
          <div class="value">
            <div class="item" v-for="price in product.prices" :key="price.amount">{{price.count}}{{price.measure}}</div>
          </div>
        </div>
        <div class="storage">
          <div class="description">В наличии:</div>
          <div class="value">много</div>
        </div>
        <div class="prices">
          <div class="price">
            {{selectedPrice.value}} &#x20bd; 
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItem',
  props: {
    product: {
      type: Object,
    },
    category: {
      type: Object,
    },
  },
  data: () => ({
    selectedPrice: {},
  }),
  watch: {
    product: {
      immediate: true,
      handler(val) {
        const [firstPrice] = val.prices;
        this.selectedPrice = firstPrice;
      },
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 32px;
  transition: box-shadow 0.25s ease;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  .link-box {
    @include prefix(
      (
        display: flex,
        flex-direction: column,
      ),
      webkit ms
    );
    height: 100%;
    text-decoration: none;
    color: $text_color;
    .image-box {
      @include prefix(
        (
          align-self: center,
          flex: 1,
        ),
        webkit ms
      );
    }
    .image {
      height: 270px;
    }
    .name {
      padding: 24px 0 4px 0;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.012em;
      line-height: 24px;
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
  padding-top: 8px;
  padding-bottom: 2px;
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
    font-weight: 400;
    line-height: 24px;
  }
}
.prices {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
      align-items: center,
    ),
    webkit ms
  );
  padding-bottom: 8px;
  .price {
    font-family: 'Roboto', sans-serif;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 32px;
  }
  .amount-selector {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
      ),
      webkit ms
    );
    width: 45%;
  }
  .za {
    margin-top: 4px;
    margin-right: 4px;
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
</style>
