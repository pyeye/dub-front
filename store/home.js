const state = () => ({
  posters: [],
  banners: [],
  news: [],
  bestsellers: [],
});

const getters = {
  posters: state => state.posters,
  banners: state => state.banners,
  news: state => state.news,
  bestsellers: state => state.bestsellers,
};

const actions = {
  async requestBanners({ commit }) {
    const { data } = await this.$api.get('/home/banners/');
    commit('setBanners', data);
  },
  async requestPosters({ commit }) {
    const { data } = await this.$api.get('/home/posters/');
    commit('setPosters', data);
  },
  async requestBestsellers({ commit }) {
    const { data } = await this.$api.get('/home/bestsellers/');
    commit('setBestsellers', data);
  },
  async requestNews({ commit }) {
    const { data } = await this.$api.get('/home/news/');
    // TODO format date on backend
    const news = data.map(article => {
      const formatedArticle = article;
      const date = new Date(formatedArticle.updated_at);
      const options = {
        day: 'numeric',
        month: 'long',
      };
      const [day, month] = date.toLocaleString('ru', options).split(/ |,|\./g);
      formatedArticle.date = {
        day,
        month,
      };
      return formatedArticle;
    });
    commit('setNews', news);
  },
};

const mutations = {
  setBanners(state, banners) {
    state.banners = banners;
  },
  setBestsellers(state, bestsellers) {
    state.bestsellers = bestsellers;
  },
  setPosters(state, posters) {
    state.posters = posters;
  },
  setNews(state, news) {
    state.news = news;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
