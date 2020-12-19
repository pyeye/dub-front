<template>
  <div class="dub-header">
    <div :class="{'fixed-dummy': navFixed}"></div>
    <div class="header-wrapper" :class="{'is-fixed': navFixed, 'is-fixed-visible': navVisible}">

      <div class="header-info-box">
        <div class="header-info">
          <div class="flex"></div>
          <div class="contacts">
            <span class="phone">+7 (345) 54-54-444</span>
          </div>
        </div>
      </div>
      
      

      <div 
        id="nav"
        class="header-nav" 
        :class="{'nav-active': panelActive}"
      >
          <nuxt-link :to="'/'" class="nav-category">
            <img class="logo-text" src="~assets/images/house_of_dubbel.png">
          </nuxt-link>

          <div class="nav-panel"  v-show="!searchPanelActive">
            <!--
              
            <div
              class="nav-item"
              @mouseenter="openProductPanel()"
              @mouseleave="closeProductPanel"
              @click="closePernamentPanel()"
              v-response.small
            >
              <span class="link">
                <span class="link-item" :class="{'nav-selected': isSelected('/catalog')}">
                  Каталог
                </span>
              </span>
            </div>
            -->
            <div class="nav-item" v-response.small>
              <nuxt-link :to="'/catalog/beer'" class="nav-category">
                <span class="link">
                  <span class="link-item" :class="{'nav-selected': isSelected('/catalog')}">Каталог</span>
                </span>
              </nuxt-link>
            </div>
            <div class="nav-item" v-response.small>
              <nuxt-link :to="'/sales/catalog'" class="nav-category">
                <span class="link">
                  <span class="link-item" :class="{'nav-selected': isSelected('/sales/catalog')}">Акции</span>
                </span>
              </nuxt-link>
            </div>
            <div class="nav-item" v-response.small>
              <nuxt-link :to="'/sales/catalog'" class="nav-category">
                <span class="link">
                  <span class="link-item" :class="{'nav-selected': isSelected('/sales/catalog')}">Новости</span>
                </span>
              </nuxt-link>
            </div>
            <div class="nav-item" v-response.small>
              <nuxt-link :to="'/sales/catalog'" class="nav-category">
                <span class="link">
                  <span class="link-item" :class="{'nav-selected': isSelected('/sales/catalog')}">О магазине</span>
                </span>
              </nuxt-link>
            </div>
          </div>
          <div class="search-input" v-show="searchPanelActive">
              <input
                ref="search"
                placeholder="Поиск по каталогу"
                v-model="searchQuery"
                @focus="autocompletePanelActive = true"
                @blur="autocompletePanelActive = false"
                @keyup.enter="searchHandler"
                @keyup.up="prevAutocompleteItem"
                @keyup.down="nextAutocompleteItem"/>
            </div>

          <div class="nav-icons" >
            <div class="nav-item nav-icon nav-search" 
            v-response.small @click="openSearchPanel()" v-show="!searchPanelActive">
                <div>
                    <div class="link"><dub-icon  width=24 height=24 class="icon-link"><icon-search/></dub-icon></div>
                </div>
            </div>
            <div class="nav-item nav-icon nav-search" 
            v-response.small @click="closeSearchPanel()" v-show="searchPanelActive">
                <div>
                    <div class="link"><dub-icon  width=24 height=24 class="icon-link"><icon-close/></dub-icon></div>
                </div>
            </div>
          </div>

          

     
     </div> 

    

    </div>
    <!-- Search Panel -->

            <div 
              @mouseleave="autocompleteIndex = -1"
              v-show="searchPanelActive && autocompletePanelActive && searchAutocomplete.length > 0"
              class="search-autocomplete"
            >
              <div
                class="search-autocomplete-item"
                :class="{'autocomplete-item-selected': searchAutocomplete[autocompleteIndex] === autocompleteItem}"
                @mouseenter="autocompleteIndex = index"
                @click="searchQuery = autocompleteItem"
                v-for="(autocompleteItem, index) in searchAutocomplete"
                :key="index">
                {{ autocompleteItem }}
              </div>
            </div>
        <!-- End Search Panel -->

     <!-- Header Panel
     <transition name="slidepan">
        <div
        class="header-panel"
        v-show="panelActive"
        @mouseenter="selfActive = true"
        @mouseleave="closeSelf"
        >
        </div>
     </transition>
      End Header Panel -->

    <transition name="fadelol">
      <div v-show="searchPanelActive || panelActive" @click="closeSearchPanel()" class="overlay"></div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash';
import PreventScrollMixin from '@/mixins/prevent-scroll';

export default {
  name: 'DubHeader',
  mixins: [PreventScrollMixin],
  data: () => ({
    navActive: false,
    selfActive: false,
    keepActive: true,
    guestPanelActive: false,
    selfGuestPanelActive: false,
    activeCategory: { category: {} },
    closePermanent: false,
    navFixed: false,
    navVisible: false,
    navBottomOffcet: 85,
    navTopOffcet: 0,
    scrollPositionY: -1,
    scrollTicking: false,
    scrollDirection: 'none',
    navWidth: 0,
    moreCategories: [],
    searchPanelActive: false,
    searchQuery: '',
    searchAutocomplete: [],
    autocompleteIndex: -1,
    autocompletePanelActive: false,
  }),
  computed: {
    categories() {
      const categories = this.$store.getters['products/categories'];
      const reverseCategories = Object.assign([], categories);
      return reverseCategories.reverse();
    },
    panelActive() {
      return (this.navActive || this.selfActive) && this.keepActive;
    },
    morePanelActive() {
      return (
        this.moreCategories.length > 0 &&
        this.moreCategories.some(
          category => category.category.slug === this.activeCategory.category.slug
        )
      );
    },
    facets() {
      return this.activeCategory.facets;
    },
    productImage() {
      if (!this.activeCategory.products) {
        return '';
      }
      const mainImage = this.activeCategory.products[0].images.find(i => i.is_main);
      if (!mainImage) {
        return this.activeCategory.products[0].images[0].src;
      }
      return mainImage.src;
    },
  },
  watch: {
    searchQuery: {
      handler(val) {
        if (val.length > 2) {
          this.debounceAutocomplete();
        }
      },
    },
    panelActive(val) {
      this.preventScroll(val);
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler);
    this.debounceAutocomplete = _.debounce(this.requestAutocomplete, 500);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler);
  },
  methods: {
    openProductPanel(category) {
      this.activeCategory = category;
      this.navActive = true;
    },
    closeProductPanel() {
      if (!this.keepActive) {
        this.keepActive = true;
      }
      setTimeout(() => {
        this.navActive = false;
      }, 50);
    },
    closeSelf() {
      setTimeout(() => {
        this.selfActive = false;
      }, 50);
    },
    openSearchPanel() {
      this.searchPanelActive = true;
      this.$nextTick(() => this.$refs.search.focus());
      this.preventScroll(true);
    },
    closeSearchPanel() {
      this.searchPanelActive = false;
      this.preventScroll(false);
    },
    isSelected(path) {
      return this.$route.path.includes(path);
    },
    scrollUpdate() {
      if (!this.navFixed && this.scrollPositionY > this.navBottomOffcet) {
        this.navFixed = true;
      }
      if (this.navFixed && this.scrollPositionY <= this.navTopOffcet) {
        this.navFixed = false;
      }
      if (this.scrollDirection === 'top') {
        setTimeout(() => {
          this.navVisible = true;
        }, 50);
      } else {
        setTimeout(() => {
          this.navVisible = false;
        }, 50);
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
    searchHandler() {
      if (this.autocompleteIndex !== -1) {
        this.searchQuery = this.searchAutocomplete[this.autocompleteIndex];
        this.autocompleteIndex = -1;
      }
      this.closeSearchPanel();
      this.$router.push({ path: '/search', query: { q: this.searchQuery } });
    },
    async requestAutocomplete() {
      const response = await this.$api.get('completions/', {
        params: { prefix: this.searchQuery },
      });
      this.searchAutocomplete = response.data;
      this.autocompleteIndex = -1;
    },
    nextAutocompleteItem() {
      if (this.autocompleteIndex === this.searchAutocomplete.length) {
        this.autocompleteIndex = -1;
      } else {
        this.autocompleteIndex += 1;
      }
    },
    prevAutocompleteItem() {
      if (this.autocompleteIndex < 0) {
        this.autocompleteIndex = -1;
      } else {
        this.autocompleteIndex -= 1;
      }
    },
    closePernamentPanel() {
      this.navActive = false;
      this.keepActive = false;
    },
    facetLinkHandler() {
      this.selfActive = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    isHover() {
      // return this.panelActive && category.category.slug === this.activeCategory.category.slug;
      return true;
    },
    isMoreSelected() {
      // eslint-disable-next-line consistent-return
      this.moreCategories.forEach(category => {
        if (this.$route.path.includes(`/catalog/${category.category.slug}`)) {
          return true;
        }
      });
      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dub-header {
  background-color: #fafafa;
  position: relative;
  z-index: 9999;
}
.header-wrapper {
  display: grid;
  grid-template-columns:
    [full-start] minmax(48px, 1fr) [main-start] repeat(16, [col-start] minmax(12px, 160px))
    [main-end] minmax(48px, 1fr) [full-end];
  grid-template-rows: repeat(2, auto);
  background-color: #fafafa;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
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
  margin-right: 16px;
  margin-bottom: 6px;
  width: 150px;
  cursor: pointer;
}
.header-nav {
  grid-column: main-start / main-end;
  position: relative;
  z-index: 3;
  background-color: #fafafa;
  font-size: 18px;
  font-family: $accent_font;
  line-height: 24px;
  font-weight: 700;
  width: 100%;
  height: 60px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: space-between,
    ),
    webkit ms
  );
  .nav-active {
    box-shadow: 0 6px 4px -4px rgba(0, 0, 0, 0.1);
  }
}
.nav-panel {
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
  cursor: pointer;
}
.search-panel {
  position: relative;
  height: 100%;
  transition: opacity 0.3s ease;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.header-info-box {
  width: 100%;
  z-index: 3;
  position: relative;
  grid-column: main-start / main-end;
}
.header-info {
  position: relative;
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
  padding-top: 4px;
  margin-left: 8px;
  color: $text_color;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.2px;
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
  padding: 8px 0;
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
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
  margin-right: 16px;
  text-decoration: none;
  a {
    text-decoration: none;
    color: $text_color;
  }
}

.flex {
  @include prefix(
    (
      flex: 1,
    ),
    webkit ms
  );
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

.nav-icons {
  height: 100%;
  min-width: 166px;
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
  margin-left: auto;
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
}
.nav-category-link {
  margin: 4px 0;
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
  height: 100%;
  padding: 0 8px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}

.link-title {
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 3px), $primary_color 3px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s ease;
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
.link-item {
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.16px;
  width: calc(100%);
  background-image: linear-gradient(transparent calc(100% - 2px), $text_color 2px);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.3s ease;
  height: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
  &:hover {
    background-size: 100% 100%;
    opacity: 1;
  }
}
.nav-selected {
  background-size: 100% 100%;
}
.link-item-hover {
  background-size: 100% 100%;
  opacity: 1;
}
.nav-link {
  position: relative;
  height: 100%;
}
.nav-search {
  margin-right: 0;
}
.search-input {
  position: relative;
  width: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: center,
    ),
    webkit ms
  );
}
.search-input input {
  border: 0;
  font-size: 20px;
  padding: 8px;
  color: #252525;
  text-align: center;
  width: 100%;
  background-color: #f7f7f7;
  border-radius: 4px;
}
.search-input input:focus {
  outline: 0;
  color: #252525;
}
.search-input input::placeholder {
  color: #252525;
  opacity: 0.4;
}
.search-close {
  position: relative;
  cursor: pointer;
  padding: 0 8px;
  @include prefix(
    (
      align-self: center,
    ),
    webkit ms
  );
}
.search-autocomplete {
  font-size: 16px;
  font-weight: 400;
  background-color: #eee;
  color: $text_color;
  position: absolute;
  z-index: 4;
  top: 85px;
  width: 100%;
}
.search-autocomplete-item {
  padding: 8px;
  cursor: pointer;
}
.autocomplete-item-selected {
  background-color: #e6e3da;
}
.overlay {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  top: 85px;
  z-index: 2;
  opacity: 1;
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
  top: -85px;
  transition: top 0.3s ease;
}
.is-fixed-visible {
  top: 0;
}
.fixed-dummy {
  height: 85px;
}

.header-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: $upper_layer_color;
  border-radius: 0 0 3px 3px;
  z-index: 3;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 24px 0;
  opacity: 1;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: rgba(40, 40, 40, 0.2);
    left: 0;
    right: 0;
    top: 0;
  }
}

.slidepan-enter-active,
.slidepan-leave-active {
  transition: all 0.3s ease;
}
.slidepan-enter,
.slidepan-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fadelol-enter-active,
.fadelol-leave-active {
  transition: opacity 0.3s ease;
}
.fadelol-enter,
.fadelol-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.more-categories {
  width: 200px;
  border-left: 1px solid #e6e3da;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
  .more-category {
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
}

.link-facet {
  padding-bottom: 4px;
}

.button {
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: $text_color;
}
.product-name {
  position: relative;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: 4px 8px;
  opacity: 0.7;
  font-size: 16px;
  font-weight: 600;
}
.panel-content {
  height: 450px;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .content-categories {
    @include prefix(
      (
        display: flex,
        flex-direction: column,
        align-items: center,
        justify-content: center,
      ),
      webkit ms
    );
    border-right: 1px solid #e6e3da;
    width: 200px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.012em;
    line-height: 24px;
    position: relative;
  }
  .content-meta {
    width: 1300px;
    overflow: hidden;
    padding: 0 24px;
    @include prefix(
      (
        display: grid,
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)),
        grid-template-rows: 450px,
      ),
      webkit ms
    );

    .content-facets {
      padding: 8px;
    }
  }

  .collapse-title {
    color: $text_color;
    font-size: 16px;
    letter-spacing: -0.012em;
    font-weight: 600;
    opacity: 0.7;
    padding-bottom: 12px;
  }

  .facets-values {
    margin: 8px 0;
    color: $text_color;
    font-size: 14px;
    font-weight: 600;
    opacity: 0.7;
    cursor: pointer;
    width: calc(100%);
    background-image: linear-gradient(transparent calc(100% - 3px), $primary_color 3px);
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 0.3s ease;
    height: 100%;
    &:hover {
      background-size: 100% 100%;
    }
  }

  .image {
    height: 250px;
    margin: 0 auto;
  }

  .show-all {
    margin-top: 20px;
    height: 35px;
  }
}
</style>
