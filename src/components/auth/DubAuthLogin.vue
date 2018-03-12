<template>
  <div class="auth-login">
      <div class="title">Авторизация</div>
        <div class="auth-forms">
          <div class="form-login">
            <div class="form-title">Вход</div>
            <div class="form-content">
              <dub-input class="form-input" :class="{ 'error-input': $v.loginForm.email.$error }" placeholder="Почта" v-model.trim="loginForm.email" @blur="$v.loginForm.email.$touch()" @keyup.enter.native="submitLoginForm">
                <span slot="info" v-if="$v.loginForm.email.$error">{{!$v.loginForm.email.required ? 'Это обязательное поле': 'Поле  должно быть действительным электронным адресом'}}</span>
              </dub-input>
            </div>
            <div class="form-content">
              <dub-input class="form-input" :class="{ 'error-input':$v.loginForm.password.$error  }" placeholder="Пароль" type="password" v-model="loginForm.password" @blur="$v.loginForm.password.$touch()" @keyup.enter.native="submitLoginForm">
                <span slot="info" v-if="$v.loginForm.password.$error"> Это обязательное поле</span>
              </dub-input>
            </div>
            <div class="actions">
              <dub-button :active="loginBtnActive" @click.native="submitLoginForm">Войти</dub-button>
            </div>
          </div>
          <div class="register">
              <div class="register-info">
                  <div class="form-title">Новый пользователь</div>
                  <div class="register-description">
                      <div class="description-row">
                          Впервые на нашем сайте?
                      </div>
                      <div class="description-row">
                          Для совершения заказов заполните, пожалуйста, регистрационную форму.
                      </div>
                      <div class="description-row">
                          <router-link :to="'/auth/register?redirect=' + this.$route.query.redirect" class="link">
                            <dub-button type="secondary">регистрация</dub-button>
                          </router-link>
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
  name: 'DubAuthLogin',
  data: () => ({
    loginForm: {
      email: '',
      password: '',
    },
    loginBtnActive: false,
  }),
  validations: {
    loginForm: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    submitLoginForm() {
      this.$v.loginForm.$touch();
      if (!this.$v.loginForm.$error) {
        this.loginUser();
      }
    },
    getNextView() {
      return this.$route.query.redirect ? this.$route.query.redirect : '/';
    },
    loginUser() {
      this.loginBtnActive = true;
      this.$store.dispatch('loginUser', this.loginForm).then((user) => {
        this.$notify({
          group: 'dubbel',
          title: 'Вход выполнен',
          text: `С возвращением, ${user.name}!`,
          type: 'success',
        });
        this.loginBtnActive = false;
        this.loginForm = {
          email: '',
          password: '',
        };
        this.$store.dispatch('deleteActiveCart', localStorage.getItem('guest-user'));
        this.$store.dispatch('deleteGuest');
        this.$store.dispatch('requestActiveCart');
        const nextView = this.getNextView();
        this.$router.push(nextView);
      }).catch(() => {
        this.$notify({
          group: 'dubbel',
          title: 'Неверный логин или пароль',
          type: 'error',
        });
        this.loginForm.password = '';
        this.$v.loginForm.password.$reset();
        this.loginBtnActive = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.auth-login {
    position: relative;
    flex: 1;
    width: 80%;
    margin: 0 auto;
}

.title {
  padding: 24px 0;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin-top: 24px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: .025em;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 24px;
}



.auth-forms {
   @include prefix((
      display: flex,
      flex-direction: row,
      
      align-items: stretch,
    ), webkit ms);
    margin-top: 26px;
    
    padding: 46px;
    background-color: $upper_layer_color;
      border-radius: 2px;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-bottom: 36px;
}

.form-login {
  padding: 0 56px 16px 16px;
  width: 50%;
  border-right: 1px solid #e6e3da;
}

.form-item {
    padding: 4px 0;
}

.form-content {
    @include prefix((
      display: inline-flex,
      flex-direction: column,
    ), webkit ms);
    margin-bottom: 8px;
    width: 100%;
}

.form-label {
    min-width: 200px;
    text-align: right;
    font-size: 16px;
    letter-spacing: .025em;
    margin-right: 16px;

}


.register {
    height: 100%;
    
    width: 50%;
}

.register-description {
    margin-top: 16px;
}

.register-info {
    padding: 0 46px;
    
}

.description-row {
    
    margin: 16px auto;
    text-align: center;
    font-size: 16px;
}


.actions {
  margin: 24px 0 0 auto;
  width: 40%;
}



.link {
    text-decoration: none;
}

@media (max-width: 1450px) {
    
.auth-login {
    width: 85%;
}
}




</style>