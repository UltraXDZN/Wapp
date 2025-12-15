import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import path from 'path';
import { employees, loadEmployees } from '../src/models/employee';
import type { Employee } from '../src/models/employee';

const TEST_DATA_FILE = path.join(__dirname, '../data/zaposlenici.json');

describe('Employee Model', () => {
  let originalEmployees: Employee[];

  beforeEach(async () => {
    await loadEmployees();
    originalEmployees = [...employees];
  });

  afterEach(async () => {
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify(originalEmployees, null, 2));
  });

  describe('loadEmployees', () => {
    it('učitaj sve zapooslenike iz JSON datoteke', async () => {
      await loadEmployees();
      expect(employees.length).toBeGreaterThan(0);
    });

    it('učitaj zaposlenike sa ispravnim atributima', async () => {
      await loadEmployees();
      employees.forEach((emp) => {
        expect(emp).toHaveProperty('id');
        expect(emp).toHaveProperty('ime');
        expect(emp).toHaveProperty('prezime');
        expect(emp).toHaveProperty('godine_staža');
        expect(emp).toHaveProperty('pozicija');
        
        expect(typeof emp.id).toBe('number');
        expect(typeof emp.ime).toBe('string');
        expect(typeof emp.prezime).toBe('string');
        expect(typeof emp.godine_staža).toBe('number');
        expect(typeof emp.pozicija).toBe('string');
      });
    });

    it('potrebno je učitati 5 ili više zaposlenika', async () => {
      await loadEmployees();
      expect(employees.length).toBeGreaterThanOrEqual(5);
    });

    it('treba sadržavati zaposlenika s id-em "1"', async () => {
      await loadEmployees();
      const employee = employees.find((e) => e.id === 1);
      expect(employee).toBeDefined();
      expect(employee?.ime).toBe('Pero');
      expect(employee?.prezime).toBe('Ždero');
    });
  });

  describe('Employee interface', () => {
    it('portrebno je imati sve atribute klase "Employee"', () => {
      const testEmployee: Employee = {
        id: 1,
        ime: 'Luka',
        prezime: 'Blašković',
        godine_staža: 5,
        pozicija: 'Dr.Sc. Profesor',
      };

      expect(testEmployee.id).toBe(1);
      expect(testEmployee.ime).toBe('Luka');
      expect(testEmployee.prezime).toBe('Blašković');
      expect(testEmployee.godine_staža).toBe(5);
      expect(testEmployee.pozicija).toBe('Dr.Sc. Profesor');
    });
  });
});