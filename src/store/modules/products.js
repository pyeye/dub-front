import Vue from 'vue';
import request from '../../request/index';

const store = {
  // state
  state: {
    products: {},
    categories: [],
    tags: {},
  },
  // getters
  getters: {
    getProducts(state) {
      return category => state.products[category] || null;
    },
    getProduct(state, getters) {
      return (category, id) => {
        const products = getters.getProducts(category);
        let product;
        try {
          product = products.find(item => item.pk.toString() === id);
        } catch (e) {
          product = null;
        }
        // if products selected category empty return none
        return product;
      };
    },
    getCategories: state => state.categories,
    getCategory(state, getters) {
      return categoryCode => getters.getCategories.find(category => category.code === categoryCode);
    },
    getProductTags(state) {
      return category => state.tags[category] || null;
    },
  },
  // actions
  actions: {
    requestProducts(context, payload) {
      request.get('products/', {
        params: {
          category: payload.category,
        },
      }).then((response) => {
        context.commit('setProducts', {
          items: response.data,
          category: payload.category,
        });
      });
    },
    requestCategories(context) {
      request.get('category/').then((response) => {
        context.commit('setCategories', response.data);
      });
    },
    requestProductTags(context, category) {
      request.get(`tags/${category}/`).then((response) => {
        context.commit('setProductTags', {
          category,
          items: response.data,
        });
      });
    },
  },
  // mutations
  mutations: {
    setProducts(state, products) {
      Vue.set(state.products, products.category, products.items);
    },
    setProductTags(state, tags) {
      Vue.set(state.tags, tags.category, tags.items);
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
  },
};


export default store;
