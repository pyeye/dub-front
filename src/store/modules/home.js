import request from '../../request/index';

const store = {
  state: {
    banners: [],
    bestsellers: [],
    posters: [],
    newsFeed: [],
  },
  getters: {
    getBanners: state => state.banners,
    getBestsellers: state => state.bestsellers,
    getPosters: state => state.posters,
    getNewsFeed: state => state.newsFeed,
  },
  actions: {
    requestBanners(context) {
      request.get('/home/banners/').then(response => context.commit('setBanners', response.data));
    },
    requestBestsellers(context) {
      request.get('/home/bestsellers/').then(response => context.commit('setBestsellers', response.data));
    },
    requestPosters(context) {
      request.get('/home/posters/').then(response => context.commit('setPosters', response.data));
    },
    requestNewsFeed(context) {
      request.get('/home/news/').then((response) => {
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
        context.commit('setNewsFeed', news);
      });
    },
  },
  mutations: {
    setBanners(state, banners) {
      state.banners = banners;
    },
    setBestsellers(state, bestsellers) {
      state.bestsellers = bestsellers;
    },
    setPosters(state, posters) {
      state.posters = posters;
    },
    setNewsFeed(state, newsFeed) {
      state.newsFeed = newsFeed;
    },
  },
};

export default store;
