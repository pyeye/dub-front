const actions = {
  async nuxtServerInit({ dispatch }, { req, res }) {
    await Promise.all([
      dispatch('products/requestCategories'),
      dispatch('user/init', { req, res }),
    ]);
  },
};

export default {
  actions,
};
