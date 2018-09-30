const actions = {
  async nuxtServerInit({ dispatch }) {
    await Promise.all([
      dispatch('products/requestCategories'),
      dispatch('session/watched/requestProducts'),
    ]);
  },
};

export default {
  actions,
};
