<template>
  <div class="dub-header">
    <div class="header-info-box">
      <div class="header-info">
        <div>
          <div class="help">
            <div class="help-link" v-response.small>
              <span class="link-item">Доставка</span>
            </div>
            <div class="help-link" v-response.small>
              <span class="link-item">Оплата</span>
            </div>
            <div class="help-link" v-response.small>
              <span class="link-item">Контакты</span>
            </div>
            <div class="help-link" v-response.small>
              <nuxt-link to="/news">
                <span class="link-item" :class="{'nav-selected': isSelected('/news')}">Новости</span>
              </nuxt-link>
            </div>
            <div class="help-link" v-response.small>
              <span class="link-item">О Магазине</span>
            </div>
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
      <div class="nav" :class="{'nav-active': panelActive }">
        <nuxt-link :to="'/'" class="nav-category">
          <img class="logo-text" src="~assets/images/house_of_dubbel.png">
        </nuxt-link>

        <div class="nav-panel"  v-show="searchPanelActive === false">
          <div class="nav-categories nav-categories-hide" ref="nav">
            <div class="nav-item" v-response.small>
              <nuxt-link :to="'/sales/catalog'" class="nav-category">
                <span class="link">
                  <span class="link-item" :class="{'nav-selected': isSelected('/sales/catalog')}">Акции</span>
                </span>
              </nuxt-link>
            </div>
            <div
              class="nav-item"
              @mouseenter="openProductPanel(category)"
              @mouseleave="closeProductPanel"
              @click="closePernamentPanel()"
              v-response.small
              v-for="category in categories"
              :key="category.category.pk"
            >
              <nuxt-link :to="`/catalog/${category.category.slug}`" class="nav-category">
                <span class="link">
                  <span
                    class="link-item"
                    :class="{
                      'link-item-hover': isHover(category),
                      'nav-selected': isSelected(`/catalog/${category.category.slug}`)
                    }"
                  >
                    {{ category.category.name }}
                  </span>
                </span>
              </nuxt-link>
            </div>
          </div>
        
          <div ref="navmore" class="nav-more"
            @mouseenter="openProductPanel(moreCategories[0])"
            @mouseleave="closeProductPanel"
          >
              <span class="link">
                <span
                  class="link-item"
                  :class="{
                    'nav-selected': isMoreSelected()
                  }"
                >
                  И ещё •••
                </span>
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

        <!-- Search Panel -->
        <div class="search-panel" :class="{'search-panel-active': searchPanelActive}">
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
            @mouseleave="autocompleteIndex = -1"
            v-show="autocompletePanelActive && searchAutocomplete.length > 0"
            class="search-autocomplete"
          >
            <div
              class="search-autocomplete-item"
              :class="{'search-autocomplete-item-selected': searchAutocomplete[autocompleteIndex] === autocompleteItem}"
              @mouseenter="autocompleteIndex = index"
              @click="searchQuery = autocompleteItem"
              v-for="(autocompleteItem, index) in searchAutocomplete"
              :key="index">
              {{ autocompleteItem }}
            </div>
          </div>
        </div>
        <!-- End Search Panel -->
        
      </div>

      <!-- Header Panel -->
     <transition name="slidepan">
        <div
        class="header-panel"
        v-show="panelActive"
        @mouseenter="selfActive = true"
        @mouseleave="closeSelf"
        >
          <div class="panel-content">
            <div class="content-categories">
              <dir class="product-name" @click="selfActive = false">
                <nuxt-link
                  :to="`/catalog/${activeCategory.category.slug}/${activeCategory.pk}`"
                  class="nav-category link"
                >
                  {{activeCategory.category.name}} {{activeCategory.name}}
                </nuxt-link>
              </dir>
                <nuxt-link
                  :to="`/catalog/${activeCategory.category.slug}/${activeCategory.pk}`"
                  class="nav-category link"
                >
                  <img class="image" :src="`http://api.mydubbelsite.ru/${productImage}`" @click="selfActive = false">
                </nuxt-link>
                <dub-button type="secondary" class="show-all">
                    <nuxt-link :to="`/catalog/${activeCategory.category.slug}`" class="nav-category">
                      <span class="button" @click="selfActive = false">показать все</span>
                    </nuxt-link>
                </dub-button>
            </div>
            <div class="content-meta">
                <div class="content-facets" v-for="facet in facets" :key="facet.slug">
                  <div class="collapse-title"> {{facet.name}} </div>
                  <div class="link-facet" v-for="item in facet.values.slice(0,8)" :key="item.pk">
                    <nuxt-link
                      :to="`/catalog/${activeCategory.category.slug}?sfacets=${facet.slug}:${item.pk}`"
                      class="nav-category-link"
                    >
                      <span class="facets-values" @click="facetLinkHandler">
                        {{item.name}}
                      </span>
                    </nuxt-link>
                  </div>
                </div>
            </div>
            <div class="more-categories" v-if="morePanelActive">
              <div
                class="more-category"
                v-for="moreCategory in moreCategories" 
                :key="moreCategory.category.slug"
                @mouseenter="activeCategory = moreCategory"
              >
              <nuxt-link :to="`/catalog/${moreCategory.category.slug}`" class="nav-category">
                    <span class="button" @click="facetLinkHandler">{{ moreCategory.category.name }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
     </transition>
      

     <!-- End Header Panel -->

    </div>
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
    navBottomOffcet: 175,
    navTopOffcet: 37,
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
      if (this.navFixed && this.scrollPositionY < this.navTopOffcet) {
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
    isHover(category) {
      return this.panelActive && category.category.slug === this.activeCategory.category.slug;
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
  font-family: $accent_font;
  line-height: 24px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
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
    width: 1500px;
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
  opacity: 0;
  display: none;
  transition: opacity 0.3s ease;
}
.search-panel-active {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  opacity: 1;
}
.header-info-box {
  width: 100%;
  background-color: #f5f5f5;
  z-index: 3;
  position: relative;
}
.header-info {
  width: 1500px;
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
  padding: 8px 0;
  margin-left: 8px;
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
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
  opacity: 0.7;
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
  width: 100%;
  font-size: 20px;
  padding: 8px 0 8px 8px;
  background: transparent;
  color: #252525;
  background-color: #eee;
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
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  top: -65px;
  transition: top 0.3s ease;
}
.is-fixed-visible {
  top: 0;
}
.fixed-dummy {
  height: 60px;
}

.header-panel {
  width: 1500px;
  position: absolute;
  left: 50%;
  top: 100%;
  margin-left: -750px;
  background-color: $upper_layer_color;
  border-radius: 0 0 3px 3px;
  z-index: -1;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  padding: 24px 0;
  opacity: 1;
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
@media (max-width: 1599px) {
  .header-info {
    width: 1250px;
  }
  .header-nav {
    .nav {
      width: 1250px;
    }
  }
  .header-panel {
    width: 1250px;
    margin-left: -625px;
  }
  .panel-content {
    height: 400px;
    .content-meta {
      width: 1000px;
    }
    .image {
      height: 230px;
    }
  }
}
@media (max-width: 1350px) {
  .header-info {
    width: 1150px;
  }
  .header-nav {
    .nav {
      width: 1150px;
    }
  }
  .header-panel {
    width: 1200px;
    margin-left: -600px;
  }
  .panel-content {
    height: 350px;
  }
}
</style>
