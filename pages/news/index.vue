<template>
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
.news-list {
  position: relative;
  flex: 1;
  width: 80%;
  margin: 0 auto;
}
.header {
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
.title-row {
  margin: 24px 0;
  width: 60%;
  position: relative;
  @include prefix(
    (
      display: flex,
      flex-direction: column,
      align-items: center,
      justify-content: center,
    ),
    webkit ms
  );
}
.title {
  margin: 14px 0;
  font-size: 36px;
  letter-spacing: 20px;
  margin-right: -20px;
  line-height: 24px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.sub-title {
  font-size: 14px;
  letter-spacing: 0.05em;
  line-height: 16px;
  font-family: 'Roboto', sans-serif;
  opacity: 0.7;
  color: $text_color;
  text-transform: uppercase;
}
.news-header {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      align-items: flex-end,
      justify-content: flex-end,
    ),
    webkit ms
  );
  margin: 24px 0;
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
      font-weight: 600;
      opacity: 0.7;
      letter-spacing: -0.012em;
      margin-right: 16px;
    }
    .filter-item {
      color: $text_color;
      font-size: 16px;
      font-weight: 600;
      opacity: 0.7;
      letter-spacing: -0.012em;
      margin-right: 8px;
      cursor: pointer;
    }
    .filter-active {
      border-bottom: 3px solid $primary_color;
      opacity: 1;
    }
  }
}
.grid {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
    ),
    webkit ms
  );
  width: 100%;
  .grid-cell {
    @include prefix(
      (
        flex: 1 1,
        flex-basis: 24%,
      ),
      webkit ms
    );
    max-width: 24%;
    height: 400px;
    margin: 0 8px 32px 8px;
    transition: box-shadow 0.25s ease;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    &:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
    }
  }
}
@media (max-width: 1450px) {
  .news-list {
    width: 90%;
  }
}
</style>
