import cookie from 'cookie';
import clientCookie from 'js-cookie';

const getTokenFromServer = async (app, req, res) => {
  const parsedCookie = cookie.parse(req.headers.cookie || '');
  let guestToken = parsedCookie['auth-token'] || '';
  if (!guestToken) {
    const { data } = await app.$api.post('auth/guest/');
    res.setHeader('Set-Cookie', [`auth-token=${data}`]);
    guestToken = data;
  }
  return guestToken;
};

export default async ({ app, req, res }) => {
  const token = process.server
    ? await getTokenFromServer(app, req, res)
    : clientCookie.get('auth-token');

  app.$api.setGuestToken(token);
};
