<template>
  <div class="cart-info">
         <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
         <div class="title">Корзина</div>
          <div class="cart-step">
            <div class="cart-items">
                <div class="steps">
                    <div class="step step-active">
                        <div class="step-number step-number-active"><div>1</div></div> 
                        <div class="step-label">Корзина </div> 
                    </div>
                    <div class="step step-inactive">
                        <div class="step-number step-number-inactive"><div>2</div></div> 
                        <div class="step-label">Оформление заказа</div> 
                    </div>
                    <div class="step step-inactive">
                        <div class="step-number step-number-inactive"><div>3</div></div> 
                        <div class="step-label">Заказ оформлен</div> 
                    </div>
                </div>
              <div class="cart-box">
                <div class="cart-header">
                  <div class="header-name">Товары</div>
                  <div class="header-measure">Объем</div>
                  <div class="header-price">Цена</div>
                  <div class="header-quantity">Кол-во</div>
                  <div class="header-price">Стоимость</div>
                  <div class="header-close"></div>
                </div>
                <dub-cart-product 
                  v-for="cart in cartProducts" 
                  :key="cart.price.pk" 
                  :cart="cart" />
              </div>
            </div>


            <div class="cart-actions">
              <div class="cart-box">
                <div class="total-price">Итого: {{totalPrice}}&#x20bd;</div>
                <router-link :to="'/cart/order'">
                  <dub-button class="button">оформить заказ</dub-button>
              </router-link>

              <dub-button type="secondary" @click.native="dialogVisible = true">сохранить как шаблон</dub-button>
              <el-dialog title="Шаблон корзины" :visible.sync="dialogVisible">
                <div>
                  <dub-input :class="{ 'error-input': $v.cartName.$error }" placeholder="Имя шаблона" v-model="cartName" @blur="$v.cartName.$touch()">
                    <span slot="info" v-if="$v.cartName.$error"> Это обязательное поле</span>
                  </dub-input>
                  <div class="dialog-actions">
                    <dub-button class="dialog-my-button" :active="buttonActive"  @click.native="saveCart">сохранить</dub-button>
                    <dub-button class="dialog-my-button" type="secondary" @click.native="dialogVisible = false">отмена</dub-button>
                  </div>
                  
                </div>
              </el-dialog>
              
              
              </div>

              <div class="cart-box">
                <div class="info-title">Нужна помощь?</div>
                <div class="info-description"> Если у Вас возникли сложности при оформлении заказа, Вы можете сделать заявку по телефону или по электронной почте в рабочее время.</div>
                <div class="info-contacts">
                  <div class="contacts-time">
                    <div>Ежедневно</div>
                    <div>c 9:00-22:00</div>
                  </div>
                  <div class="contacts-phone">
                    <div>+7 (345) 54-54-444</div>
                    <div>info@du2bel.ru</div>
                    </div>
                </div>
              </div>

              <!--
              <div class="cart-box">
                <div class="info-title">Внимание!</div>
                <div class="info-description"> Наш магазин <b>не осуществляет</b> дистанционную продажу алкоголя и его доставку!</div>
                <div class="info-description"> Но мы ждем вас в наших магазинах, где есть возможность купить продукцию, информация о которой размещена на сайте.</div>
              </div>     
              -->    
            </div>
        </div>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators';
import DubCartProduct from '@/components/cart/DubCartProduct';

export default {
  name: 'DubCartInfo',
  components: {
    DubCartProduct,
  },
  data: () => ({
    cartName: '',
    buttonActive: false,
    dialogVisible: false,
    breadcrumbs: [
      { label: 'Главная', link: '/' },
      { label: 'Корзина', link: '' },
    ],
  }),
  validations: {
    cartName: {
      required,
    },
  },
  computed: {
    cartProducts() {
      return this.$store.getters.cartProducts;
    },
    totalPrice() {
      return this.$store.getters.getTotalPrice;
    },
  },
  methods: {
    saveCart() {
      this.$v.cartName.$touch();
      if (this.$v.cartName.$error) {
        return;
      }
      this.buttonActive = true;
      const savedCart = {};
      savedCart.products = this.cartProducts.map(cart => ({
        product_id: cart.product.pk,
        quantity: cart.quantity,
        price_id: cart.price.pk,
      }));
      savedCart.name = this.cartName;

      this.$store.dispatch('saveUserCart', savedCart).then((cart) => {
        this.cartName = '';
        this.buttonActive = false;
        this.dialogVisible = false;
        this.$notify({
          group: 'dubbel',
          title: 'Корзина сохранена',
          text: `Шаблон корзины ${cart.name} сохраннен в профиле`,
          type: 'success',
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.cart {
    position: relative;
    flex: 1;
    width: 80%;
    margin: 0 auto;
}

.title {
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin: 24px 0;
}

.subtitle {
  padding: 24px 0;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 16px;
}

.steps {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    width: 100%;
    margin-bottom: 24px;
    background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
    

    .step {
        @include prefix((
            flex: 1,
            display: flex,
            flex-direction: row,
            align-items: center,
        ), webkit ms);
        border-right: 1px solid  #e6e3da;
        padding: 24px;
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
        color: #43A047;
        cursor: pointer;
    }
}

.cart-step {
  @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
}

.cart-items {
  margin-bottom: 16px;
  width: 75%;
  @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
    

      .cart-box {
        background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-bottom: 24px;
      }
      
}

.cart-actions {
  @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
  width: 25%;
  margin-left: 24px;
  
  

      .cart-box {
        background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      padding: 32px;
      margin-bottom: 24px;

      .info-title {
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -.012em;
        line-height: 24px;
        font-family: 'Roboto', sans-serif;
        margin-bottom: 24px;
      }

      .info-description {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 16px;
      }

      .info-contacts {
        border-top: 1px solid #e6e3da;
        padding-top: 16px;
        @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);

    .contacts-time {
      width: 40%;
      font-size: 14px;
      margin-right: 16px;
    }
    .contacts-phone {
      font-size: 14px;
      width: 60%;
    }
      }
      }
}

.cart-header {
  width: 100%;
  padding: 16px 0;
  
        letter-spacing: .025em;
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center, 
    ), webkit ms);

    border-bottom: 1px solid #e6e3da;

    .header-name {
      
      margin-left: 16px;
      flex: 1;
    }
    

    .header-measure {
      width: 11%; 
     
        text-align: center; 
    }

    .header-price {
      width: 16%;   
   
        text-align: center; 
    }

    .header-quantity {
      width: 15%;  
      
        text-align: center; 
    }

    .header-close {
      padding: 6px;
    }
}

    .cart-form {
      padding: 24px;

      @include prefix((
      display: flex,
      flex-direction: column, 
    ), webkit ms);
    }

    .form-title {
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -.012em;
      line-height: 24px;
      width: 50%;
    }

    .form-row {
      padding: 16px;
      @include prefix((
      display: flex,
      flex-direction: row, 
    ), webkit ms);
    
    

    .form-textarea-description {
      padding-right: 16px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: .025em;
    line-height: 42px;
      margin-bottom: 8px;
      width: 17%;
      text-align: right;
      font-family: 'Roboto', sans-serif;
    }
    .form-textarea-input {
      width: 83%;
    }
    }

    .row-half {
      width: 50%;
      @include prefix((
      display: flex,
      flex-direction: row, 
    ), webkit ms);
    }

    .form-input {
      width: 65%;
    
    
    }

    .form-description {
      padding-right: 16px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: .025em;
    line-height: 42px;
      margin-bottom: 8px;
      width: 35%;
      text-align: right;

   
    font-family: 'Roboto', sans-serif;
    }

    .half {
      width: 35%;
      margin-left: 24px;
      float: right;
    }

    .done {
      padding: 24px;
    }

    a {
      text-decoration: none;
      color: #252525;
    }

    .total-price {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -.012em;
      line-height: 24px;
      font-family: 'Roboto';
      margin-bottom: 16px;
    }

    .button {
      margin-bottom: 16px;
    }

    .dialog-actions {
      @include prefix((
      display: flex,
      flex-direction: row-reverse, 
    ), webkit ms);
    margin-top: 24px;
    }

    .dialog-my-button {
     margin-left: 16px;
     width: 100px;
    }


@media (max-width: 1450px) {
    
.cart {
    width: 85%;
}
}



</style>