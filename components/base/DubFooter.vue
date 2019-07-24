<template>
  <div class="footer">
    <div class="separator"><img src="~/assets/images/house_logo.png" class="img-logo"></div>
    <div class="footer-info">
      <div class="info-links">
        <div>Контакты</div>
        <div>Новости</div>
        <div>О магазине</div>
      </div>
      <div class="info-social">
        <dub-icon  width=24 height=24 class="icon-link"><icon-instagram/></dub-icon>
        <dub-icon  width=24 height=24 class="icon-link"><icon-facebook/></dub-icon>
      </div>
      <div class="info-contacts">
        <div>г. Челябинск, ул. Свободы, 2</div>
        <div>По будням с 9:00 до 18:00 </div> 
        <div>support@houseofdubbel.ru</div>
        <div>8 (919) 400-27-37</div>
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
  margin: 16px 0 36px 0;
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
  margin-top: 16px;
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
.icon-link {
  opacity: 0.7;
  padding: 16px;
  width: 38px;
  height: 38px;
}
</style>
