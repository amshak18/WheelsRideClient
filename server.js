const express = require('express');
const app = express();
const port = 4000;
const path = require('path');

app.get('*', function(req,res) {
  res.sendFile(path.resolve('dist/demo-app/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
