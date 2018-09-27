<template>
  <div id="app">
   
      <div v-show="!agreement" class="loader">
        <!-- Agreement block -->
        <div class="cover"></div>
        <div class="agreement">
          <div class="agreement-title">ВНИМАНИЕ</div>
          <div class="agreement-info">
            Сайт содержит информацию, которая не рекомендована лицам, моложе 18 лет. 
            Нажимая на кнопку "ПРОДОЛЖИТЬ", вы подтверждаете своё совершеннолетие.
          </div>
          <div class="agreement-info">
            Сведения, размещенные на сайте, не являются рекламой, 
            носят исключительно информационный характер, 
            и предназначены только для личного использования.
          </div>
          <div class="agreement-actions">
            <dub-button type="secondary" class="agree" @click.native="agree()">
              продолжить
            </dub-button>
          </div>
        </div>
      </div>
      <div v-show="agreement">
        <!-- Main content -->
        <dub-header/>
        <nuxt/>
      </div>
    
  </div>
</template>

<script>
import DubHeader from '~/components/base/DubHeader';

export default {
  name: 'app',
  components: {
    DubHeader,
  },
  data: () => ({
    agreement: true,
  }),
  methods: {
    agree() {
      sessionStorage.setItem('agreement', true);
      this.agreement = true;
    },
  },
  mounted() {
    this.agreement = sessionStorage.getItem('agreement') || false;
  },
};
</script>


<style lang="scss" scoped>
#app {
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  line-height: 1.5;
  min-height: 100vh;
  background-color: #f5f4f0;
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
  background: #44a4fc;
  border-left: 5px solid #187fe7;
  .notification-title {
    font-size: 14px;
  }
  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }
  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }
  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(http://mydubbelsite.ru/img/static/rhett-wesley-479644.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  color: #fafafa;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      justify-content: center,
      align-items: center,
    ),
    webkit ms
  );
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
  letter-spacing: 0.025em;
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
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-around,
      align-items: center,
    ),
    webkit ms
  );
  margin-top: 48px;
}
.my-button {
  color: #fafafa !important;
  font-size: 16px !important;
}
.my-button:hover {
  background-color: #ffd633 !important;
  color: #252525 !important;
}
.agree {
  width: 35%;
}
</style>
