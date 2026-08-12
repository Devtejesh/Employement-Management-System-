package handlers

import (
	"net/http"
	"strconv"

	"backenedprojectphase2/dto"
	"backenedprojectphase2/service"

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
		c.JSON(http.StatusNotFound, gin.H{
			"error": "employee not found",
		})
		return
	}

	c.JSON(http.StatusOK, employee)
}

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
		return
	}

	err = h.service.UpdateEmployee(id, request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "employee updated successfully",
	})
}

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
