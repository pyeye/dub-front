<template>
  <div class="user-orders" v-if="activeOrders.length > 0">
    <div class="order-nav">
      <div class="nav-box">
        <div v-for="order in activeOrders" :key="order.pk"  @click="selectedOrder = order" class="box-order" :class="{ 'active-order': selectedOrder.pk == order.pk }">
        <div class="nav-item" v-response.masked.large>
          <div class="row">
            <div class="date"> {{prettyDate(order.created_at)}}</div>
            <div class="time">{{prettyTime(order.created_at)}}</div>
          </div>
          <div class="row">
            <div class="status">Статус: {{ order.status.name }}</div>
          </div>
        </div>
      </div>
      </div>
      
    </div>
    <div class="order-content">
        <div class="info">
          <div class="steps">
                    <div class="step step-success">
                        <div class="step-number step-number-success"><div>1</div></div> 
                        <div class="step-label">Оформление </div> 
                    </div>
                    <div class="step step-active">
                        <div class="step-number step-number-active"><div>2</div></div> 
                        <div class="step-label">Обработка</div> 
                    </div>
                    <div class="step step-inactive">
                        <div class="step-number step-number-inactive"><div>3</div></div> 
                        <div class="step-label">Доставка</div> 
                    </div>  
                    <div class="step step-inactive">
                        <div class="step-number step-number-inactive"><div>3</div></div> 
                        <div class="step-label">Заказ выполнен</div> 
                    </div>             
                </div>
          <div class="description">
            <div class="column">
              <div class="status">Статус: {{ selectedOrder.status.name }}</div>
              <div class="status">Дата: {{prettyDate(selectedOrder.created_at)}}, {{prettyTime(selectedOrder.created_at)}}</div>
            </div>
            <div class="column flex">
              <div class="status">Адрес: {{ selectedOrder.address }}</div>
            </div>
            <div class="column">
              <div class="price">
                <div class="price-description">Стоимость:</div>
                <div class="value">{{totalPrice(selectedOrder.order_cart)}}&#x20bd;</div>
                 
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
          <div v-for="product in selectedOrder.order_cart" :key="product.price.pk" class="item">
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
  name: 'DubUserOrders',
  data: () => ({
    active: 2,
    selectedOrder: {
      status: {},
      order: [],
    },
  }),
  computed: {
    activeOrders() {
      return this.$store.getters['user/orders'];
    },
  },
  methods: {
    prettyDate(createdAt) {
      const date = new Date(createdAt);
      const locale = 'ru-RU';
      return date.toLocaleString(locale, { month: 'long', day: 'numeric' });
    },
    prettyTime(createdAt) {
      const date = new Date(createdAt);
      const time = date.toLocaleTimeString();
      return time.slice(0, -3);
    },
    totalPrice(products) {
      if (!products) {
        return 0;
      }
      return products.reduce((total, cart) => total + (cart.price.value * cart.quantity), 0);
    },
  },
  created() {
    if (this.activeOrders.length === 0) {
      this.$store.dispatch('user/requestOrders').then(() => {
        this.selectedOrder = this.activeOrders[0];
      });
    } else {
      this.selectedOrder = this.activeOrders[0];
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.user-orders {
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
       }

        .status {
          font-family: 'Open Sans', sans-serif;
          line-height: 28px;
        }
    }

    .cart {
      margin: 16px 0 0 0px;
      
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

.box-order:hover {
  border-left: 2px solid $primary_color;
  padding-left: 0;
}

.box-order {
  padding-left: 2px;
}

.active-order {
  border-left: 2px solid $primary_color;
  padding-left: 0;
}

.steps {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    width: 100%;
    margin-bottom: 24px;
border-bottom: 1px solid  #e6e3da;
      color: $text_color;
      text-decoration: none;
    

    .step {
        @include prefix((
            flex: 1,
            display: flex,
            flex-direction: row,
            align-items: center,
        ), webkit ms);
        border-right: 1px solid  #e6e3da;
        padding: 25px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        letter-spacing: .025em;
    line-height: 24px;

    .step-number {
        margin-right: 12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: $primary_color;
        color: $text_color;
        font-size: 12px;
        @include prefix((
            display: flex,
            flex-direction: row,
            align-items: center,
            justify-content: center,
        ), webkit ms);
    }

    .step-number-active {
        background-color: $primary_color;
        color: $text_color;
    }

    .step-number-inactive {
        background-color: #e6e3da;
        color: $text_color;
        opacity: 0.7;
    }
     .step-number-success {
        background-color: #43A047;
        color: $upper_layer_color;
    }
    }

    .step:last-child {
        border-right: 0;
    }

    .step-active {
        border-bottom: 3px solid  $primary_color;
    }

    .step-inactive {
        opacity: 0.7;
    }

    .step-success {
        transition: background-color 0.3s ease;
        color: #43A047;
        
    }

    .step-link {
        cursor: pointer;
    }

    .step-link:hover {
        background-color: #e6e3da;
    }
    
}



</style>
