import axios from 'axios';

let isRefreshing = false;
const refreshSubscribers = [];
const request = axios.create({
  baseURL: 'http://api.houseofdubbel.tk/v1/',
});

function refreshAccessToken() {
  return new Promise((resolve) => {
    const application = JSON.parse(localStorage.getItem('auth-application')) || null;
    const oldToken = JSON.parse(localStorage.getItem('user-token')) || null;
    if (!oldToken || !application) {
      return false;
    }
    const data = `grant_type=refresh_token&refresh_token=${oldToken.refresh_token}`;
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
      localStorage.setItem('user-token', JSON.stringify(response.data));
      request.defaults.headers.common.Authorization = `${tokenType} ${token}`;
      resolve(token);
    });
  });
}

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

request.interceptors.response.use(response => response, (error) => {
  const { config, response: { status } } = error;
  const originalRequest = config;

  if (status === 498) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshAccessToken().then((newToken) => {
        isRefreshing = false;
        onRrefreshed(newToken);
      });
    }

    const retryOrigReq = new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        // replace the expired token and retry
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(axios(originalRequest));
      });
    });
    return retryOrigReq;
  }
  return Promise.reject(error);
});

export default request;
