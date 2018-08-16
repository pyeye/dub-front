import Vue from 'vue';
import request from '../../request/index';

const store = {
  namespaced: true,
  // state
  state: {
    products: {},
    categories: [],
    tags: {},
  },
  // getters
  getters: {
    products(state) {
      return category => state.products[category] || null;
    },
    product(state, getters) {
      return (category, id) => {
        const products = getters.products(category);
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
    categories: state => state.categories,
    category(state, getters) {
      return categoryCode => getters.categories.find(category => category.code === categoryCode);
    },
    tags(state) {
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
        const products = response.data;
        if (context.rootGetters['user/isAuthenticated']) {
          request.get('ratings/user/', {
            params: {
              category: payload.category,
            },
          }).then((responseRatings) => {
            const productsWithRatings = products.map((product) => {
              const tmpProduct = product;
              const record = responseRatings.data.find(rating => rating.product === tmpProduct.pk);
              if (record) {
                record.floatRating = parseFloat(record.rating);
                tmpProduct.rating = record;
              }
              return tmpProduct;
            });
            context.commit('setProducts', {
              items: productsWithRatings,
              category: payload.category,
            });
          });
        } else {
          context.commit('setProducts', {
            items: products,
            category: payload.category,
          });
        }
      });
    },
    requestCategories(context) {
      request.get('category/').then((response) => {
        context.commit('setCategories', response.data);
      });
    },
    requestTags(context, category) {
      request.get(`tags/${category}/`).then((response) => {
        context.commit('setProductTags', {
          category,
          items: response.data,
        });
      });
    },
    updateRating(context, payload) {
      context.commit('updateProductRating', payload);
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
    updateProductRating(state, { pk, category, rating }) {
      const record = state.products[category].find(product => product.pk === pk);
      if (record) {
        const stringRating = parseFloat(rating).toFixed(1);
        Vue.set(record.rating, 'rating', stringRating);
        Vue.set(record.rating, 'floatRating', rating);
      }
    },
  },
};


export default store;
