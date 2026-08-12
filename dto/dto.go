package dto

type CreateEmployeeRequest struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
	Mail string `json:"mail"`
}

type UpdateEmployeeRequest struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
	Mail string `json:"mail"`
}

type EmployeeResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
	Mail string `json:"mail"`
}
