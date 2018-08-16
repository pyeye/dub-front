import request from '../../request/index';

const store = {
  namespaced: true,
  state: {
    news: [],
    newsCategories: [],
  },
  getters: {
    list: state => state.news,
    detail(state, getters) {
      return (id) => {
        const news = getters.getNews;
        try {
          return news.find(item => item.pk.toString() === id);
        } catch (e) {
          return null;
        }
      };
    },
    categories: state => state.newsCategories,
  },
  actions: {
    requestNews(context) {
      return new Promise((resolve, reject) => {
        request.get('/news/')
        .then((response) => {
          const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          };
          const news = response.data.map((article) => {
            const formatedArticle = article;
            let date = new Date(formatedArticle.updated_at);
            date = date.toLocaleString('ru', options).split(/ |,|\./g);
            formatedArticle.date = {
              weekday: date[0],
              year: date[4],
              day: date[2],
              month: date[3],
            };
            return formatedArticle;
          });
          context.commit('setNews', news);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
      });
    },
    requestCategories(context) {
      return new Promise((resolve) => {
        request.get('/news/categories/').then((response) => {
          context.commit('setNewsCategories', response.data);
          resolve();
        });
      });
    },
  },
  mutations: {
    setNews(state, news) {
      state.news = news;
    },
    setNewsCategories(state, categories) {
      state.newsCategories = categories;
    },
  },
};

export default store;
