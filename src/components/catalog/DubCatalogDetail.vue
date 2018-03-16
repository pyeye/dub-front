<template>
  <div class="product-detail">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="content">
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
    
    
  </div>
</template>

<script>
import request from '@/request/index';

export default {
  name: 'DubProductDetail',
  data: () => ({
    productFromRequest: { main_image: '' },
    quantity: 1,
    selectedPrice: {},
    // TODO: make amount & quantity properties of cart | vuex problem
    // maybe name collisions in store/index.js
    cart: {},
  }),
  computed: {
    productFromState() {
      const id = this.$route.params.id;
      const category = this.$route.params.category;
      const product = this.$store.getters.getProduct(category, id);

      if (!product) {
        this.getProductFromRequest(id);
        return null;
      }

      return product;
    },
    product() {
      return this.productFromState || this.productFromRequest;
    },
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: this.product.category.name, link: `/catalog/${this.product.category.code}` },
        { label: this.product.name, link: '' },
      ];
    },
  },
  methods: {
    getProductFromRequest(id) {
      const url = `products/${id}/`;
      request.get(url).then((response) => {
        this.productFromRequest = response.data;
        this.selectedPrice = this.productFromRequest.prices[0];
      });
    },
    addToCart() {
      this.$store.dispatch('addToCart', {
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
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        if (this.productFromState) {
          this.selectedPrice = this.productFromState.prices[0];
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
    
}

.content {
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

@media (max-width: 1450px) {
   .product-detail {
    width: 85%;
}

}

</style>
