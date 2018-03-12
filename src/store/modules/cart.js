import request from '../../request/index';

const store = {
  state: {
    added: [],
  },
  getters: {
    cartProducts: state => state.added,
    getTotalPrice(state) {
      let price = 0;
      if (state.added.length > 0) {
        price = state.added.reduce((total, cart) => total + (cart.price.value * cart.quantity), 0);
      }
      return price;
    },
  },
  actions: {
    addToCart(context, product) {
      context.commit('addToCart', product);
      context.dispatch('setActiveCart');
    },
    addFromSaved(context, payload) {
      payload.forEach((cart) => {
        context.commit('addToCart', cart);
      });
      context.dispatch('setActiveCart');
    },
    updateQuantity(context, payload) {
      context.commit('updateQuantity', payload);
      context.dispatch('setActiveCart');
    },
    checkout(context, order) {
      return new Promise((resolve) => {
        request.post('/orders/', order).then((response) => {
          context.dispatch('pushUserActiveOrders', response.data);
          context.commit('resetCart');
          context.dispatch('setActiveCart');
          resolve();
        });
      });
    },
    deleteProductFromCart(context, payload) {
      context.commit('deleteProductFromCart', payload);
      context.dispatch('setActiveCart');
    },
    requestActiveCart(context) {
      const id = context.rootGetters.isAuthenticated ?
        context.rootGetters.getUser.id :
        context.rootGetters.getGuest.id;
      request.get('/carts/active/', {
        params: {
          user: id,
        },
      }).then((response) => {
        if (response.data.length !== 0) {
          context.commit('setCart', response.data);
        }
      });
    },
    deleteActiveCart(context, id) {
      const payload = {
        user: id,
        cart: [],
      };
      request.post('/carts/active/', payload);
    },
    setActiveCart(context) {
      const user = context.rootGetters.isAuthenticated ?
        context.rootGetters.getUser :
        context.rootGetters.getGuest;
      const payload = {
        user: user.id,
        cart: context.getters.cartProducts,
      };
      request.post('/carts/active/', payload);
    },
  },
  mutations: {
    addToCart(state, cart) {
      const record = state.added.find(p => p.price.pk === cart.price.pk);
      if (record) {
        record.quantity += cart.quantity;
      } else {
        state.added.push(cart);
      }
    },
    setCart(state, cart) {
      state.added = cart;
    },
    deleteProductFromCart(state, { cartId }) {
      const cartIndex = state.added.findIndex(cart => cart.price.pk === cartId);
      state.added.splice(cartIndex, 1);
    },
    updateQuantity(state, { cartId, quantity }) {
      const record = state.added.find(p => p.price.pk === cartId);
      if (record) {
        record.quantity = quantity;
      }
    },
    resetCart(state) {
      state.added = [];
    },
  },
};

export default store;
