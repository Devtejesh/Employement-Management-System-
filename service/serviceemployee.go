package service

import (
	"fmt"
	"net/mail"
	"strings"

	"backenedprojectphase2/dto"
	"backenedprojectphase2/models"
	"backenedprojectphase2/repository"
	"backenedprojectphase2/utils"
)

type EmployeeService struct {
	repo *repository.EmployeeRepository
}

func NewEmployeeService(servicerepo *repository.EmployeeRepository) *EmployeeService {
	return &EmployeeService{
		repo: servicerepo,
	}
}

func (s *EmployeeService) GetAllEmployees() ([]dto.EmployeeResponse, error) {

	employees, err := s.repo.GetAllEmployees()

	if err != nil {
		return nil, err
	}

	var responses []dto.EmployeeResponse

	for _, employee := range employees {

		response := dto.EmployeeResponse{
			ID:    employee.ID,
			Name:  employee.Name,
			Age:   employee.Age,
			Email: employee.Email,
		}

		responses = append(responses, response)
	}

	return responses, nil
}

func (s *EmployeeService) GetEmployeeByID(id int) (dto.EmployeeResponse, error) {

	employee, err := s.repo.GetEmployeeByID(id)

	if err != nil {
		return dto.EmployeeResponse{}, err
	}

	return dto.EmployeeResponse{
		ID:    employee.ID,
		Name:  employee.Name,
		Age:   employee.Age,
		Email: employee.Email,
	}, nil
}

func (s *EmployeeService) CreateEmployee(request dto.CreateEmployeeRequest) error {

	err := validateEmployee(request.Name, request.Age, request.Email)

	if err != nil {
		return err
	}

	employee := models.Employee{
		Name:  request.Name,
		Age:   request.Age,
		Email: request.Email,
	}

	return s.repo.CreateEmployee(employee)
}

func (s *EmployeeService) UpdateEmployee(id int, request dto.UpdateEmployeeRequest) error {

	err := validateEmployee(request.Name, request.Age, request.Email)

	if err != nil {
		return err
	}

	employee := models.Employee{
		ID:    id,
		Name:  request.Name,
		Age:   request.Age,
		Email: request.Email,
	}

	return s.repo.UpdateEmployee(employee)
}

func (s *EmployeeService) DeleteEmployee(id int) error {

	return s.repo.DeleteEmployee(id)
}

func validateEmployee(name string, age int, email string) error {

	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("%w: name is required", utils.ErrInvalidEmployee)
	}

	if age < 18 || age > 100 {
		return fmt.Errorf("%w: age must be between 18 and 100", utils.ErrInvalidEmployee)
	}

	if strings.TrimSpace(email) == "" {
		return fmt.Errorf("%w: mail is required", utils.ErrInvalidEmployee)
	}

	_, err := mail.ParseAddress(email)
	if err != nil {
		return fmt.Errorf("%w: invalid email address", utils.ErrInvalidEmployee)
	}

	return nil
}
