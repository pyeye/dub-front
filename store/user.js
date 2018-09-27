import cookie from 'cookie';

const actions = {
  async init({ dispatch }, { req, res }) {
    const parsedCookie = cookie.parse(req.headers.cookie || '');
    const guestToken = parsedCookie['guest-token'] || '';
    if (guestToken) {
      this.$api.setGuestToken(guestToken);
      await dispatch('session/watched/requestProducts');
    } else {
      const { data } = await this.$api.post('auth/guest/');
      res.setHeader('Set-Cookie', [`guest-token=${data}`]);
      this.$api.setGuestToken(data);
    }
  },
};

export default {
  actions,
};
