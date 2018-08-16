<template>
  <div class="catalog-item ">
    <div class="ribbon" :class="ribbonTypeCss" v-if="product.rating" >
      <el-popover ref="rating" trigger="hover" placement="bottom">
        <div class="rating-popover">
          <div class="popover-row">
            <div class="popover-title">Оценка</div>
          </div>
          <div class="popover-row">
            <div class="popover-stars"><el-rate @change="ratingChangeHandler" :value="product.rating.floatRating" allow-half></el-rate></div>
            <div class="popover-value" :class="ratingValueCss">{{product.rating.rating}}</div>
          </div>
          <div class="popover-row">
            <div class="popover-flex"></div>
              <dub-button
                class="popover-button"
                type="secondary" 
                @click.native="saveProductRating" 
                :disabled="btnPopoverDisabled"
                :active="btnPopoverActive">сохранить</dub-button>
          </div>
        </div>
         
      </el-popover>
      <div class="rating" v-popover:rating>Вы это заказывали</div>
    </div>
    <div class="link-box">
      <div class="image-box">
        <router-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">
          <img class="image" :src="product.main_image.thumbnail">
        </router-link>
      </div>
      <div class="name"> <router-link class="" :to="'/catalog/'+ category.code + '/' + product.pk">{{ product.name }}  </router-link></div>
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
          <dub-button @click.native="addToCart" class="button">в корзину</dub-button>
        </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'DubCatalogListItem',
  props: {
    product: {
      type: Object,
    },
    category: {
      type: Object,
    },
  },
  data: () => ({
    msg: 'DubCatalog',
    selectedPrice: {},
    btnPopoverDisabled: true,
    btnPopoverActive: false,
  }),
  computed: {
    ribbonTypeCss() {
      if (this.product.rating.floatRating === 0) { return { 'no-rating': true }; }
      if (this.product.rating.floatRating >= 4) { return { 'good-rating': true }; }
      if (this.product.rating.floatRating === 3 || this.product.rating.floatRating === 3.5) {
        return { 'meh-rating': true };
      }
      if (this.product.rating.floatRating < 3 && this.product.rating.floatRating > 0) {
        return { 'bad-rating': true };
      }
      return { '': true };
    },
    ratingValueCss() {
      if (this.product.rating.floatRating === 0) { return { '': true }; }
      if (this.product.rating.floatRating >= 4) { return { 'good-rating-value': true }; }
      if (this.product.rating.floatRating === 3 || this.product.rating.floatRating === 3.5) {
        return { 'meh-rating-value': true };
      }
      if (this.product.rating.floatRating < 3 && this.product.rating.floatRating > 0) {
        return { 'bad-rating-value': true };
      }
      return { '': true };
    },
  },
  methods: {
    addToCart() {
      this.$store.dispatch('cart/addProduct', {
        price: this.selectedPrice,
        quantity: 1,
        product: this.product,
      });
      this.$notify({
        group: 'cart',
        type: 'success',
        title: 'Добавленно',
        text: `Товар ${this.product.name} добавлен в корзину`,
      });
    },
    ratingChangeHandler(val) {
      this.btnPopoverDisabled = false;
      this.$store.dispatch('products/updateRating', {
        pk: this.product.pk,
        category: this.product.category.code,
        rating: val,
      });
    },
    saveProductRating() {
      this.btnPopoverActive = true;
      this.$store.dispatch('user/saveRating', {
        pk: this.product.rating.pk,
        value: this.product.rating.rating,
      }).then(() => {
        this.btnPopoverActive = false;
        this.btnPopoverDisabled = true;
        this.$notify({
          group: 'dubbel',
          title: 'Операция успешна',
          text: 'Оценка сохранена',
          type: 'success',
        });
      });
    },
  },
  watch: {
    product: {
      immediate: true,
      handler(val) {
        this.selectedPrice = val.prices[0];
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
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      padding: 32px;
      transition: box-shadow .25s ease;

      &:hover {
        box-shadow: 0 5px 10px rgba(0,0,0,.2)
      }

      .link-box{
        @include prefix((
          display: flex,
          flex-direction: column,
        ), webkit ms);
        height: 100%;

        text-decoration: none;
        color: $text_color;

        .image-box {
          @include prefix((
            align-self: center,
            flex: 1,
          ), webkit ms);
        }

        .image {
          height: 270px;  
        }

        .name {
          padding: 24px 0 4px 0;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -.012em;
          line-height: 24px;
        }
      }
    
}





.amount {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);
    padding-top: 8px;
    padding-bottom: 2px;

    .description {
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
    }

    .value {
      @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;

    .item {
      opacity: .7;
    }
    .item:not(:last-of-type):after {
              content: "/";
              
            }
            .item:nth-last-of-type(2):before {
              content: none;
            }
    }
    
}

.storage {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);

    padding-bottom: 16px;

    .description {
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
    }

    .value {
      color: #43A047;
      font-size: 14px;
      font-weight: 400;
    line-height: 24px;
}
}

.prices {
    @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
      align-items: center,
    ), webkit ms);

    padding-bottom: 8px;

    .price {
      font-family: 'Roboto', sans-serif;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: -.012em;
        line-height: 32px;
    }

    .amount-selector {
        @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
        width: 45%;
    }

    .za {
        margin-top: 4px;
        margin-right: 4px;
    }
}

.actions {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);

   
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
   box-shadow: 0 1px 1px rgba(0,0,0,.2);
  height: 30px;
   @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
  padding: 0 8px;
  position: absolute;
  left: -8px;
  top: 16px;
  opacity: 0.9;
  
  
}
.ribbon:before, .ribbon:after {
  content: "";
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
          letter-spacing: -.012em;
          font-weight: 600;
      opacity: .8;
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
  background: #F4511E;
}

.meh-rating:before {
  border-bottom: 9px solid darken(#F4511E, 10);
}

.good-rating {
  color: $upper_layer_color;
  background: #42A85F;
}

.good-rating:before {
  border-bottom: 9px solid darken(#42A85F, 10);
}

.rating-popover {
   @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
    padding: 0 4px;
}

.popover-row {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    margin: 4px 0;
}

.popover-title {
  color: $text_color;
  font-size: 18px;
  letter-spacing: -.012em;
  font-weight: 600;
  opacity: .7;
  line-height: 22px;
}

.popover-value {
  color: $text_color;
  font-size: 16px;
  letter-spacing: -.012em;
  font-weight: 600;
  opacity: .7;
  line-height: 20px;
  margin-left: 16px;
}

.popover-flex {
  @include prefix((
      flex: 1,
    ), webkit ms);
}

.popover-button {
  margin-top: 4px;
  width: 100%;
}

.bad-rating-value {
  color: $error_color;
}

.meh-rating-value {
  color: #F4511E;
}

.good-rating-value {
  color: #42A85F;
}



</style>