import app from './app';
import config from './config/config';
import { loadEmployees } from './models/employee';

(async () => {
  try {
    await loadEmployees();
    console.log('Employees loaded successfully');

    app.listen(config.port, () => {
      console.log(`Server pokrenut na http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Došlo je do greške na serveru:', error);
    process.exit(1);
  }
})();