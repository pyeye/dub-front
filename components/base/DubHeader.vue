<template>
  <div class="dub-header">
    <div class="header-info-box">
      <div class="header-info">
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
      </div>
    </div>
    

    <div :class="{'fixed-dummy': navFixed}"></div>
    <div id="nav" class="header-nav" :class="{'is-fixed': navFixed, 'is-fixed-visible': navVisible}">
      <div class="nav" :class="{'nav-active': navActive }">
        <nuxt-link :to="'/'" class="nav-category">
          <img class="logo-text" src="~assets/images/house_of_dubbel.png">
        </nuxt-link>

        <div class="nav-panel"  v-show="searchPanelActive === false">
          <div class="nav-categories nav-categories-hide" ref="nav">
            <div
              class="nav-item"
              
              v-response.small
            >
              <nuxt-link :to="'/sales/catalog'" class="nav-category">
                <span
                  class="link"
                  :class="{'nav-selected': isSelected('/sales/catalog')}"
                >
                  Акции
                </span>
              </nuxt-link>
            </div>
            <div
              class="nav-item"
              :class="{
                'nav-hover': isHover(category, activeCategories)
              }"
              @mouseover="openProductPanel(category)"
              @mouseout="closeProductPanel()"
              @click="closePernamentPanel()"
              v-response.small
              v-for="category in categories"
              :key="category.pk">

              <nuxt-link :to="`/catalog/${category.category.slug}`" class="nav-category">
                <span
                  class="link"
                  :class="{'nav-selected': isSelected(`/catalog/${category.category.slug}`)}"
                >
                  {{ category.category.name }}
                </span>
              </nuxt-link>
            </div>
          </div>
        
          <div ref="navmore" class="nav-more"
            @mouseover="openProductPanel(moreCategories)"
            @mouseout="closeProductPanel()"
          >
              <span
                class="link"
                :class="{'nav-selected': isMoreSelected()}"
              >
                И ещё •••
              </span>
          </div>
          <div class="flex"></div>
          <div class="nav-icons">
            <div class="nav-item nav-icon nav-search" v-response.small @click="openSearchPanel()">
                <div>
                    <div class="link"><dub-icon  width=24 height=24 class="icon-link"><icon-search/></dub-icon></div>
                </div>
            </div>
          </div>
        </div>
        <div class="search-panel" v-show="searchPanelActive">
          <div class="search-input">
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
          <dub-icon
            width=24
            height=24
            class="icon-link search-close"
            @click.native="closeSearchPanel()"
          >
            <icon-close/>
          </dub-icon>
          <div 
            @mouseout="autocompleteIndex = -1"
            v-show="autocompletePanelActive && searchAutocomplete.length > 0"
            class="search-autocomplete"
          >
            <div
              class="search-autocomplete-item"
              :class="{'search-autocomplete-item-selected': searchAutocomplete[autocompleteIndex] === autocompleteItem}"
              @mouseover="autocompleteIndex = index"
              @click="searchQuery = autocompleteItem"
              v-for="(autocompleteItem, index) in searchAutocomplete"
              :key="index">
              {{ autocompleteItem }}
            </div>
          </div>
        </div>
        
      </div>
      <dub-header-panel
        @mouseover.native="openProductPanel(activeCategories)"
        @mouseout.native="closeProductPanel()"
        @close-panel="navActive = false"
        v-show="navActive"
        :category="activeCategories"
      ></dub-header-panel>
    </div>
    <div v-show="searchPanelActive || navActive" @click="closeSearchPanel()" class="overlay"></div>
  </div>
</template>

<script>
import DubHeaderPanel from '@/components/base/DubHeaderPanel';
import PreventScrollMixin from '@/mixins/prevent-scroll';
import _ from 'lodash';

export default {
  name: 'DubHeader',
  components: {
    DubHeaderPanel,
  },
  mixins: [PreventScrollMixin],
  data: () => ({
    navActive: false,
    guestPanelActive: false,
    selfGuestPanelActive: false,
    activeCategories: [],
    closePermanent: false,
    navFixed: false,
    navVisible: false,
    navBottomOffcet: 175,
    navTopOffcet: 52,
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
  },
  watch: {
    searchQuery: {
      handler(val) {
        if (val.length > 2) {
          this.debounceAutocomplete();
        }
      },
    },
  },
  mounted() {
    const hideCategoriesIndex = [];
    this.navWidth = this.$refs.nav.clientWidth;
    window.addEventListener('scroll', this.scrollHandler);
    Array.from(this.$refs.nav.children).reduce((acc, value, index) => {
      const newAcc = acc + value.clientWidth;
      if (newAcc > this.navWidth) {
        hideCategoriesIndex.push(index);
        value.classList.add('nav-category-hide');
        return newAcc;
      }
      return newAcc;
    }, 0);
    if (hideCategoriesIndex.length > 0) {
      const allCategories = Object.assign([], this.categories);
      const [hideFrom] = hideCategoriesIndex;
      this.moreCategories = allCategories.splice(hideFrom);
    } else {
      this.$refs.navmore.classList.add('nav-category-hide');
    }
    this.$refs.nav.classList.remove('nav-categories-hide');
    // reduce sum children width < panel width rest set display none and get last visible index
    this.debounceAutocomplete = _.debounce(this.requestAutocomplete, 500);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler);
  },
  methods: {
    openProductPanel(category) {
      if (this.closePermanent) {
        return;
      }
      this.activeCategories = category;
      this.navActive = true;
      this.preventScroll(true);
    },
    closeProductPanel() {
      this.closePermanent = false;
      this.navActive = false;
      this.preventScroll(false);
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
      this.closeProductPanel();
      this.closePermanent = true;
    },
    isHover(category, activeCategory) {
      return this.navActive && category.slug === activeCategory.slug;
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
  display: block;
  background-color: #fafafa;
  position: relative;
  z-index: 9999;
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
  position: relative;
  z-index: 3;
  background-color: #fafafa;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  line-height: 24px;
  font-weight: 700;
  border-top: 1px solid #e6e3da;
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
  .nav-active {
    box-shadow: 0 6px 4px -4px rgba(0, 0, 0, 0.1);
  }
}
.nav-panel {
  height: 100%;
  width: 100%;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
.search-panel {
  width: 100%;
  position: relative;
  height: 100%;
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
  background-color: #fafafa;
  z-index: 3;
  position: relative;
}
.header-info {
  width: 80%;
  margin: 0 auto;
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
  color: $primary_color !important;
}
.nav-hover {
  padding-bottom: 0;
  border-bottom: 3px solid $primary_color;
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
}
.search-input input {
  border: 0;
  width: 100%;
  font-size: 20px;
  position: absolute;
  height: auto;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  margin: 12px 0;
  background: transparent;
  color: #252525;
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
  top: 60px;
  width: 100%;
}
.search-autocomplete-item {
  padding: 8px;
  cursor: pointer;
}
.search-autocomplete-item-selected {
  background-color: #e6e3da;
}
.overlay {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
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
    width: 90%;
  }
  .header-nav {
    .nav {
      width: 90%;
    }
  }
}
</style>
