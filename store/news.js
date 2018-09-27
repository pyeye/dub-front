const state = () => ({
  news: [],
  categories: [],
});

const getters = {
  news: state => state.news,
  article: (state, getters) => id => {
    const { news } = getters;
    try {
      return news.find(item => item.pk.toString() === id);
    } catch (e) {
      return null;
    }
  },
  categories: state => state.categories,
};

const actions = {
  async requestNews({ commit }) {
    const { data } = await this.$api.get('news/');
    commit('setNews', data);
  },
  async requestCategories({ commit }) {
    const { data } = await this.$api.get('news/categories/');
    commit('setCategories', data);
  },
};

const mutations = {
  setNews(state, news) {
    state.news = news;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
