// server.js
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define custom API routes
  server.get('/api/example', (req, res) => {
    // Handle API request logic here
    res.json({ message: 'Hello from custom API route!' });
  });

  // Handle dynamic routing for admin-event/[id]
  server.get('app/admin-event/:id', (req, res) => {
    console.log('WE GOT THE REQ BABY BABY BABY');
    // Forward the request to the Next.js handler
    return app.render(req, res, '/admin-event/[id]', { id: req.params.id });
  });

  // Next.js request handler
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const port = process.env.PORT || 3001;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
