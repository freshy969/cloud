const { parse } = require('url');
const got = require('got');
const cors = require('micro-cors')();
const { send, createError } = require('micro');

module.exports = cors(async (req, res) => {
  try {
    const url = parse(req.url.replace('/', ''));
    if (!url.protocol) throw new Error(`Invalid url: ${url.href}`);
    const data = await got(url, {
      headers: {
        'User-Agent': req.headers['user-agent'],
        Host: url.host,
      },
    });
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=180, stale-while-revalidate=31536000, stale-if-error=31536000',
    );
    send(res, 200, JSON.parse(data.body));
  } catch (error) {
    throw createError(500, error);
  }
});