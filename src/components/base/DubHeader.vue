<template>
  <div class="dub-header">
      <!--
      <div class="law">
          <div>Наш магазин <b>не осуществляет</b> дистанционную продажу алкоголя и его доставку!</div>
          <div>Обращаем особое внимание, что информация размещенна в полном соответствии с письмом ФАС РФ от 13.09.12 №АК/29977</div>
      </div>
      -->
      <div class="header-info">
        <router-link to="/">
          <img class="logo" src="./../../assets/house_logo.png">
        </router-link>
        <div class="flex"></div>
        <div >
            <div class="help">
            <div class="help-link" v-response.small>Доставка</div>
            <div class="help-link" v-response.small>Оплата</div>
            <div class="help-link" v-response.small>Контакты</div>
            <div class="help-link" v-response.small :class="{'help-link-selected ': isSelected('/news')}"><router-link to="/news">Новости</router-link></div>
            <div class="help-link" v-response.small>О Магазине</div>
            </div>
            
        </div>
        <div class="contacts">
            <span class="phone">+7 (345) 54-54-444</span>
            <span class="phone">+7 (345) 14-23-564</span>
            <span class="time">Ежедневно c 9:00-22:00</span>
        </div>
      </div>
    <div :class="{'fixed-dummy': navFixed}"></div>
    <div id="nav" class="header-nav" :class="{'is-fixed': navFixed, 'is-fixed-visible': navVisible}">
        <img class="logo-text" src="./../../assets/dubbel_text.png">
        <!--
        <div class="nav-item">
            <div class="nav-category">
                 <span class="link">Акции</span>
            </div>
        </div>
        -->
        <div class="nav-item" :class="{'nav-selected': isSelected(`/catalog/${category.code}`)}" v-response.small v-for="category in categories" :key="category.pk">
          <router-link :to="'/catalog/' + category.code" class="nav-category">
            <span class="link" >{{ category.name }}</span>
          </router-link>
        </div>
        <div class="flex"></div>
        <div class="nav-icons">
          <div class="nav-item" :class="{'nav-selected': isSelected('/cart')}" v-response.small >
            <router-link to="/cart" class="nav-link nav-icon">
              <dub-badge :value="cart.length" :max="99" class="badge">
                <div class="link"><icon class="icon-link" name="shopping-cart"></icon></div>
              </dub-badge>
            </router-link>
          </div>
          <div class="nav-item " :class="{'nav-selected': isSelected('/auth')}" v-response.small  v-if="!isAuthenticated" key="login-user" @mouseover="guestPanelActive = true" @mouseout="guestPanelActive = false">
            <router-link :to="`/auth?redirect=${$route.path}`" class="nav-link nav-icon guest-icon">
                <div class="link"><icon class="icon-link" name="user-o"></icon></div>
            </router-link>
            <!--
                <div class="guest-panel" v-if="guestPanelActive || selfGuestPanelActive" @mouseover="selfGuestPanelActive = true" @mouseout="selfGuestPanelActive = false">
                    <div class="guest-panel-item">
                        <router-link to="/auth/login" >
                            <div class="panel-link">Вход</div>
                        </router-link>
                    </div>
                    <div class="guest-panel-item">
                        <router-link to="/auth/register" >
                            <div class="panel-link">Регистрация</div>
                        </router-link>
                    </div>
                </div>
            -->
          </div>
          <div class="nav-item" :class="{'nav-selected': isSelected('/user')}" v-response.small v-else key="login-user">
            <router-link to="/user" class="nav-icon nav-link">
                <div class="link"><icon class="icon-link" name="user"></icon></div>
            </router-link>
          </div>
          <div class="nav-item nav-icon nav-search" v-response.small>
              <div>
                  <div class="link"><icon class="icon-link"  name="search"></icon></div>
              </div>
            
          </div>
        </div>
    </div>
    <!--
    <dub-header-panel :nav-active="navActive" :categories="activeCategories"></dub-header-panel>
    -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DubHeaderPanel from '@/components/base/DubHeaderPanel';
import DubBadge from '@/components/base/DubBadge';

export default {
  name: 'DubHeader',
  components: {
    DubHeaderPanel,
    DubBadge,
  },
  data: () => ({
    msg: 'DubHeader',
    navActive: false,
    guestPanelActive: false,
    selfGuestPanelActive: false,
    activeCategories: [],
    navFixed: false,
    navVisible: false,
    navBottomOffcet: 175,
    navTopOffcet: 115,
    scrollPositionY: -1,
    scrollTicking: false,
    scrollDirection: 'none',
  }),
  computed: mapGetters({
    categories: 'getCategories',
    isAuthenticated: 'isAuthenticated',
    cart: 'cartProducts',
  }),
  created() {
    this.$store.dispatch('requestCategories');
    window.addEventListener('scroll', this.scrollHandler);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler);
  },
  methods: {
    activatePanel(categoryCode) {
      this.activeCategories = this.categories[categoryCode];
      this.navActive = true;
    },
    isSelected(path) {
      return this.$route.path.includes(path);
    },
    scrollUpdate() {
      if (!this.navFixed && this.scrollPositionY > this.navBottomOffcet) {
        this.navFixed = true;
      }
      if (this.navFixed && this.scrollPositionY < this.navTopOffcet) {
        this.navFixed = false;
      }
      if (this.scrollDirection === 'top') {
        setTimeout(() => {
          this.navVisible = true;
        }, 200);
      } else {
        setTimeout(() => {
          this.navVisible = false;
        }, 100);
      }
      this.scrollTicking = false;
    },
    scrollRequestTick() {
      if (!this.scrollTicking) {
        window.requestAnimationFrame(this.scrollUpdate);
        this.scrollTicking = true;
      }
    },
    scrollHandler() {
      this.scrollDirection = this.scrollPositionY > window.scrollY ? 'top' : 'down';
      this.scrollPositionY = window.scrollY;
      this.scrollRequestTick();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.dub-header {
    display: block;
    background-color: #fafafa;
    

}

.logo {
    display: block;
    padding: 16px 0 0 0;
    width: 130px;
    margin-bottom: -27px;
    position: relative;
    z-index: 3;
}

.logo-text {
    display: inline-block;
    margin-left: 10%;
    margin-right: 28px;
    margin-bottom: -12px;
    width: 130px;
}

.header-nav {
    position: relative;
    z-index: 2;
    height: 60px;
    background-color: $primary_color;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    line-height: 24px;
    font-weight: 700;
    box-shadow: 0 6px 12px 0 rgba(0,0,0,.1);
    width: 100%;

    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);

}

.header-info {
    width: 80%;
    margin: 0 auto;

    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
}

.contacts {
    -webkit-font-smoothing: antialiased;
    padding: 14px 0;
    color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: .01em;
    @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);

    .time {
        margin-top: 4px;
        font-size: 12px;
        letter-spacing: 0.011em;
    }
}

.help {
    -webkit-font-smoothing: antialiased;
    padding: 14px 0;
    color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    margin-right: 16px;
    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);
}

.help-link {
    position: relative;
    height: 100%;
    cursor: pointer;
    margin: 0 8px;

    a {
        text-decoration: none;
        color: $text_color;
    }
}

.help-link-selected {
    border-bottom: 3px solid $primary_color;
}


.flex {
    flex: 1;
}


.nav-item {
    position: relative;
    cursor: pointer;
    height: 100%;
   
    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: stretch,
    ), webkit ms);
    padding-bottom: 3px;
}

.nav-selected {
    padding-bottom: 0;
    border-bottom: 3px solid $text_color;
}


.nav-icons {
    margin-right: 10%;
    height: 100%;
    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
}

.nav-icon {
    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
    margin: 0 12px;
    
}

.nav-category {
    @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center,
    ), webkit ms);
    padding: 0 8px;
}
.active {
    padding-bottom: 0;
    border-bottom: 3px solid #252525;
        
    }

.guest-panel {
  position: absolute;
  top: 65px;
  left: 50px;
  background-color: $upper_layer_color;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  border-radius: 2px;

  
   @include prefix((
      display: flex,
      flex-direction: column,
    ), webkit ms);
}

.guest-panel::before {
    content: "";
    display: block;
    position: absolute;
    top: -9px;
    left: 23px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px;
    border-color: transparent transparent #fff transparent;
}

.guest-panel-item {
    
    font-size: 14px;
    font-weight: 400;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #e6e3da;
}

.guest-panel-item:hover {
    background-color: #e6e3da;
}

.panel-link {
    padding: 16px 24px;
    display: inline-block;
    position: relative;
    text-decoration: none;
    color: $text_color;
    
}



.link {
    display: inline-block;
    position: relative;
    text-decoration: none;
    color: $text_color;
    
}

.nav-link {
    position: relative;
    height: 100%;
}

.nav-search {
    margin-right: 0;
}

.is-fixed {
    position: fixed;
    top: -65px;
    transition: top .3s ease;
}

.is-fixed-visible {
    top: 0;
}

.fixed-dummy {
    height: 60px;
}



.icon-link {
    
width: 22px;
    height: 22px;
}

a {
    text-decoration: none;
}

@media (max-width: 1450px) {
    .header-info {
    width: 85%;
    }

    .logo-text {

    margin-left: 7.5%;
}

.nav-icons {
    margin-right: 7.5%;
}
    
}




</style>
