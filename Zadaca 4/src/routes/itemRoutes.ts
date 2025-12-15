import { Router, Request, Response, NextFunction } from 'express';
import { getAllEmployees, getEmployeeById, createEmployee } from '../controllers/employeeController';

const router = Router();

const validateEmployee = (req: Request, res: Response, next: NextFunction): void => {
  const { ime, prezime, godine_staža, pozicija } = req.body;

  if (!ime || !prezime || godine_staža === undefined || !pozicija) {
    res.status(400).json({
      error: 'Svi podaci su obavezni (ime, prezime, godine_staža, pozicija)',
    });
    return;
  }

  if (typeof ime !== 'string' || ime.trim() === '') {
    res.status(400).json({ error: 'Ime mora biti neprazna stringovna vrijednost' });
    return;
  }

  if (typeof prezime !== 'string' || prezime.trim() === '') {
    res.status(400).json({ error: 'Prezime mora biti neprazna stringovna vrijednost' });
    return;
  }

  if (!Number.isInteger(godine_staža) || godine_staža < 0) {
    res.status(400).json({ error: 'Godine staža moraju biti nenegativan cijeli broj' });
    return;
  }

  if (typeof pozicija !== 'string' || pozicija.trim() === '') {
    res.status(400).json({ error: 'Pozicija mora biti neprazna stringovna vrijednost' });
    return;
  }

  next();
};

const validateEmployeeId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    res.status(400).json({ error: 'ID mora biti pozitivan broj' });
    return;
  }

  next();
};

router.get('/', getAllEmployees);
router.get('/:id', validateEmployeeId, getEmployeeById);
router.post('/', validateEmployee, createEmployee);

export default router;