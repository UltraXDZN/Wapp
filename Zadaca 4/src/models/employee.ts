import * as fs from 'fs/promises';
import path from 'path';

export interface Employee {
  id: number;
  ime: string;
  prezime: string;
  godine_staža: number;
  pozicija: string;
}

const DATA_FILE = path.join(__dirname, '../../data/zaposlenici.json');

export let employees: Employee[] = [];

export const loadEmployees = async (): Promise<void> => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    employees = JSON.parse(data);
    console.log(`Učitano ${employees.length} zaposlenika iz ${DATA_FILE}`);
  } catch (error) {
    console.error('Greška pri učitavanju zaposlenika:', error);
    employees = [];
  }
};