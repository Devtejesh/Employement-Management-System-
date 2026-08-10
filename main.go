package main

import (
	"backenedprojectphase2/configs"
	"backenedprojectphase2/database"
	"backenedprojectphase2/routes"
	"fmt"
	"log"
	"net/http"
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

	_ = db // temporary variable

	routes.RegisterRoutes()
	fmt.Println("Server started at port :8080")
	http.ListenAndServe(":8080", nil)

}
