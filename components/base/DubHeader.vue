<template>
  <div class="dub-header">
    <div class="header-info">
      <!--
      <div class="tagline">
        <div class="tagline-row">Родной дом</div>
        <div class="tagline-row">лучших</div>
        <div class="tagline-row">напитков</div>
      </div>
      -->
      
      <div>
        <div class="help">
          <div class="help-link" v-response.small>Доставка</div>
          <div class="help-link" v-response.small>Оплата</div>
          <div class="help-link" v-response.small>Контакты</div>
          <div
            class="help-link"
            v-response.small
            :class="{'help-link-selected ': isSelected('/news')}"
          >
            <nuxt-link to="/news">Новости</nuxt-link>
          </div>
          <div class="help-link" v-response.small>О Магазине</div>
        </div>
      </div>
      <div class="flex"></div>
      <div class="contacts">
        <span class="phone">+7 (345) 54-54-444</span>
      </div>
      <div class="contacts">
        <span class="phone">Ежедневно c 9:00-22:00</span>
      </div>
    </div>

    <div :class="{'fixed-dummy': navFixed}"></div>
    <div id="nav" class="header-nav" :class="{'is-fixed': navFixed, 'is-fixed-visible': navVisible}">
      <div class="nav">
        <img class="logo-text" src="~assets/images/dubbel_text.png">
        <!--
        <div class="nav-item">
            <div class="nav-category">
                 <span class="link">Акции</span>
            </div>
        </div>
        -->
        <div class="nav-panel"  v-show="searchPanelActive === false">
          <div class="nav-categories nav-categories-hide" ref="nav">
          <div
          class="nav-item"
          :class="{'nav-selected': isSelected(`/catalog/${category.slug}`)}"
          @mouseover="activatePanel(category)"
          @mouseout="navActive = false"
          v-response.small
          v-for="category in categories"
          :key="category.pk">
          <nuxt-link :to="'/catalog/' + category.slug + '?nfacets=price%3A566-776'" 
          class="nav-category">
            <span class="link" >{{ category.name }}</span>
          </nuxt-link>
        </div>
        </div>
        
        <div class="nav-more" @mouseover="activatePanel(moreCategories)"
          @mouseout="navActive = false">
            <span class="link">И ещё •••</span>
        </div>
        <div class="flex"></div>
        <div class="nav-icons">
          <div class="nav-item nav-icon nav-search" v-response.small @click="searchPanelActive = true">
              <div>
                  <div class="link"><dub-icon  width=24 height=24 class="icon-link"><icon-search/></dub-icon></div>
              </div>

          </div>
        </div>
        </div>
        <div class="search-panel" v-show="searchPanelActive === true">
          <div><input @keyup.enter="searchHandler"/></div>
          <div class="flex"></div>
          <span @click="searchPanelActive = false"> закрыть </span>
        </div>
        
      </div>
      <dub-header-panel :nav-active="navActive" :category="activeCategories"></dub-header-panel>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DubHeaderPanel from '@/components/base/DubHeaderPanel';

export default {
  name: 'DubHeader',
  components: {
    DubHeaderPanel,
  },
  data: () => ({
    navActive: false,
    guestPanelActive: false,
    selfGuestPanelActive: false,
    activeCategories: [],
    navFixed: false,
    navVisible: false,
    navBottomOffcet: 175,
    navTopOffcet: 52,
    scrollPositionY: -1,
    scrollTicking: false,
    scrollDirection: 'none',
    navWidth: 0,
    hideCategoriesIndex: [],
    moreCategories: [],
    searchPanelActive: false,
  }),
  computed: {
    ...mapGetters({
      categories: 'products/categories',
    }),
  },
  mounted() {
    this.navWidth = this.$refs.nav.clientWidth;
    window.addEventListener('scroll', this.scrollHandler);
    Array.from(this.$refs.nav.children).reduce((acc, value, index) => {
      const newAcc = acc + value.clientWidth;
      if (newAcc > this.navWidth) {
        this.hideCategoriesIndex.push(index);
        value.classList.add('nav-category-hide');
        return newAcc;
      }
      return newAcc;
    }, 0);
    const allCategories = Object.assign([], this.categories);
    const [hideFrom] = this.hideCategoriesIndex;
    this.moreCategories = allCategories.splice(hideFrom);
    this.$refs.nav.classList.remove('nav-categories-hide');
    // reduce sum children width < panel width rest set display none and get last visible index
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler);
  },
  methods: {
    activatePanel(category) {
      this.activeCategories = category;
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
    searchHandler(e) {
      this.$router.push({ path: '/search', query: { q: e.target.value } });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dub-header {
  display: block;
  background-color: #fafafa;
  position: relative;
}
.logo {
  display: block;
  padding: 16px 0 0 0;
  width: 130px;
  margin-bottom: -27px;
  position: relative;
  z-index: 4;
}
.logo-text {
  display: inline-block;
  margin-right: 28px;
  margin-bottom: 12px;
  width: 130px;
}
.header-nav {
  position: relative;
  z-index: 3;
  background-color: $primary_color;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  line-height: 24px;
  font-weight: 700;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  .nav {
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: flex-end,
      ),
      webkit ms
    );
    width: 80%;
    margin: 0 auto;
    height: 60px;
  }
}
.nav-panel {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.search-panel {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.header-info {
  width: 80%;
  margin: 0 auto;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.contacts {
  -webkit-font-smoothing: antialiased;
  padding: 14px 0;
  margin-left: 8px;
  color: $text_color;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.7;
  letter-spacing: 0.01em;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
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
  opacity: 0.7;
  letter-spacing: -0.012em;
  margin-right: 16px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
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
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: stretch,
    ),
    webkit ms
  );
  padding-left: 4px;
  padding-bottom: 3px;
}

.nav-more {
  position: relative;
  cursor: pointer;
  height: 100%;
  min-width: 80px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  padding-left: 8px;
  padding-bottom: 3px;
}

.nav-categories {
  position: relative;
  cursor: pointer;
  height: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: stretch,
      justify-content: space-around,
    ),
    webkit ms
  );
  padding-left: 4px;
  padding-bottom: 3px;
}

.nav-categories-hide {
  @include prefix(
    (
      flex-wrap: wrap,
    ),
    webkit ms
  );
  overflow: hidden;
}

.nav-category-hide {
  display: none;
}

.nav-selected {
  padding-bottom: 0;
  border-bottom: 3px solid $text_color;
}
.nav-icons {
  height: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}
.nav-icon {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  margin: 0 12px;
}
.nav-category {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.guest-panel::before {
  content: '';
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
.icon-link {
  width: 28px;
  height: 28px;
}

.tagline {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  margin-top: 52px;
  font-size: 14px;
  font-weight: 600;

  line-height: 20px;
  opacity: 0.7;
}
a {
  text-decoration: none;
}
.is-fixed {
  position: fixed;
  top: -65px;
  transition: top 0.3s ease;
}
.is-fixed-visible {
  top: 0;
}
.fixed-dummy {
  height: 60px;
}
@media (max-width: 1450px) {
  .header-info {
    width: 85%;
  }
  .header-nav {
    .nav {
      width: 85%;
    }
  }
}
</style>
