package main

import (
	"backenedprojectphase2/configs"
	"backenedprojectphase2/database"
	"backenedprojectphase2/handlers"
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

	// 4. Create Service
	employeeService := service.NewEmployeeService(employeeRepo)

	// 5. Create Handler
	employeeHandler := handlers.NewEmployeeHandler(employeeService)

	// 5. Create Gin router
	router := gin.Default()

	// 6. Connect URL to Handler
	routes.SetupRoutes(router, employeeHandler)

	// 7. Start server
	router.Run(":8081")
}
