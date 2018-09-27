import axios from 'axios';

export default (ctx, inject) => {
  const axiosExtra = {
    setHeader(name, value, scope = 'common') {
      this.defaults.headers[scope][name] = value;
    },
    setGuestToken(token) {
      const value = `JWT ${token}`;
      this.setHeader('Authorization', value);
    },
  };

  const api = axios.create({
    baseURL: 'http://api.mydubbelsite.ru/v1/',
  });

  Object.keys(axiosExtra).forEach(key => {
    api[key] = axiosExtra[key].bind(api);
  });

  inject('api', api);
};
