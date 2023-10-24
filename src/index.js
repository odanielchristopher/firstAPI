const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  console.log(parsedUrl.pathname);

  let { pathname } = parsedUrl;
  const splitEndpoint = pathname.split("/").filter(Boolean);
  let id = null;

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));

  if (route) {
    request.params = { id }; 
    request.query = Object.fromEntries(parsedUrl.searchParams);
    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type' : 'application/json' });
      response.end(JSON.stringify(body));
    }

    route.handler(request, response);
  } else {
    response.writeHead(404, { 'Content-Type' : 'text/html' });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));
