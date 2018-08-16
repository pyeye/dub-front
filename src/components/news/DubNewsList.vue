<template>
  <div class="news-list">
    <dub-breadcrumbs :breadcrumbs="breadcrumbs"></dub-breadcrumbs>
      <div class="news-header">
        <div class="title">Новости</div>
        <div class="filter-menu">
          <div class="filter-description">Категории:</div>
          <div class="filter-item pointer" :class="{ 'filter-active': filterBy == 'all' }" @click="setFilter('all')">все</div>
          <div class="filter-item pointer" v-for="category in categories" :key="category.code" :class="{ 'filter-active': filterBy == category.code }" @click="setFilter(category.code)">
            {{ category.name }}
          </div>
        </div>
      </div>
      
      <div class="grid" > 
        <dub-news-list-item class="grid-cell" v-for="article in filteredNews" :key="article.pk" :article="article"></dub-news-list-item>
      </div>
  </div>
</template>

<script>
import DubNewsListItem from '@/components/news/DubNewsListItem';

export default {
  name: 'DubNewsList',
  components: {
    DubNewsListItem,
  },
  data: () => ({
    filterBy: 'all',
    breadcrumbs: [
      { label: 'Главная', link: '/' },
      { label: 'Новости', link: '' },
    ],
  }),
  computed: {
    news() {
      const news = this.$store.getters['news/list'];

      if (news.length === 0) {
        this.$store.dispatch('news/requestNews');
      }

      return news;
    },
    categories() {
      const categories = this.$store.getters['news/categories'];

      if (categories.length === 0) {
        this.$store.dispatch('news/requestCategories');
      }

      return categories;
    },
    filteredNews() {
      return this.filterBy === 'all' ?
        this.news :
        this.news.filter(article => article.category.code === this.filterBy);
    },
  },
  methods: {
    setFilter(filter) {
      this.filterBy = filter;
      this.$router.push({ query: Object.assign({}, this.$route.query, { filter }) });
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

.news-header {
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: flex-end,
    ), webkit ms);
    margin: 24px 0 ;

  .title {
    @include prefix((
      flex: 1,
    ), webkit ms);

   
    font-size: 38px;
    font-weight: 600;
    letter-spacing: .025em;
    line-height: 42px;
    font-family: 'Roboto', sans-serif;
  }

  .filter-menu {
    @include prefix((
      display: flex,
      flex-direction: row,
    ), webkit ms);

    .filter-description {
      color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    margin-right: 16px;
    }

    .filter-item {
      color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
    margin-right: 8px;
    }

     .filter-active {
        border-bottom: 3px solid $primary_color;
        opacity: 1;
      }

  .pointer {
    cursor: pointer;
  }

  .pointer:hover {
    border-bottom: 3px solid $primary_color;
  }

  }
}

@supports(display: grid) {

  .grid {
    @include prefix((
      display: grid,
      grid-template-columns: 1fr 1fr 1fr 1fr,
      grid-gap: 8px,
    ), webkit ms);

    margin: 0 0 32px 0;
    width: 100%;
    

    .grid-cell {
      min-height: 300px;
      font-size: 22px;

      &:nth-child(1) {
         font-size: 28px;
         min-height: 416px;
        grid-column: 1/3;
        grid-row: 1/3;
        
      }

      &:nth-child(2) {
        font-size: 24px;
         min-height: 200px;
        grid-column: 3/5;
        
      }

      &:nth-child(3) {
         font-size: 24px;
         min-height: 200px;
        grid-column: 3/5;
        
      }
    }
  
  }

}

@supports not (display: grid) {
   .grid {
    @include prefix((
      display: flex,
      flex-wrap: wrap,
      flex-direction: row,
    ), webkit ms);

   
    width: 100%;
    margin: 0 0 32px 0;

    .grid-cell {
      width: 24%;
      margin-right: 8px;
      min-height: 300px;
      font-size: 22px;
    }
}

}

@media (max-width: 1450px) {
    
.news-list {
     width: 85%;
}
}

</style>