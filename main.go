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
	"net/http"

	_ "backenedprojectphase2/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Employee Api
// @version 1.0
// @description Employee Management REST API
// @host localhost:8081
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		origin := c.GetHeader("Origin")

		if origin == "http://localhost:5173" ||
			origin == "http://127.0.0.1:5173" {

			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Methods",
				"GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers",
				"Origin, Content-Type, Authorization")
			c.Header("Vary", "Origin")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

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
	authService := service.NewAuthService(userRepo, config.JWTSecret)

	employeeHandler := handlers.NewEmployeeHandler(employeeService)
	authHandler := handlers.NewAuthHandler(authService)

	router := gin.Default()

	// CORS middleware
	router.Use(corsMiddleware())

	router.GET("/swagger/*any",
		ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Use(middleware.Logger())

	routes.SetupRoutes(
		router,
		employeeHandler,
		authHandler,
		config.JWTSecret,
	)

	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
	}
}
