const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('products/requestCategories');
  },
};

export default {
  actions,
};
