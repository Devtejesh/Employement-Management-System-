package handlers

import (
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {

}

func EmployeeHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodGet:
		GetEmployee(w, r)
	case http.MethodPost:
		CreateEmployee(w, r)
	case http.MethodPut:
		UpdateEmployee(w, r)
	case http.MethodDelete:
		DeleteEmployee(w, r)
	}
}

func GetEmployee(w http.ResponseWriter, r *http.Request) {

}
func CreateEmployee(w http.ResponseWriter, r *http.Request) {

}
func UpdateEmployee(w http.ResponseWriter, r *http.Request) {

}
func DeleteEmployee(w http.ResponseWriter, r *http.Request) {

}
