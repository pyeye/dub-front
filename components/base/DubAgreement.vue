<template>
<transition name="fade">
  <div v-show="!agreement" class="loader">
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
        <dub-button type="secondary" @click.native="agree()">
          <span class="agree">продолжить</span>
        </dub-button>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import PreventScrollMixin from '@/mixins/prevent-scroll';

export default {
  name: 'DubAgreement',
  mixins: [PreventScrollMixin],
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
  watch: {
    agreement: {
      immediate: true,
      handler(val) {
        const overflow = true;
        this.preventScroll(!val, overflow);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  color: $text_color;
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
  background-color: #fff;
  opacity: 0.9;
}
.agreement {
  padding: 48px;
  background-color: $overlay_color;
  z-index: 2;
  width: 40%;
}
.agreement-title {
  text-align: center;
  font-size: 54px;
  font-weight: 300;
  letter-spacing: 6px;
  line-height: 42px;
  font-family: $accent_font;
  margin-bottom: 16px;
}
.agreement-info {
  padding: 16px;
  font-size: 16px;
  font-weight: 400;
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
.agree {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-transform: uppercase;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
