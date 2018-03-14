<template>
  <div id="app">
    <transition name="fade"  mode="out-in">
      <div v-if="!agreement" class="loader" key="agreement">
        <!-- Agreement block -->
        <div class="cover"></div>
        <div class="agreement">
          <div class="agreement-title">ВНИМАНИЕ</div>
          <div class="agreement-info">Сайт содержит информацию, которая не рекомендована лицам, моложе 18 лет. Нажимая на кнопку "ПРОДОЛЖИТЬ", вы подтверждаете своё совершеннолетие.</div>
          <div class="agreement-info">Сведения, размещенные на сайте, не являются рекламой, носят исключительно информационный характер, и предназначены только для личного использования.</div>
          <div class="agreement-actions">
            <dub-button type="secondary" class="agree" @click.native="agree()">продолжить</dub-button>
          </div>
        </div>
      </div>
      <div v-else key="content">
        <!-- Main content -->
        <dub-header></dub-header>
         <transition name="fade" mode="out-in">
            <router-view/>
         </transition>
      </div>
    </transition>
    
    <!-- Notifications -->
    <notifications group="dubbel" position="bottom right"  width="350" />
      
    <notifications group="cart" position="bottom right" width="350">
      <template slot="body" scope="props">
         <router-link class="link" :to="'/cart'">
            <div class="dub-notification success" @click="props.close">
              <div class="notification-title"> {{props.item.title}} </div>
              <div>{{props.item.text}}</div>
            </div> 
          </router-link>
      </template>
    </notifications>
    
  </div>
</template>

<script>

import request from '@/request/index';
import DubHeader from '@/components/base/DubHeader';

export default {
  components: {
    DubHeader,
  },
  name: 'app',
  data: () => ({
    agreement: false,
  }),
  methods: {
    agree() {
      sessionStorage.setItem('agreement', true);
      this.agreement = true;
    },
  },
  created() {
    this.agreement = sessionStorage.getItem('agreement') || false;

    const token = localStorage.getItem('user-token');
    if (token) {
      request.defaults.headers.common.Authorization = `JWT ${token}`;
      this.$store.dispatch('requestUser').then(() => {
        this.$store.dispatch('requestActiveCart');
      });
    } else {
      const id = localStorage.getItem('guest-user');
      const guest = {};
      if (id) {
        guest.id = id;
      } else {
        const generatedId = Math.random().toString(13).replace('0.', '');
        localStorage.setItem('guest-user', generatedId);
        guest.id = generatedId;
      }
      this.$store.commit('setGuest', guest);
      this.$store.dispatch('requestActiveCart');
    }
  },
};
</script>

<style lang="scss" scoped>
#app {
    min-height: 100vh;    
  color: #252525;
  display: flex;
  flex-direction: column;
}

.link {
  text-decoration: none;
}

.dub-notification {
   padding: 10px;
   margin: 0 5px 5px;

   font-size: 12px;
   text-decoration: none;
   color: #fafafa;
   background: #44A4FC;
   border-left: 5px solid #187FE7;

  .notification-title {
    font-size: 14px;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }

  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }

  &.info {
    /*
    Style for specific type of notification, will be applied when you
    call notification with "type" parameter:
    this.$notify({ type: 'my-type', message: 'Foo' })
    */
    background: #fc0;
    border-left-color: #fc0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
   background-image: url(http://houseofdubbel.tk/img/static/rhett-wesley-479644.jpg);
        background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    color: #fafafa;
  @include prefix((
      display: flex,
      flex-direction: column,
      justify-content: center,
      align-items: center,
    ), webkit ms);
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
   background-color: #000;
        opacity: 0.7;
  
}

.agreement {
 z-index: 2;
 width: 40%;
  transform: translateY(10%);
}

.agreement-title {
  text-align: center;
 font-size: 32px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 16px;
}

.agreement-info {
  padding: 16px;
  
  font-size: 16px;
   font-weight: bold;
    line-height: 24px;
}

.agreement-actions {
  @include prefix((
      display: flex,
      flex-direction: row,
      justify-content: space-around,
      align-items: center,
    ), webkit ms);
    margin-top: 48px;
}

.my-button {
  color: #fafafa !important;
  font-size: 16px  !important;
}

.my-button:hover {
  background-color: #ffd633 !important;
  color: #252525 !important;
}

.agree {
  width: 35%;
}
</style>
