<template>
  <div class="auth-register">
      <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="title">Авторизация</div>
        <div class="auth-forms">
          <div class="form-login">
            <div class="form-title">Новый пользователь</div>
            <div class="form-content">
              <dub-input class="form-input" :class="{ 'error-input': $v.registerForm.name.$error }" placeholder="Имя" v-model.trim="registerForm.name" @blur="$v.registerForm.name.$touch()">
                <span slot="info" v-if="$v.registerForm.name.$error">Это обязательное поле</span>
              </dub-input>
            </div>

            <div class="form-content">
              <dub-input class="form-input" :class="{ 'error-input': $v.registerForm.email.$error }" placeholder="Почта" v-model="registerForm.email" @blur="$v.registerForm.email.$touch()">
                <span slot="info" v-if="$v.registerForm.email.$error">{{!$v.registerForm.email.required ? 'Это обязательное поле': 'Поле  должно быть действительным электронным адресом'}}</span>
              </dub-input>
            </div>
        
            <div class="form-content">
              <dub-input class="form-input" :class="{ 'error-input': $v.registerForm.password.$error }" type="password" placeholder="Пароль" v-model="registerForm.password" @blur="$v.registerForm.password.$touch()">
                <span slot="info" v-if="$v.registerForm.password.$error">Это обязательное поле</span>
              </dub-input>
            </div>
        
            <div class="form-content row">
              <el-checkbox v-model="registerForm.is_company"></el-checkbox>
              <div class="form-label" @click=" registerForm.is_company = !registerForm.is_company">Юр. лицо</div>
            </div>

           
        
      
            <div class="form-content" v-if="registerForm.is_company">
              <dub-input class="form-input" :class="{ 'error-input': $v.registerForm.company_name.$error }" placeholder="Название компании" v-model="registerForm.company_name" @blur="$v.registerForm.company_name.$touch()">
                <span slot="info" v-if="$v.registerForm.company_name.$error">Это обязательное поле</span>
              </dub-input>
            </div>

             <div class="form-content row agreegment">
              <el-checkbox v-model="registerForm.agreegment" @change="$v.registerForm.agreegment.$touch()"></el-checkbox>
              <div class="form-label" @click=" registerForm.agreegment = !registerForm.agreegment">Согласен на обработку персональных данных</div>  
              <div class="label-error"  v-if="$v.registerForm.agreegment.$error">Требуется согласие</div>
            </div>
        
            <div class="actions">
              <dub-button :active="registerBtnActive" @click.native="submitRegisterForm">Регистрация</dub-button>
            </div>                 
               
            
          </div>
          <div class="register">
              <div class="register-info">
                  <div class="form-title">Вход</div>
                  <div class="register-description">
                      <div class="description-row">
                          Уже есть аккаунт?
                      </div>
                      <div class="description-row">
                          <router-link to="/auth/login" class="link">
                          <dub-button type="secondary">ВОЙТИ</dub-button>
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
  name: 'DubAuthRegister',
  data() {
    return {
      registerForm: {
        email: '',
        name: '',
        password: '',
        is_company: false,
        company_name: '',
        agreegment: false,
      },
      registerBtnActive: false,
      breadcrumbs: [
        { label: 'Главная', link: '/' },
        { label: 'Авторизация', link: '' },
      ],
    };
  },
  validations: {
    registerForm: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
      },
      agreegment: {
        required,
      },
      company_name: {
        companyNameValidator(value) {
          return !(this.registerForm.is_company && value === '');
        },
      },
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    submitRegisterForm() {
      this.$v.registerForm.$touch();
      if (!this.$v.registerForm.$error) {
        this.registerUser();
      }
    },
    getNextView() {
      return this.$route.query.redirect ? this.$route.query.redirect : '/';
    },
    registerUser() {
      this.registerBtnActive = true;
      if (this.registerForm.is_company) {
        this.registerForm.company = {
          name: this.registerForm.company_name,
        };
      } else {
        this.registerForm.individual = {
          surname: '',
        };
      }
      this.registerForm.company_name = undefined;
      this.$store.dispatch('registerUser', this.registerForm)
      .then(() => {
        this.$notify({
          group: 'dubbel',
          title: 'Регистрация успешна',
          type: 'success',
        });
        this.$store.dispatch('deleteActiveCart', localStorage.getItem('guest-user'));
        this.$store.dispatch('deleteGuest');
        this.$store.dispatch('setActiveCart');
        const nextView = this.getNextView();
        this.$router.push(nextView);
      })
      .catch(() => {
        this.$notify({
          title: 'Регистрация не успешна',
          type: 'error',
        });
      });
    },
    companyNameValidator() {

    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.auth-register {
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
}

.form-login {
  padding: 16px 56px 16px 16px;
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
    font-size: 14px;
    letter-spacing: .025em;
    margin-left: 8px;
    opacity: .7;
    cursor: pointer;
   
    transition: opacity .3s ease;

    &:hover {
      opacity: 1;
    }
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
    width: 60%;
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

.row {
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
    
}

.agreegment {
  margin-top: 16px;
}

.label-error {
  flex: 1;
  text-align: right;
  font-size: 12px;
  color: $error_color;
  margin-left: 8px;
}

@media (max-width: 1450px) {
    
.auth-register {
    width: 85%;
}
}




</style>