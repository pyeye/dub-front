<template>
  <div class="user-profile">
    <div class="contact-form">
      <div class="form-title">Контактные данные</div>        
        <div class="form-content">
          <dub-input class="form-input" :class="{ 'error-input': $v.profileForm.name.$error }" placeholder="Имя" v-model="profileForm.name" @blur="$v.profileForm.name.$touch()">
            <span slot="info" v-if="$v.profileForm.name.$error">Это обязательное поле</span>
          </dub-input>
        </div>       
        <div class="form-content" v-if="!user.is_company">
          <dub-input class="form-input" placeholder="Фамилия" v-model="profileForm.surname"></dub-input>
        </div>
        <div class="form-content">
          <dub-input class="form-input" :class="{ 'error-input': $v.profileForm.email.$error }" placeholder="Почта" disabled v-model="profileForm.email" @blur="$v.profileForm.email.$touch()">
            <span slot="info" v-if="$v.profileForm.email.$error">{{!$v.profileForm.email.required ? 'Это обязательное поле': 'Поле  должно быть действительным электронным адресом'}}</span>
          </dub-input>
        </div>        
        <div class="form-content">
          <dub-input class="form-input" placeholder="Телефон" v-model="profileForm.phone"></dub-input>
        </div>       
        <div class="form-content" v-if="user.is_company" key="is_company">
          <dub-input class="form-input" placeholder="Название компани" v-model="profileForm.company_name"></dub-input>
        </div>       
        <div class="actions">
          <dub-button :active="profileBtnActive" @click.native="submitProfileForm">сохранить</dub-button>
        </div>
                    
                
           
    </div>
    <div class="pass-form">
      <div class="form-title">Смена пароля</div>       
        <div class="form-content">
            <dub-input class="form-input" :class="{ 'error-input': $v.passForm.old_password.$error }" type="password" placeholder="Старый пароль" v-model="passForm.old_password" @blur="$v.passForm.old_password.$touch()">
              <span slot="info" v-if="$v.passForm.old_password.$error">Это обязательное поле</span>
            </dub-input>
            
        </div>
        <div class="form-content">
          <dub-input class="form-input" :class="{ 'error-input': $v.passForm.password.$error }" type="password" placeholder="Новый пароль" v-model="passForm.password" @blur="$v.passForm.password.$touch()">
              <span slot="info" v-if="$v.passForm.password.$error">Это обязательное поле</span>
            </dub-input>
        </div>
        <div class="pass-actions">
          <dub-button :active="passBtnActive" type="secondary" @click.native="submitPassForm">сохранить</dub-button>
        </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'DubUserProfile',
  data() {
    return {
      passForm: {
        old_password: '',
        password: '',
      },
      profileForm: {},
      passBtnActive: false,
      profileBtnActive: false,
    };
  },
  validations: {
    passForm: {
      old_password: {
        required,
      },
      password: {
        required,
      },
    },
    profileForm: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
  computed: {
    user() {
      const user = this.$store.getters.getUser;
      if (Object.keys(user).length === 0 && user.constructor === Object) {
        this.profileForm = { individual: {}, company: {} };
      } else {
        const form = {
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
        if (user.is_company) {
          form.company_name = user.company.name;
        } else {
          form.surname = user.individual.surname;
        }
        this.profileForm = form;
      }

      return user;
    },
  },
  methods: {
    submitPassForm() {
      this.$v.passForm.$touch();
      if (!this.$v.passForm.$error) {
        this.passBtnActive = true;
        this.$store.dispatch('updatePass', this.passForm).then(() => {
          this.$notify({
            group: 'dubbel',
            title: 'Пароль изменен',
            type: 'success',
          });
          this.passForm = {
            old_password: '',
            password: '',
          };
          this.$v.passForm.$reset();
          this.passBtnActive = false;
        }).catch((error) => {
          this.$notify({
            group: 'dubbel',
            title: 'Пароль не изменен',
            text: error.data.password.join(),
            type: 'error',
          });
          this.passForm.old_password = '';
          this.$v.passForm.old_password.$reset();
          this.passBtnActive = false;
        });
      }
    },
    submitProfileForm() {
      this.$v.profileForm.$touch();
      if (this.$v.profileForm.$error) {
        return;
      }
      this.profileBtnActive = true;
      if (this.user.is_company) {
        this.profileForm.company = {
          name: this.profileForm.company_name,
        };
        this.profileForm.company_name = undefined;
      } else {
        this.profileForm.individual = {
          surname: this.profileForm.surname,
        };
        this.profileForm.surname = undefined;
      }
      this.profileForm.is_company = this.user.is_company;
      this.$store.dispatch('updateUser', { form: this.profileForm, userId: this.user.id }).then(() => {
        this.$notify({
          group: 'dubbel',
          title: 'Профиль изменен',
          type: 'success',
        });
        this.$v.passForm.$reset();
        this.profileBtnActive = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.user-profile {
  position: relative;
    
    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
    background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  padding: 24px;
  margin-bottom: 36px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: .025em;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 24px;
}


.contact-form {
  padding: 16px 40px 16px 16px;
  width: 50%;
  border-right: 1px solid #e6e3da;
}

.pass-form {
  padding: 16px 40px;
  width: 50%;
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

.pass-label {
    min-width: 150px;
    text-align: right;
    font-size: 16px;
    letter-spacing: .025em;
    margin-right: 16px;

}


.actions {
     margin: 24px 0 0 auto;
  width: 50%;
}

.pass-actions {
  margin: 24px 0 0 auto;
  width: 50%;
}

</style>