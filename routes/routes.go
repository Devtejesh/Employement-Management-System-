package routes

import (
	"backenedprojectphase2/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, employeeHandler *handlers.EmployeeHandler, authHandler *handlers.AuthHandler) {

	router.POST("/register", authHandler.Register)

	router.GET("/employees", employeeHandler.GetEmployees)
}
