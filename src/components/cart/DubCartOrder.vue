<template>
  <div class="cart-order">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="title">Корзина</div>
     <div class="cart-step" v-if="orderActive" key="order">
            <div class="cart-items">
                <div class="steps">
                    <router-link :to="'/cart'" class="step step-success step-link">
                        <div class="step-number step-number-success"><div>1</div></div> 
                        <div class="step-label">Корзина </div> 
                    </router-link>
                    <div class="step step-active">
                        <div class="step-number step-number-active"><div>2</div></div> 
                        <div class="step-label">Оформление заказа</div> 
                    </div>
                    <div class="step step-inactive">
                        <div class="step-number step-number-inactive"><div>3</div></div> 
                        <div class="step-label">Заказ оформлен</div> 
                    </div>              
                </div>
              <div class="cart-box">
                <div class="cart-form">
                  <div class="subtitle">Оформление заказа:</div>
                    <div class="form-row">
                      <div class="row-half">
                        <dub-input class="form-input" :class="{ 'error-input': $v.order.name.$error }" placeholder="Имя" v-model.trim="order.name" @blur="$v.order.name.$touch()">
                          <span slot="info" v-if="$v.order.name.$error">Это обязательное поле</span>
                        </dub-input>
                      </div>
                      <div class="row-half">
                        <dub-input class="form-input"  placeholder="Фамилия (не обязательно)" v-model.trim="order.surname"></dub-input>
                      </div>
                    </div>
                    <div class="form-row ">
                      <div class="row-half">
                        <dub-input class="form-input" :class="{ 'error-input': $v.order.email.$error }" placeholder="Почта" v-model.trim="order.email" @blur="$v.order.email.$touch()">
                           <span slot="info" v-if="$v.order.email.$error">{{!$v.order.email.required ? 'Это обязательное поле': 'Поле  должно быть действительным электронным адресом'}}</span>
                        </dub-input>
                      </div>
                      <div class="row-half">
                        <dub-input class="form-input" :class="{ 'error-input': $v.order.phone.$error }"  placeholder="Телефон" v-model.trim="order.phone" @blur="$v.order.phone.$touch()">
                          <span slot="info" v-if="$v.order.phone.$error">Это обязательное поле</span>
                        </dub-input>
                      </div>
                    </div>
                    <div class="form-row">
                      <dub-input :class="{ 'error-input': $v.order.address.$error }" placeholder="Адрес" v-model.trim="order.address" @blur="$v.order.address.$touch()">
                         <span slot="info" v-if="$v.order.address.$error">Это обязательное поле</span>
                      </dub-input>
                    </div>
                    <div class="form-row">
                      <dub-input type="textarea" rows="3" placeholder="Комментарий (не обязательно)" v-model.trim="order.comment"></dub-input>
                    </div>
               
              </div>
              </div>
              
              
            </div>
            <div class="cart-actions">
              <div class="cart-box">
                <div class="total-price">Итого: {{totalPrice}}&#x20bd;</div>
                <dub-button class="button" :active="buttonActive" @click.native="makeOrder">подтвердить заказ</dub-button>
                <dub-button :active="btnProfileActive" type="secondary" @click.native="updateProfile">обновить профиль</dub-button>
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
               
            </div>
            
          </div>
          <div class="cart-step" v-else key="order">
            <div class="cart-items">
                <div class="steps">
                    <div class="step step-success">
                        <div class="step-number step-number-success"><div>1</div></div> 
                        <div class="step-label">Корзина </div> 
                    </div>
                    <div class="step step-success">
                        <div class="step-number step-number-success"><div>2</div></div> 
                        <div class="step-label">Оформление заказа</div> 
                    </div>
                    <div class="step step-success">
                        <div class="step-number step-number-success"><div>3</div></div> 
                        <div class="step-label">Заказ оформлен</div> 
                    </div>
                </div>
                <div class="cart-box done">
                    <div class="subtitle">Заявка успешно создана! </div>
                    <div class="success-message"> В ближайшее время вам позвонит менеджер для подтверждения заказа. 
              Вы можете управлять заказами в личном кабинете.</div>
                      
             
                </div>

              
            </div>
            <div class="cart-actions">
              <div class="cart-box">
                <router-link to="/user">
                  <dub-button>В личный кабинет</dub-button>
                </router-link>

              <router-link to="/">
                <dub-button class="in-catalog" type="secondary">В каталог</dub-button>
              </router-link>
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
               
            </div>
          </div>
  </div>
</template>

<script>

import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'DubCartOrder',
  data: () => ({
    orderActive: true,
    buttonActive: false,
    btnProfileActive: false,
    breadcrumbs: [
      { label: 'Главная', link: '/' },
      { label: 'Корзина', link: '/cart' },
      { label: 'Оформление', link: '' },
    ],
    order: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      address: '',
      comment: '',
    },
  }),
  validations: {
    order: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      phone: {
        required,
      },
      address: {
        required,
      },
    },
  },
  computed: {
    cartProducts() {
      return this.$store.getters['cart/products'];
    },
    totalPrice() {
      return this.$store.getters['cart/getTotalPrice'];
    },
    user() {
      return this.$store.getters['user/profile'];
    },
  },
  methods: {
    updateProfile() {
      this.$v.order.name.$touch();
      this.$v.order.email.$touch();
      if (this.$v.order.name.$error || this.$v.order.email.$error) {
        return;
      }
      this.btnProfileActive = true;
      const profile = {
        name: this.order.name,
        email: this.order.email,
        phone: this.order.phone,
        is_company: this.user.is_company,
      };
      this.$store.dispatch('user/update', { form: profile, userId: this.user.id }).then(() => {
        this.$notify({
          group: 'dubbel',
          title: 'Профиль изменен',
          type: 'success',
        });
        this.btnProfileActive = false;
      });
    },
    makeOrder() {
      this.$v.order.$touch();
      if (this.$v.order.$error) {
        return;
      }
      this.buttonActive = true;
      this.order.products = this.cartProducts.map(cart => ({
        product_id: cart.product.pk,
        price_id: cart.price.pk,
        quantity: cart.quantity,
      }));
      this.$store.dispatch('cart/checkout', {
        phone: this.order.phone,
        address: this.order.address,
        products: this.order.products,
      }).then(() => {
        this.$notify({
          group: 'dubbel',
          title: 'Заявка отправлена',
          text: 'Наш менеджер свяжется с вами для подтверждения заказа',
          type: 'success',
        });
        this.order = {};
        this.orderActive = false;
        this.buttonActive = false;
      });
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        const user = val;
        if (Object.keys(user).length === 0 && user.constructor === Object) {
          return;
        }
        const order = {
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
        if (!user.is_company) {
          order.surname = user.profile_object.surname;
        }
        this.order = order;
      },
    },
  },
  created() {
    if (this.cartProducts.length === 0) {
      this.$router.push('/cart');
    }
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
  padding: 24px 16px;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 16px;
}

.success-message {
  padding: 16px;
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
  font-weight: bold;
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
      width: 11%;  
    
        text-align: center; 
    }

    .header-close {
      padding: 10px;
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
      padding: 0 16px;
      @include prefix((
      display: flex,
      flex-direction: row, 
      justify-content: space-between, 
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
      width: 45%;
      @include prefix((
      display: flex,
      flex-direction: row,
      
    ), webkit ms);



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

  .in-catalog {
    margin-top: 16px;
  }

@media (max-width: 1450px) {
    
.cart {
    width: 85%;
}
}

</style>