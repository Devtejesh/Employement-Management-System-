package routes

import (
	"backenedprojectphase2/handlers"
	"backenedprojectphase2/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, employeeHandler *handlers.EmployeeHandler, authHandler *handlers.AuthHandler, JWTSecret string) {

	router.POST("/register", authHandler.Register)
	router.POST("login", authHandler.Login)

	// router.GET("/employees", employeeHandler.GetEmployees)
	// router.GET(
	// 	"/employees",
	// 	middleware.AuthMiddleware(JWTSecret),
	// 	employeeHandler.GetEmployees,
	// )

	protected := router.Group("/employees")
	protected.Use(middleware.AuthMiddleware(JWTSecret))
	protected.GET("/:id", employeeHandler.GetEmployeeByID)
	protected.GET("", employeeHandler.GetEmployees)

	protected.POST("",
		middleware.RequiredRole("admin"),
		employeeHandler.CreateEmployee)

	protected.PUT("/:id", middleware.RequiredRole("admin"), employeeHandler.UpdateEmployee)
	protected.DELETE("/:id",
		middleware.RequiredRole("admin"),
		employeeHandler.DeleteEmployee)
}
