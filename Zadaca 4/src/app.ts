import express from 'express';
import employeeRoutes from './routes/employeeRoutes';

const app = express();

app.use(express.json());

app.use('/zaposlenici', employeeRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Greška na poslužitelju' });
});

export default app;