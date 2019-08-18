<template>
  <div class="footer">
    <div class="separator"><img src="~/assets/images/house_logo.png" class="img-logo"></div>
    <div class="footer-info">
      <div class="info-links">
        <span class="text-row"><span class="link">Контакты</span></span>
        <span class="text-row"><span class="link">Новости</span></span>
        <span class="text-row"><span class="link">О магазине</span></span>
      </div>
      <div class="info-social">
        <dub-icon  width=24 height=24 class="icon-link"><icon-instagram/></dub-icon>
        <dub-icon  width=24 height=24 class="icon-link"><icon-facebook/></dub-icon>
      </div>
      <div class="info-contacts">
        <span class="text-row">г. Челябинск, ул. Свободы, 2</span>
        <span class="text-row">По будням с 9:00 до 18:00 </span> 
        <span class="text-row">support@houseofdubbel.ru</span>
        <span class="text-row">8 (919) 400-27-37</span>
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
  margin: 100px 0 50px 0;
  width: 100%;
}
.img-logo {
  height: 75px;
  width: 75px;
}
.separator {
  text-align: center;
  opacity: 0.7;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.separator:before,
.separator:after {
  content: '';
  border-top: 3px solid #252525;
  margin: 0 100px;
  flex: 1 0 100px;
  opacity: 0.8;
}

.separator:after {
  margin: 0 100px;
}
.footer-info {
  width: 90%;
  margin: 0 auto;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.info-links {
  padding: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
      justify-content: center,
      flex: 1,
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
      align-items: center,
      justify-content: center,
      flex: 1,
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
      align-items: center,
      justify-content: center,
      flex: 1,
    ),
    webkit ms
  );
}
.text-row {
  font-size: 16px;
  line-height: 18px;
  font-weight: 400;
  margin: 4px;
  opacity: 0.7;
  font-family: $accent_font;
  color: $text_color;
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
  background-image: linear-gradient(transparent calc(100% - 2px), $primary_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.4s ease, color 1.6s ease-in-out;
  &:hover {
    background-size: 100% 100%;
  }
}
</style>
