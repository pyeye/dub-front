import Vue from 'vue';

const state = () => ({
  products: {},
  categories: [],
  tags: {},
});

const getters = {
  products: state => category => state.products[category] || null,
  product: (state, getters) => (category, id) => {
    const products = getters.products(category);
    let product;
    try {
      product = products.find(item => item.pk.toString() === id);
    } catch (e) {
      product = null;
    }
    // if products selected category empty return none
    return product;
  },
  categories: state => state.categories,
  category: (state, getters) => code =>
    getters.categories.find(category => category.code === code),
  tags: state => category => state.tags[category] || null,
};
const actions = {
  async requestProducts({ commit }, category) {
    const { data } = await this.$api.get('products/', {
      params: {
        category,
      },
    });
    commit('setProducts', {
      products: data,
      category,
    });
  },
  async requestCategories({ commit }) {
    const { data } = await this.$api.get('category/');
    commit('setCategories', data);
  },
  async requestTags({ commit }, category) {
    const { data } = await this.$api.get(`tags/${category}/`);
    commit('setProductTags', {
      tags: data,
      category,
    });
  },
};
const mutations = {
  setProducts(state, { products, category }) {
    Vue.set(state.products, category, products);
  },
  setProductTags(state, { tags, category }) {
    Vue.set(state.tags, category, tags);
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
