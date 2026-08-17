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

	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	db, err := database.ConnectDB(config)
	if err != nil {
		log.Fatal(err)
	}

	employeeRepo := repository.NewEmployeeRepository(db)
	userRepo := repository.NewUserRepository(db)

	employeeService := service.NewEmployeeService(employeeRepo)
	authService := service.NewAuthService(userRepo)

	employeeHandler := handlers.NewEmployeeHandler(employeeService)

	authHandler := handlers.NewAuthHandler(authService)

	router := gin.Default()

	router.Use(middleware.Logger())

	routes.SetupRoutes(router, employeeHandler, authHandler)

	router.Run(":8080")
}
