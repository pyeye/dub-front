<template>
  <div class="user-carts">
      <div class="order-nav">
      <div class="nav-box">
        <div v-for="cart in userCarts" :key="cart.pk" @click="selectedCart = cart" :class="{ 'active-order': selectedCart.pk == cart.pk }">
        <div class="nav-item" v-response.masked.large>
          <div class="row">
            <div class="date"> {{cart.name}}</div>
          </div>
        </div>
      </div>
      </div>
      
    </div>
     <div class="order-content">
        <div class="info">
          <div class="description">
           
            <div class="column flex">
              {{selectedCart.name}}
            </div>
            <div class="column">
              <div class="price">
                <div class="price-description">Стоимость:</div>
                <div class="value">{{totalPrice(selectedCart.user_cart)}}&#x20bd;</div>
                 
              </div>
            </div>
            
              <div class="column last-column">
              <div class="price">
                <div class="">
                  <dub-button class="button" @click.native="addToCart(selectedCart)">В КОРЗИНУ</dub-button>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cart">
          <div class="header">
            <div class="item-description"><div class="box">Товары</div>
            </div>
            <div class="item-measure"><div class="box">Объем</div>
              
            </div>
            <div class="item-price"><div class="box">Цена</div></div>
            <div class="item-quantity"><div class="box">Кол-во</div></div>
            <div class="item-price"><div class="box">Стоимость</div></div>
          </div>
          <div v-for="product in selectedCart.user_cart" :key="product.price.pk" class="item">
            <div class="item-photo">
              <div class="image-box">
                <img class="image" :src="product.product.main_image.thumbnail">
              </div>
          </div>
            <div class="item-name"><div class="box">{{product.product.name}}</div></div>
            <div class="item-measure"><div class="box">{{product.price.count}} {{product.price.measure}}</div></div>
            <div class="item-price"><div class="box">{{product.price.value}}&#x20bd;</div></div>
            <div class="item-quantity"><div class="box">{{product.quantity}}</div></div>
            <div class="item-price"><div class="box">{{product.quantity * product.price.value}}&#x20bd;</div></div>
         </div>
        </div>
     </div>
  </div>
</template>

<script>

export default {
  name: 'DubUserCarts',
  data: () => ({
    selectedCart: {
      products: [],
    },
  }),
  computed: {
    userCarts() {
      return this.$store.getters['user/carts'];
    },
  },
  created() {
    if (this.userCarts.length === 0) {
      this.$store.dispatch('user/requestCarts').then(() => {
        this.selectedCart = this.userCarts[0];
      });
    } else {
      this.selectedCart = this.userCarts[0];
    }
  },
  methods: {
    addToCart(cart) {
      const copy = JSON.parse(JSON.stringify(cart.user_cart));
      this.$store.dispatch('cart/addProducts', copy);
    },
    totalPrice(products) {
      if (!products) {
        return 0;
      }
      return products.reduce((total, cart) => total + (cart.price.value * cart.quantity), 0);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.user-carts {
    position: relative;
    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
}

.order-nav {
  width: 20%;
  
  
  @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);

    .nav-box {
background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
    }

    .nav-item {
      @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
    position: relative;
      padding: 16px;
      cursor: pointer;
      border-bottom: 1px solid #e6e3da;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #e6e3da;
      }

      .row {
        @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);

    .date {
      @include prefix((
      flex: 1,
    ), webkit ms);
    }

    .time {
      opacity: .7;
    }

    .status {
      opacity: .7;
      font-size: 14px;
    }
      }
}


}

.order-content {
  width: 80%;
  @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
    background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-left: 28px;

    .info {
      
      font-family: 'Roboto', sans-serif;
        font-size: 16px;
        letter-spacing: .6px;
        line-height: 24px;
       
       .description {
         margin: 24px;
         
         @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);

    .flex {
      font-size: 40px;
      @include prefix((
      flex: 1,
    ), webkit ms);
    }

    

    .column {
      padding: 16px 24px 16px 0;
       @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
    .price {
      @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);

    .value {
      font-size: 26px;
    }
    }
    }

    .last-column {
      padding: 16px 4px 0 0;
      min-width: 210px;
    }
       }

        .status {
          font-family: 'Open Sans', sans-serif;
          line-height: 28px;
        }
    }

    .cart {
      margin: 16px 0 0 0;
      

      @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);

    .header {
      border-bottom: 1px solid #e6e3da;
      border-top: 1px solid #e6e3da;
      font-weight: bold;
      width: 100%;
      padding: 8px 0;
      @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);

      
    }

    .item {
      border-bottom: 1px solid #e6e3da;
      padding: 8px 0;
      width: 100%;
      @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
    }
    }
}


.item-photo {
  width: 10%;
  
  .image-box {
          text-align: center;
        }

        .image {
      height: 70px;
  }
}

.item-name {
  width: 40%;        
}

.item-description {
  width: 50%;
}

.item-measure {
  width: 10%; 
     
        text-align: center; 
}

.item-price {
  width: 15%;   
   
        text-align: center;     
}

.item-quantity {
  width: 10%;  
    
        text-align: center;      
}

.box {
  padding: 16px;
}

.active-order {
  font-weight: bold;
  border-left: 2px solid $primary_color;
}

.steps {
  background-color: $body_color;
  color: $text_color;
}

.step {
  padding: 0 0 8px 0;
}

.button {
  margin-top: 8px;
}

</style>
