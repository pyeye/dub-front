import request from '../../request/index';

const store = {
  namespaced: true,
  state: {
    products: [],
  },
  getters: {
    products: state => state.products,
    getTotalPrice(state) {
      let price = 0;
      price = state.products.reduce((total, cart) => total + (cart.price.value * cart.quantity), 0);
      return price;
    },
  },
  actions: {
    addProduct(context, product) {
      context.commit('addToCart', product);
      context.dispatch('session/cart/set', context.getters.products, { root: true });
    },
    addProducts(context, payload) {
      payload.forEach((cart) => {
        context.commit('addToCart', cart);
      });
      context.dispatch('session/cart/set', context.getters.products, { root: true });
    },
    updateQuantity(context, payload) {
      context.commit('updateQuantity', payload);
      context.dispatch('session/cart/set', context.getters.products, { root: true });
    },
    checkout(context, order) {
      return new Promise((resolve) => {
        request.post('/orders/', order).then((response) => {
          context.dispatch('user/pushActiveOrders', response.data, { root: true });
          context.commit('resetCart');
          context.dispatch('session/cart/set', context.getters.products, { root: true });
          resolve();
        });
      });
    },
    deleteProduct(context, payload) {
      context.commit('cart/deleteProduct', payload);
      context.dispatch('session/cart/set', context.getters.products, { root: true });
    },
    set({ commit }, cart) {
      commit('setCart', cart);
    },
    reset({ commit }) {
      commit('resetCart');
    },
  },
  mutations: {
    addToCart(state, cart) {
      const record = state.products.find(p => p.price.pk === cart.price.pk);
      if (record) {
        record.quantity += cart.quantity;
      } else {
        state.products.push(cart);
      }
    },
    setCart(state, cart) {
      state.products = cart;
    },
    deleteProduct(state, { cartId }) {
      const cartIndex = state.products.findIndex(cart => cart.price.pk === cartId);
      state.products.splice(cartIndex, 1);
    },
    updateQuantity(state, { cartId, quantity }) {
      const record = state.products.find(p => p.price.pk === cartId);
      if (record) {
        record.quantity = quantity;
      }
    },
    resetCart(state) {
      state.products = [];
    },
  },
};

export default store;
