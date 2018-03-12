<template>
  <div class="catalog-item ">
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
  }),
  computed: {
  },
  methods: {
    addToCart() {
      this.$store.dispatch('addToCart', {
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
          padding: 24px 0 16px 0;
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

</style>