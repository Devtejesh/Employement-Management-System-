package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"backenedprojectphase2/dto"
	"backenedprojectphase2/service"
	"backenedprojectphase2/utils"

	"github.com/gin-gonic/gin"
)

type EmployeeHandler struct {
	service *service.EmployeeService
}

func NewEmployeeHandler(service *service.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{
		service: service,
	}
}

// GetAll godoc
// @Summary Get all employees
// @Description Returns all employees
// @Tags Employees
// @Produce json
// @Security BearerAuth
// @Success 200 {array} dto.EmployeeResponse
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /employees [get]
func (h *EmployeeHandler) GetEmployees(c *gin.Context) {

	employees, err := h.service.GetAllEmployees()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// @Summary Get employee by ID
// @Description Returns a single employee by ID
// @Tags Employees
// @Produce json
// @Security BearerAuth
// @Param id path int true "Employee ID"
// @Success 200 {object} dto.EmployeeResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /employees/{id} [get]

func (h *EmployeeHandler) GetEmployeeByID(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid employee ID",
		})
		return
	}

	employee, err := h.service.GetEmployeeByID(id)

	if err != nil {

		if errors.Is(err, utils.ErrEmployeeNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "employee not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// @Summary Create an employee
// @Description Creates a new employee. Admin access required.
// @Tags Employees
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body dto.CreateEmployeeRequest true "Employee details"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Router /employees [post]

func (h *EmployeeHandler) CreateEmployee(c *gin.Context) {

	var request dto.CreateEmployeeRequest

	err := c.ShouldBindJSON(&request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	err = h.service.CreateEmployee(request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "employee created successfully",
	})
}

// @Summary Update an employee
// @Description Updates an existing employee by ID. Admin access required.
// @Tags Employees
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Employee ID"
// @Param request body dto.UpdateEmployeeRequest true "Updated employee details"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Router /employees/{id} [put]
func (h *EmployeeHandler) UpdateEmployee(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid employee ID",
		})
		return
	}

	var request dto.UpdateEmployeeRequest

	err = c.ShouldBindJSON(&request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
	}

	err = h.service.UpdateEmployee(id, request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "employee updated successfully",
	})
}

// @Summary Delete an employee
// @Description Deletes an employee by ID. Admin access required.
// @Tags Employees
// @Produce json
// @Security BearerAuth
// @Param id path int true "Employee ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /employees/{id} [delete]
func (h *EmployeeHandler) DeleteEmployee(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid employee ID",
		})
		return
	}

	err = h.service.DeleteEmployee(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "employee deleted successfully",
	})
}
