package main

import (
	"backenedprojectphase2/configs"
	"backenedprojectphase2/database"
	"backenedprojectphase2/handlers"
	"backenedprojectphase2/middleware"
	"backenedprojectphase2/repository"
	"backenedprojectphase2/routes"
	"backenedprojectphase2/service"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {

	// 1. Load configuration
	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	// 2. Connect to PostgreSQL
	db, err := database.ConnectDB(config)
	if err != nil {
		log.Fatal(err)
	}

	employeeRepo := repository.NewEmployeeRepository(db)

	//  Creating Service Repository
	employeeService := service.NewEmployeeService(employeeRepo)

	// creating Handler
	employeeHandler := handlers.NewEmployeeHandler(employeeService)
	userRepo := repository.NewUserRepository(db)

	authService := service.NewAuthService(userRepo)

	authHandler := handlers.NewAuthHandler(authService)

	//  Create Gin router
	router := gin.Default()

	router.Use(middleware.Logger())

	//  Connect URL to Handler
	routes.SetupRoutes(router, employeeHandler, authHandler)

	//  Start server
	router.Run(":8081")
}
