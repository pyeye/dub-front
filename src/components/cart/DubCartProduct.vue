<template>
  <div class="cart-product">
    <div class="item-photo">
      <div class="image-box">
        <img class="image" :src="cart.product.main_image.thumbnail">
      </div>
    </div>
    <div class="item-name"><div class="box">{{cart.product.name}}</div></div>
    <div class="item-measure"><div class="box">{{cart.price.count}}{{cart.price.measure}}</div></div>
    <div class="item-price"><div class="box">{{cart.price.value}}&#x20bd;</div></div>
    <div class="item-quantity"><div class="box"><el-input-number class="qu-numb" @change="handleQuantityChange" label="Кол-во" :value="cart.quantity" :min="1" size="small"></el-input-number></div></div>
    <div class="item-price"><div class="box">{{cart.quantity * cart.price.value}}&#x20bd;</div></div>
    <div class="item close" @click="deleteProcuct"  v-response.small> <icon class="icon-link"  name="times"></icon></div>

      </div>
    
</template>

<script>

export default {
  name: 'DubCartProduct',
  props: {
    cart: {
      type: Object,
    },
  },
  computed: {
    totalPrice() {
      return this.cart.price.value * this.cart.quantity;
    },
  },
  methods: {
    handleQuantityChange(quantity) {
      this.$store.dispatch('updateQuantity', {
        cartId: this.cart.price.pk,
        quantity,
      });
    },
    deleteProcuct() {
      this.$store.dispatch('deleteProductFromCart', {
        cartId: this.cart.price.pk,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.cart-product {
    display: block;
    padding: 24px;
    border-bottom: 1px solid #e6e3da;

    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
}





 

  .cart-product {
     width: 100%;
  padding: 16px 0;
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center, 
    ), webkit ms);

    border-bottom: 1px solid #e6e3da;

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
      flex: 1;
      margin-left: 16px;
    }
    

    .item-measure {
      width: 11%; 
     
        text-align: center; 
    }

    .item-price {
      width: 16%;   
      
   
        text-align: center; 
    }

    .item-quantity {
      width: 15%; 
      
    
        text-align: center; 
    }

    .header-close {
      padding: 6px;
    }

     .close {
    padding: 4px 0;
    position: relative;
    left: -20px;
    cursor: pointer;
  }

  .close:hover  .icon-link{
    color: #df3131;
  }

  .qu-numb {
    width: 110px;
  }

  .icon-link {
    color: #c0beb6;
  }
}
  






</style>
