<template>
  <div class="news-wrapper">
    <div class="header">
      <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="title">Новости</div>
    </div>
    <div class="filters">
      <div class="filter-menu">
        <div class="filter-description">Категории:</div>
        <div
          class="filter-item pointer"
          :class="{ 'filter-active': filterBy == 'all' }"
          @click="setFilter('all')"
        >
          Все
        </div>
        <div
          class="filter-item pointer"
          v-for="category in categories"
          :key="category.pk"
          :class="{ 'filter-active': filterBy == category.pk }"
          @click="setFilter(category.pk)"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
    <div class="grid-wrapper">
      <news-item v-for="article in filteredNews" :key="article.pk" :article="article"></news-item>
    </div>
  </div>
<!--
  <div class="news-list">
    <div class="header">
      <div class="title-row">
        <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
        <div class="title">Новости</div>
      </div>
    </div>

    <div class="news-header">
      <div class="filter-menu">
        <div class="filter-description">Категории:</div>
        <div
          class="filter-item pointer"
          :class="{ 'filter-active': filterBy == 'all' }"
          @click="setFilter('all')"
        >
          Все
        </div>
        <div
          class="filter-item pointer"
          v-for="category in categories"
          :key="category.pk"
          :class="{ 'filter-active': filterBy == category.pk }"
          @click="setFilter(category.pk)"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

      <div class="grid" >
        <news-item class="grid-cell" v-for="article in filteredNews" :key="article.pk" :article="article"></news-item>
      </div>
  </div>
  -->
</template>

<script>
import NewsItem from '~/components/news/NewsItem';

export default {
  name: 'NewsList',
  components: {
    NewsItem,
  },
  data: () => ({
    filterBy: 'all',
    breadcrumbs: [{ label: 'Главная', link: '/' }, { label: 'Новости', link: '' }],
  }),
  computed: {
    filteredNews() {
      return this.filterBy === 'all'
        ? this.news
        : this.news.filter(article => article.category.pk === this.filterBy);
    },
  },
  async asyncData(context) {
    const { app } = context;
    const [news, categories] = await Promise.all([
      app.$api.get('/news/'),
      app.$api.get('/news/categories/'),
    ]);
    return {
      news: news.data,
      categories: categories.data,
    };
  },
  methods: {
    setFilter(filter) {
      this.filterBy = filter;
      this.$router.push({
        query: Object.assign({}, this.$route.query, { filter }),
      });
    },
  },
  created() {
    this.filterBy = this.$route.query.filter || 'all';
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.news-wrapper {
  display: grid;
  grid-template-columns:
    [full-start] minmax(16px, 1fr) [main-start] repeat(16, [col-start] minmax(8px, 100px))
    [main-end] minmax(16px, 1fr) [full-end];
  grid-column-gap: 24px;
  grid-template-rows: repeat(3, auto);
  align-items: start;
}
.header {
  grid-column: main-start / main-end;
  grid-row: 1;
  .breadcrumbs {
    margin: 8px 0;
  }
  .title {
    margin-top: 96px;
    margin-bottom: 8px;
    font-size: 64px;
    font-weight: 300;
    line-height: 64px;
    letter-spacing: 0px;
    font-family: $accent_font;
    color: $text_color;
  }
}

.filters {
  grid-column: main-start / main-end;
  grid-row: 2;
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
      justify-content: flex-end,
    ),
    webkit ms
  );
}
.grid-wrapper {
  grid-column: main-start / main-end;
  grid-row: 3;
  display: grid;
  grid-template-columns: repeat(16, [col-start] 1fr);
  grid-gap: 16px;
  padding: 24px 0;
}
.grid-wrapper > div:not(.first) {
  grid-column-start: auto;
}
.grid-wrapper > div {
  grid-column: col-start 1 / span 4;
  height: 350px;
}
.filter-menu {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  .filter-description {
    color: $text_color;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.16px;
    margin-right: 16px;
  }
  .filter-item {
    color: $text_color;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.16px;
    margin-right: 8px;
    cursor: pointer;
  }
  .filter-active {
    border-bottom: 2px solid $text_color;
  }
}
</style>
