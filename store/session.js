const modules = {
  cart: {
    namespaced: true,
    actions: {
      async get() {
        const { data } = await this.$api.get('/session/carts/');
        return data.length !== 0 ? data : [];
      },
      set(context, data) {
        this.$api.post('/session/carts/', { data });
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
      async requestProducts({ commit }) {
        const { data } = await this.$api.get('/session/watched/');
        if (data.length !== 0) {
          commit('addWatchedProducts', data);
        }
      },
      async addProduct({ commit, getters }, product) {
        commit('addWatchedProducts', product);

        await this.$api.post('/session/watched/', { data: getters.products });
      },
      async addProducts({ commit, getters }, products) {
        commit('addWatchedProducts', products);
        await this.$api.post('/session/watched/', { data: getters.products });
      },
      reset({ commit }) {
        commit('resetWatchedProducts');
      },
    },
    mutations: {
      resetWatchedProducts(state) {
        state.products = [];
      },
      addWatchedProducts(state, products) {
        const arrayProducts = Array.isArray(products) ? products : [products];
        if (state.products.length === 0) {
          state.products = arrayProducts;
          return;
        }
        arrayProducts.forEach(product => {
          const index = state.products.findIndex(
            row => row.pk.toString() === product.pk.toString()
          );
          if (index >= 0) {
            state.products.splice(index, 1);
          }
          state.products.unshift(product);
        });
      },
    },
  },
};

export default {
  modules,
};
