import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();


app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('public'));

app.get('/ping', (req, res) => {
  res.status(200);
  res.send('pong');
});


export default app;
