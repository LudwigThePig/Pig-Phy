import app from './server/app';

const port = process.env.PORT || 3000;

app.listen(port, err => {
  if (err) return console.error(err);
  console.log(`Server listening on port ${port}`);
});