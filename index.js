'use strict';
const http = require('http');
const pug = require('pug');

const write = (req, res, ...data) => {
  res.write(
    pug.renderFile('./form.pug', {
      path: req.url,
      firstItem: data[0],
      secondItem: data[1],
    })
  );
};

const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    switch (req.method) {
      case 'GET':
        const firstItems = {
          yakiniku: '焼き肉',
          rice: 'ごはん',
          sushi: '寿司',
        };
        const secondItems = {
          shabu: 'しゃぶしゃぶ',
          bread: 'パン',
          pizza: 'ピザ',
        };

        if (req.url === '/') {
          res.write(`<!DOCTYPE html>
          <html lang="ja"><body>
          <h1>アンケートフォーム</h1>
          <a href="/enquetes">アンケート一覧</a>
          </body></html>`);
        } else if (req.url === '/enquetes') {
          res.write(`<!DOCTYPE html>
          <html lang="ja"><body>
          <h1>アンケート一覧</h1><ul>
          <li><a href="/enquetes/yaki-shabu">焼き肉・しゃぶしゃぶ</a></li>
          <li><a href="/enquetes/rice-bread">ごはん・パン</a></li>
          <li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>
          </ul></body></html>`);
        } else if (req.url === '/enquetes/yaki-shabu') {
          write(req, res, firstItems.yakiniku, secondItems.shabu);
        } else if (req.url === '/enquetes/rice-bread') {
          write(req, res, firstItems.rice, secondItems.bread);
        } else if (req.url === '/enquetes/sushi-pizza') {
          write(req, res, firstItems.sushi, secondItems.pizza);
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';

        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            const html = `<!DOCTYPE html>
            <html lang="ja">
            <body><h1>${body}</h1></body>
            </html>`;
            console.info(`${body}`);
            res.write(html);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`Client Error`, e);
  });
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.info(`Listening on port:${port}`);
});
