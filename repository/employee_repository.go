package repository

import (
	"database/sql"

	"backenedprojectphase2/models"
)

type EmployeeRepository struct {
	db *sql.DB
}

func NewEmployeeRepository(db *sql.DB) *EmployeeRepository {
	return &EmployeeRepository{
		db: db,
	}
}

func (r *EmployeeRepository) GetAllEmployees() ([]models.Employee, error) {

	rows, err := r.db.Query(`
		SELECT id, name, age, mail
		FROM employees
	`)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var employees []models.Employee

	for rows.Next() {

		var employee models.Employee

		err := rows.Scan(
			&employee.ID,
			&employee.Name,
			&employee.Age,
			&employee.Email,
		)

		if err != nil {
			return nil, err
		}

		employees = append(employees, employee)
	}

	return employees, nil
}

func (r *EmployeeRepository) GetEmployeeByID(id int) (models.Employee, error) {

	var employee models.Employee

	err := r.db.QueryRow(`
		SELECT id, name, age, mail
		FROM employees
		WHERE id = $1
	`, id).Scan(
		&employee.ID,
		&employee.Name,
		&employee.Age,
		&employee.Email,
	)

	if err != nil {
		return models.Employee{}, err
	}

	return employee, nil
}

func (r *EmployeeRepository) CreateEmployee(employee models.Employee) error {

	_, err := r.db.Exec(`
		INSERT INTO employees (name, age, mail)
		VALUES ($1, $2, $3)
	`,
		employee.Name,
		employee.Age,
		employee.Email,
	)

	return err
}

func (r *EmployeeRepository) UpdateEmployee(employee models.Employee) error {

	_, err := r.db.Exec(`
		UPDATE employees
		SET name = $1, age = $2, mail = $3
		WHERE id = $4
	`,
		employee.Name,
		employee.Age,
		employee.Email,
		employee.ID,
	)

	return err
}

func (r *EmployeeRepository) DeleteEmployee(id int) error {

	_, err := r.db.Exec(`
		DELETE FROM employees
		WHERE id = $1
	`, id)

	return err
}
