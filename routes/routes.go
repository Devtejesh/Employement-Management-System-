package routes

import (
	"backenedprojectphase2/handlers"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("/", handlers.Home)
	http.HandleFunc("/employee/", handlers.EmployeeHandler)
}
