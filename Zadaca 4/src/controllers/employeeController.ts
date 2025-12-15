import { Request, Response } from 'express';
import type { Employee } from '../models/employee';
import { employees } from '../models/employee';
import * as fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/zaposlenici.json');

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sortiraj_po_godinama, pozicija, godine_staža_min, godine_staža_max } = req.query;
    let filteredEmployees = [...employees];

    if (pozicija && typeof pozicija === 'string') {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.pozicija.toLowerCase() === pozicija.toLowerCase(),
      );
    }

    if (godine_staža_min !== undefined) {
      const minYears = parseInt(godine_staža_min as string, 10);
      if (!isNaN(minYears)) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.godine_staža >= minYears,
        );
      }
    }

    if (godine_staža_max !== undefined) {
      const maxYears = parseInt(godine_staža_max as string, 10);
      if (!isNaN(maxYears)) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.godine_staža <= maxYears,
        );
      }
    }

    if (sortiraj_po_godinama) {
      const direction = sortiraj_po_godinama === 'uzlazno' ? 1 : -1;
      filteredEmployees.sort(
        (a, b) => (a.godine_staža - b.godine_staža) * direction,
      );
    }

    if (filteredEmployees.length === 0) {
      res.status(404).json({ error: 'Zaposlenici nisu pronađeni' });
      return;
    }

    res.json(filteredEmployees);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dohvaćanju zaposlenika' });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = employees.find((emp) => emp.id === parseInt(id as string, 10));

    if (!employee) {
      res.status(404).json({ error: 'Zaposlenik nije pronađen' });
      return;
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dohvaćanju zaposlenika' });
  }
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ime, prezime, godine_staža, pozicija } = req.body;

    const newId = employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee: Employee = { id: newId, ime, prezime, godine_staža, pozicija };

    employees.push(newEmployee);

    await fs.writeFile(DATA_FILE, JSON.stringify(employees, null, 2));

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri dodavanju zaposlenika' });
  }
};