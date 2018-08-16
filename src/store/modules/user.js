import request from '../../request/index';

const store = {
  namespaced: true,
  // state
  state: {
    user: {},
    orders: [],
    userCarts: [],
    userRatings: [],
  },
  // getters
  getters: {
    isAuthenticated: state => Object.keys(state.user).length !== 0,
    profile: state => state.user,
    carts: state => state.userCarts,
    ratings: state => state.userRatings,
    orders: state => state.orders.filter(order => order.status.code !== 'done'),
    doneOrders: state => state.orders.filter(order => order.status.code === 'done'),
  },
  // actions
  actions: {
    login({ dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        const application = JSON.parse(localStorage.getItem('auth-application')) || null;
        if (!application) {
          reject();
        }
        const data = `grant_type=password&username=${email}&password=${password}`;
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: application.id,
            password: application.secret,
          },
        };
        request.post('/auth/token/', data, config).then((response) => {
          const token = response.data.access_token;
          const tokenType = response.data.token_type;
          localStorage.removeItem('guest-token');
          localStorage.setItem('user-token', JSON.stringify(response.data));
          request.defaults.headers.common.Authorization = `${tokenType} ${token}`;
          dispatch('requestUser').then((user) => {
            resolve(user);
          });
        })
        .catch((err) => {
          localStorage.removeItem('user-token');
          reject(err);
        });
      });
    },
    register(context, payload) {
      // check promise chain
      return request.post('/customers/', payload).then(() => {
        context.dispatch('login', {
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
    requestGuestToken() {
      return new Promise((resolve) => {
        request.post('/auth/guest/').then((response) => {
          resolve(response.data);
        });
      });
    },
    logout(context) {
      localStorage.removeItem('user-token');
      delete request.defaults.headers.common.Authorization;
      context.commit('deleteUser');
      // create guest
      context.dispatch('requestGuestToken').then((responseToken) => {
        localStorage.setItem('guest-token', responseToken);
        request.defaults.headers.common.Authorization = `JWT ${responseToken}`;
      });
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
    update({ commit }, { userId, form }) {
      return new Promise((resolve) => {
        request.patch(`/customers/${userId}/`, form).then((response) => {
          commit('setUser', response.data);
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
    pushActiveOrders(context, payload) {
      if (context.getters.orders.length > 0) {
        context.commit('pushOrders', payload);
      }
    },
    pushUserCarts(context, payload) {
      if (context.getters.carts.length > 0) {
        context.commit('pushUserCarts', payload);
      }
    },
    requestCarts(context) {
      return new Promise((resolve) => {
        request.get('/carts/').then((response) => {
          context.commit('setUserCarts', response.data);
          resolve();
        });
      });
    },
    saveCart(context, cart) {
      return new Promise((resolve) => {
        request.post('/carts/', cart).then((response) => {
          context.dispatch('pushUserCarts', response.data);
          resolve(response.data);
        });
      });
    },
    requestRatings(context) {
      return new Promise((resolve) => {
        request.get('/ratings/').then((response) => {
          const ratings = response.data.map((rating) => {
            const formattedRating = rating;
            formattedRating.rating = parseFloat(formattedRating.rating);
            return formattedRating;
          });
          context.commit('setUserRatings', ratings);
          resolve();
        });
      });
    },
    updateRating(context, { pk, value }) {
      context.commit('updateUserRating', { pk, value });
    },
    saveRating(context, { pk, value }) {
      return new Promise((resolve) => {
        request.patch(`/ratings/${pk}/`, { rating: value }).then(() => {
          resolve();
        });
      });
    },
  },
  // mutations
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    deleteUser(state) {
      state.user = {};
      state.orders = [];
      state.userCarts = [];
      state.userRatings = [];
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
    setUserRatings(state, payload) {
      state.userRatings = payload;
    },
    updateUserRating(state, { pk, value }) {
      const record = state.userRatings.find(rating => rating.pk === pk);
      if (record) {
        record.rating = value;
      }
    },
  },
};


export default store;
