<template>
  <div class="user">
    <div class="flex-box">
     <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
    <div class="nav-panel">
      
      <div class="title">Личный кабинет</div>
      <div class="nav-item" @click="tabIndex = 'profile'" :class="{ 'nav-item-active': tabIndex == 'profile' }">
        <router-link class="tab-link" to="/user/profile" :class="{ 'tab-link-active': tabIndex == 'profile' }">Профиль</router-link>
      </div>
      <div class="nav-item" @click="tabIndex = 'orders'" :class="{ 'nav-item-active': tabIndex == 'orders' }">
        <router-link class="tab-link" to="/user/orders" :class="{ 'tab-link-active': tabIndex == 'orders' }">Заказы</router-link>
      </div>
      <div class="nav-item"  @click="tabIndex = 'doneorders'" :class="{ 'nav-item-active': tabIndex == 'doneorders' }">
        <router-link class="tab-link" to="/user/doneorders" :class="{ 'tab-link-active': tabIndex == 'doneorders' }">Архив</router-link>
      </div>
      <div class="nav-item"  @click="tabIndex = 'carts'" :class="{ 'nav-item-active': tabIndex == 'carts' }">
        <router-link class="tab-link" to="/user/carts"  :class="{ 'tab-link-active': tabIndex == 'carts' }">Шаблоны</router-link>
      </div>
      <div class="nav-item-flex"></div>
      <div class="nav-item"><span class="logout" @click="logOutUser">Выход <icon class="icon-link"  name="sign-out"></icon> </span></div>
    </div>

    <div class="content">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
     
  </div>
  </div>
  
</template>

<script>

export default {
  name: 'DubUser',
  data: () => ({
    tabIndex: '',
    avalableViews: {
      profile: 'Профиль',
      orders: 'Заказы',
      doneorders: 'Архив',
      carts: 'Шаблоны',
    },
  }),
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    breadcrumbs() {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Личный кабинет', link: '' },
        { label: this.avalableViews[this.tabIndex], link: '' },
      ];
    },
  },
  methods: {
    logOutUser() {
      this.$store.dispatch('deleteActiveCart', this.user.id);
      this.$store.dispatch('logoutUser');
      this.$store.dispatch('setActiveCart');
      this.$router.push('/');
    },
  },
  created() {
    const view = this.$route.path.split('/');
    this.tabIndex = view.length > 2 ? view[2] : 'profile';
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.user {
    position: relative;
    flex: 1;
    width: 80%;
    margin: 0 auto;
    
}

.flex-box {
  @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
}

.nav-panel {
  z-index: 1;
  margin: 4px 0 24px 0;
  
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
}

.title {
  margin-right: 48px;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
    
}

.nav-item {
  margin: 16px 24px 4px 0;
  color: $text_color;
  opacity: 0.8;
  padding-bottom: 3px;
}

.nav-item:hover {
  border-bottom: 3px solid $primary_color;
  padding-bottom: 0;
}

.nav-item-flex {
  @include prefix((
      flex: 1,
    ), webkit ms);
}

.nav-item-active {
  border-bottom: 3px solid $primary_color;
  opacity: 1;
  padding-bottom: 0;
}



.tab-link {
  text-decoration: none;
  font-weight: bold;
  
  color: $text_color;
  letter-spacing: .6px;
  font-size: 16px;
        font-weight: bold;
        line-height: 28px;
}



.logout {
  cursor: pointer;
  position: relative;
  top: -4px;
}

.icon-link {
position: relative;
  top: 4px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}



@media (max-width: 1450px) {
    
.user {
    width: 85%;
}
}







</style>
