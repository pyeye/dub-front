import request from '../../request/index';

const store = {
  // state
  state: {
    userToken: localStorage.getItem('user-token') || '',
    user: {},
    orders: [],
    userCarts: [],
    guest: {},
  },
  // getters
  getters: {
    isAuthenticated: state => !!state.userToken,
    getUser: state => state.user,
    getUserToken: state => state.userToken,
    getUserCarts: state => state.userCarts,
    getGuest: state => state.guest,
    getActiveOrders: state => state.orders.filter(order => order.status.code !== 'done'),
    getDoneOrders: state => state.orders.filter(order => order.status.code === 'done'),
  },
  // actions
  actions: {
    loginUser(context, payload) {
      return new Promise((resolve, reject) => {
        request.post('/auth/', payload)
        .then((response) => {
          const token = response.data;
          localStorage.setItem('user-token', token);
          request.defaults.headers.common.Authorization = `JWT ${token}`;
          context.commit('setToken', token);
          context.dispatch('requestUser').then((user) => {
            resolve(user);
          });
        })
        .catch((err) => {
          localStorage.removeItem('user-token');
          reject(err);
        });
      });
    },
    registerUser(context, payload) {
      // check promise chain
      return request.post('/customers/', payload).then(() => {
        context.dispatch('loginUser', {
          email: payload.email,
          password: payload.password,
        });
      });
    },
    requestUser(context) {
      return new Promise((resolve) => {
        request.get('/auth/user/').then((response) => {
          context.commit('setUser', response.data);
          resolve(response.data);
        });
      });
    },
    logoutUser(context) {
      localStorage.removeItem('user-token');
      delete request.defaults.headers.common.Authorization;
      context.commit('deleteUser');
      // create guest
      const id = Math.random().toString(13).replace('0.', '');
      localStorage.setItem('guest-user', id);
      context.commit('setGuest', { id });
    },
    updatePass(context, payload) {
      return new Promise((resolve, reject) => {
        request.post('/customers/set_password/', payload).then(() => {
          resolve();
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    updateUser(context, payload) {
      return new Promise((resolve) => {
        request.patch(`/customers/${payload.userId}/`, payload.form).then((response) => {
          context.commit('setUser', response.data);
          resolve();
        });
      });
    },
    requestOrders(context) {
      return new Promise((resolve) => {
        request.get('/orders/').then((response) => {
          context.commit('setOrders', response.data);
          resolve();
        });
      });
    },
    pushUserActiveOrders(context, payload) {
      if (context.getters.getActiveOrders.length > 0) {
        context.commit('pushOrders', payload);
      }
    },
    pushUserCarts(context, payload) {
      if (context.getters.getUserCarts.length > 0) {
        context.commit('pushUserCarts', payload);
      }
    },
    requestUserCarts(context) {
      return new Promise((resolve) => {
        request.get('/carts/').then((response) => {
          context.commit('setUserCarts', response.data);
          resolve();
        });
      });
    },
    saveUserCart(context, cart) {
      return new Promise((resolve) => {
        request.post('/carts/', cart).then((response) => {
          this.$store.dispatch('pushUserCarts', response.data);
          resolve(response.data);
        });
      });
    },
    deleteGuest(context) {
      localStorage.removeItem('guest-user');
      context.commit('deleteGuest');
    },
  },
  // mutations
  mutations: {
    setToken(state, token) {
      state.userToken = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    deleteUser(state) {
      state.user = {};
      state.userToken = '';
      state.orders = [];
    },
    setOrders(state, payload) {
      state.orders = payload;
    },
    pushOrders(state, payload) {
      state.orders.unshift(payload);
    },
    pushUserCarts(state, payload) {
      state.userCarts.unshift(payload);
    },
    setUserCarts(state, payload) {
      state.userCarts = payload;
    },
    setGuest(state, guest) {
      state.guest = guest;
    },
    deleteGuest(state) {
      state.guest = {};
    },
  },
};


export default store;
