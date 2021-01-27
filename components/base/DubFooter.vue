<template>
  <div class="footer">
    <div class="footer-logo">
       <img src="~/assets/images/house_logo.png" class="img-logo">
       <img class="img-logo-text" src="~assets/images/dubbel_text.png">
    </div>
    <div class="footer-contacts">
      <div class="contacts">
        <div class="footer-title">Контакты</div>
        <div class="text-row">г. Челябинск, ул. Свободы, 2</div>
        <div class="text-row">По будням с 9:00 до 18:00 </div> 
        <div class="text-row">Суббота с 14:00 до 18:00 </div>
        <div class="text-row">support@houseofdubbel.ru</div>
        <div class="text-row">8 (919) 400-27-37</div>
      </div>
    </div>

    <div class="footer-links">
      <div class="info-links">
        <div class="footer-title">Магазин</div>
        <span class="text-row"><span class="link">Каталог</span></span>
        <span class="text-row"><span class="link">Акции</span></span>
        <span class="text-row"><span class="link">Коллекции</span></span>
        <span class="text-row"><span class="link">Новости</span></span>
        <span class="text-row"><span class="link">О магазине</span></span>
      </div>
    </div>

    <div class="footer-social">
      <div class="info-links">
        <div class="footer-title">Социальные сети</div>
        <span class="text-row"><span class="link">Instagram</span></span>
        <span class="text-row"><span class="link">Facebook</span></span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'DubFooter',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer {
  margin-top: 200px;
  background-color: $overlay_color;
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: auto;
  color: $secondary_text_color;
}
.footer-logo {
  grid-column: main-start / 4;
  grid-row: 1;
  margin: 96px 0;
}
.footer-contacts {
  grid-column: 4 / 8;
  grid-row: 1;
  margin: 80px 0;
}
.img-logo {
  height: 100px;
  width: 100px;
  margin-right: 48px;
}
.img-logo-text {
  width: 100px;
  margin-right: 48px;
  margin-top: -8px;
}
.footer-links {
  grid-column: 8 / 10;
  grid-row: 1;
  margin: 80px 0;
}
.footer-social {
  grid-column: 10 / 12;
  grid-row: 1;
  margin: 80px 0;
}

.footer-info {
  grid-column: main-start / main-end;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );
}
.footer-title {
  font-family: $accent_font;
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  margin-bottom: 16px;
  letter-spacing: 0px;
  color: $text_color;
}
.info-links {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.info-social {
  padding: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.info-contacts {
  padding: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      justify-content: center,
    ),
    webkit ms
  );
}
.text-row {
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  letter-spacing: 0px;
  margin: 4px 0;
  text-decoration: none;
}
.icon-link {
  opacity: 0.7;
  padding: 16px;
  width: 38px;
  height: 38px;
  cursor: pointer;
}
.link {
  cursor: pointer;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 1px), $text_color 1px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease, color 1.6s ease-in-out;
  &:hover {
    background-size: 100% 100%;
  }
}

@media (max-width: 1450px) {
  .footer {
    margin-top: 100px;
  }
  .text-row {
    font-size: 14px;
    line-height: 22px;
  }
  .footer-title {
    font-size: 16px;
    line-height: 22px;
  }
}
</style>
