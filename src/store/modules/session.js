import request from '../../request/index';

const store = {
  namespaced: true,
  modules: {
    cart: {
      namespaced: true,
      actions: {
        get() {
          return new Promise((resolve) => {
            request.get('/session/carts/').then((response) => {
              if (response.data.length !== 0) {
                resolve(response.data);
              }
            });
          });
        },
        set(context, data) {
          request.post('/session/carts/', { data });
        },
      },
    },
    watched: {
      namespaced: true,
      state: {
        products: [],
      },
      getters: {
        products: state => state.products,
      },
      actions: {
        requestProducts({ commit }) {
          request.get('/session/watched/').then((response) => {
            if (response.data.length !== 0) {
              response.data.forEach((product) => {
                commit('addWatchedProduct', product);
              });
            }
          });
        },
        addProduct({ commit, getters }, data) {
          commit('addWatchedProduct', data);
          request.post('/session/watched/', { data: getters.products });
        },
        addProducts({ commit, getters }, products) {
          products.forEach((product) => {
            commit('addWatchedProduct', product);
          });
          request.post('/session/watched/', { data: getters.products });
        },
        reset({ commit }) {
          commit('resetWatchedProducts');
        },
      },
      mutations: {
        resetWatchedProducts(state) {
          state.products = [];
        },
        addWatchedProduct(state, product) {
          const index = state.products.findIndex(row => row.pk.toString() === product.pk.toString());
          if (index >= 0) {
            state.products.splice(index, 1);
          }
          state.products.unshift(product);
        },
      },
    },
  },
};

export default store;
