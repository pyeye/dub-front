<template>
  <div class="product-detail" v-if="!isEmptyObject(product)" key="initiial render">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="content">
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
          <div class="product-image">
              <div class="image-box">
                <img class="image" :src="product.main_image.original">
              </div>
          </div>
          <div class="product-info">
            <div class="name">{{ product.category.name }} {{ product.name }}, {{selectedPrice.count}}{{selectedPrice.measure}}</div>
            <div class="info-box">
              <div class="info-main">
                <div class="title">Характеристики:</div>
                <div class="info-list" v-if="product.extra.brand">
                  <div class="info-description">{{product.extra.brand.description}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value">&nbsp;{{product.extra.brand.value}}</div>
                </div>
                <div class="info-list" v-if="product.extra.type">
                  <div class="info-description">{{product.extra.type.description}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value row">
                    <div class="row-item">&nbsp;{{product.extra.type.value}}</div>
                  </div>
                </div>
                <div class="info-list" v-if="product.extra.region">
                  <div class="info-description">{{product.extra.region.description}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value row">
                    <div class="row-item">&nbsp;{{product.extra.region.value}}</div>
                  </div>
                </div>
                <div class="info-list" v-if="product.extra.strength">
                  <div class="info-description">{{product.extra.strength.description}}:</div>
                  <div class="description-flex"></div>
                  <div class="info-value">&nbsp;{{product.extra.strength.value}}</div>
                </div>
              </div>
              <div class="info-price">
                <div class="amount">
                  <div class="description">Объемы:</div>
                  <div class="value">
                    <div class="item" v-response.small.fast v-for="price in product.prices" :key="price.pk" @click="selectedPrice = price" :class="{ 'price-active': selectedPrice.pk == price.pk }"> 
                      {{price.count}}{{price.measure}} 
                    </div>
                  </div>
                </div>
                <div class="storage">
                <div class="description">В наличии:</div>
                <div class="value">много</div>
              </div>
                <div class="price-row">
                  <div class="price-value">{{selectedPrice.value}}&#x20bd;</div>
                </div>
                <div class="actions">
                  <div class="quantity-action">
                    <el-input-number class="num" v-model="quantity"  :min="1" :max="999"></el-input-number>
                  </div>
                 <dub-button class="button" @click.native="addToCart">в корзину</dub-button>
                </div>
              </div>
              
            </div>
              <div class="secondary-info">
                <div class="title">Описание:</div>
                <div class="secondary-text">Brancott Estate, Marlborough Sauvignon Blanc — необычайно яркое и насыщенное вино, произведенное из винограда, выращенного в уникальном терруаре новозеландского региона Мальборо. Совиньон Блан выращивается на виноградниках, расположенных в южной части долины Вайрау. Сбор начинается середине марта, а заканчивается — в середине апреля. Свежий фруктовый вкус вина многим обязан специальной технологии винификации. Один из главных моментов винификации — чрезвычайно тщательный и мягкий отжим плодов с целью получения чистого, прозрачного сока для ферментации, которая проходит при низкой температуре в стальных емкостях.</div>
                
              </div>
          </div>
      </div>

      <div class="watched-products" v-if="watchedProducts.length > 0"> 
        <div class="watched-title">Вы смотрели:</div>
        <swiper :options="swiperTagOption" class="watched-slider">
          <swiper-slide v-for="watchedProduct in watchedProducts" :key="watchedProduct.pk" class="watched-slide">
            <dub-home-bestsellers-item class="grid-cell" :product="watchedProduct" :category="watchedProduct.category"></dub-home-bestsellers-item>
          </swiper-slide>
        </swiper>
      </div>

      
    
    
  </div>
</template>

<script>
import request from '@/request/index';
import DubHomeBestsellersItem from '@/components/home/DubHomeBestsellersItem';

export default {
  name: 'DubProductDetail',
  components: {
    DubHomeBestsellersItem,
  },
  data: () => ({
    productFromRequest: {},
    quantity: 1,
    selectedPrice: {},
    btnPopoverDisabled: true,
    btnPopoverActive: false,
    cart: {},
    swiperTagOption: {
      slidesPerView: 'auto',
      spaceBetween: 15,
      freeMode: true,
      speed: 2000,
    },
  }),
  computed: {
    productFromState() {
      const id = this.$route.params.id;
      const category = this.$route.params.category;
      const product = this.$store.getters['products/product'](category, id);

      if (!product) {
        this.getProductFromRequest(id);
        return null;
      }

      return product;
    },
    product() {
      return this.productFromState || this.productFromRequest;
    },
    watchedProducts() {
      let watched = [];
      if (!this.isEmptyObject(this.product)) {
        const watchedFromStore = this.$store.getters['session/watched/products'];
        watched = watchedFromStore.filter(product => product.pk !== this.product.pk);
      }
      return watched;
    },
    breadcrumbs() {
      if (this.isEmptyObject(this.product)) {
        return [
          { label: 'Главная', link: '/' },
          { label: 'Загрузка...', link: '' },
        ];
      }
      return [
        { label: 'Главная', link: '/' },
        { label: this.product.category.name, link: `/catalog/${this.product.category.code}` },
        { label: this.product.name, link: '' },
      ];
    },
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
    getProductFromRequest(id) {
      const url = `products/${id}/`;
      request.get(url).then((response) => {
        this.productFromRequest = response.data;
        this.selectedPrice = this.productFromRequest.prices[0];
        if (this.$store.getters['user/isAuthenticated']) {
          const category = this.$route.params.category;
          request.get('ratings/user/', {
            params: {
              category,
            },
          }).then((ratingsResponse) => {
            const rating = ratingsResponse.data.find(record => record.product.toString() === id);
            if (rating) {
              rating.floatRating = parseFloat(rating.rating);
              this.$set(this.productFromRequest, 'rating', rating);
            }
          });
        }
      });
    },
    addToCart() {
      this.$store.dispatch('cart/addProduct', {
        price: this.selectedPrice,
        quantity: this.quantity,
        product: this.product,
      });
      this.$notify({
        group: 'cart',
        type: 'success',
        title: 'Добавленно',
        text: `Товар ${this.product.name} добавлен в корзину`,
      });
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    ratingChangeHandler(val) {
      this.btnPopoverDisabled = false;
      if (this.productFromState) {
        this.$store.dispatch('products/updateRating', {
          pk: this.product.pk,
          category: this.product.category.code,
          rating: val,
        });
      } else {
        const stringRating = parseFloat(val).toFixed(1);
        const rating = {
          rating: stringRating,
          floatRating: val,
          pk: this.product.rating.pk,
        };
        this.$set(this.productFromRequest, 'rating', rating);
      }
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
    $route: {
      immediate: true,
      handler() {
        if (this.productFromState) {
          this.selectedPrice = this.productFromState.prices[0];
        }
        if (!this.isEmptyObject(this.product)) {
          this.$store.dispatch('session/watched/addProduct', this.product);
        }
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.product-detail {
    position: relative;
    flex: 1;
    width: 80%;
    margin: 0 auto;
    @include prefix((
        display: flex,
        flex-direction: column
    ), webkit ms);  
}

.content {
  position: relative;
    @include prefix((
        display: flex,
        flex-direction: row
    ), webkit ms);  
    background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      width: 100%;
      margin: 24px 0;
    
}

.product-image {
  width: 30%;
  padding: 16px;
  margin: 32px 0;
  border-right: 1px solid #e6e3da;
  @include prefix((
    display: flex,
    flex-direction: row,
    align-items: bottom,
    justify-content: center,
  ), webkit ms);
}


.product-info {
  @include prefix((
    display: flex,
    flex-direction: column,
  ), webkit ms);

  width: 70%;

  .name {
    padding: 24px;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: .01em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 16px;
  }
      
}

  .image-box {
          text-align: center;
        }

  .image {
      height: 450px;
  }

.info-box {
  @include prefix((
        display: flex,
        flex-direction: row
    ), webkit ms);  

    height: 230px;

    .info-main {
      width: 50%;
      border-right: 1px solid #e6e3da;
      padding: 24px;
      

      .title {
    padding: 4px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 36px;
    font-family: 'Roboto', sans-serif;
  }

  .info-list {
    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
padding: 4px;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    line-height: 24px;
    text-transform: capitalize;

    .description-flex{
      flex: 1;
    }

  }
    }

    .info-price {
      padding: 24px;
      width: 40%;

      .price-row {
         @include prefix((
      display: flex,
      flex-direction: row-reverse,
      justify-content: space-between,
    ), webkit ms);
    padding-bottom: 24px;
      }

      .price-value {
        font-family: 'Roboto', sans-serif;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: .8px;
        line-height: 36px;
      }

      .flex {
        flex: 1;
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

.amount {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);

    padding-bottom: 2px;

    .description {
      font-size: 16px;
      font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    line-height: 24px;
    }
     .item {
      position: relative;
      opacity: .7;
      margin-left: 8px;
      cursor: pointer;
    }

    .value {
      @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    line-height: 24px;

    .price-active {
      border-bottom: 3px solid $primary_color;
      opacity: 1;
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
      font-size: 16px;
      font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    line-height: 24px;
    }

    .value {
      color: #43A047;
      font-size: 16px;
      font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    line-height: 24px;
}
}

.actions {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ), webkit ms);

    

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
  margin-bottom: 36px;

    .title {
    padding: 24px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 36px;
    font-family: 'Roboto', sans-serif;
  }
  .secondary-text {
    padding: 8px 24px;
    font-size: 16px;
    letter-spacing: -.01em;
    line-height: 24px;
    opacity: .7;
  }

  
}

.row {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
}

.button {
  margin-top: 16px;
  width: 47%;
}


.row-item:not(:last-of-type):after {
              content: ", ";
              
            }
            .row-item:nth-last-of-type(2):before {
              content: none;
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
  top: 24px;
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

  font-size: 16px;
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

.watched-products {
   margin: 24px 0;
}

.watched-title {
width: 100%;
  padding: 16px 0;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 40px;
    font-family: 'Roboto', sans-serif;
    opacity: .9;
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
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      
      transition: box-shadow .25s ease;
 }

@media (max-width: 1450px) {
   .product-detail {
    width: 85%;
}

}

</style>
