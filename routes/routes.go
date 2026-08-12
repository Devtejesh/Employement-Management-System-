package routes

import (
	"backenedprojectphase2/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, employeeHandler *handlers.EmployeeHandler) {

	router.GET("/employees", employeeHandler.GetEmployees)
}
