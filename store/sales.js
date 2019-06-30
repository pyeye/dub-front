const state = () => ({
  sales: [],
  total: 0,
});

const getters = {
  sales: state => state.sales,
  total: state => state.total,
  sale: (state, getters) => id => {
    const { sales } = getters;
    try {
      return sales.find(item => item.pk.toString() === id);
    } catch (e) {
      return null;
    }
  },
};

const actions = {
  async requestSales({ commit }) {
    const { data } = await this.$api.get('sales/');
    commit('setSales', data.results);
    commit('setTotal', data.count);
  },
};

const mutations = {
  setSales(state, sales) {
    state.sales = sales;
  },
  setTotal(state, total) {
    state.total = total;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
