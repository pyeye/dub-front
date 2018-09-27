const state = () => ({
  products: [],
});

const getters = {
  products: state => state.products,
};

export default {
  state,
  getters,
};
