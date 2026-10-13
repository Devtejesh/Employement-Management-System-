package dto

type LoginUserResponse struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type LoginResponse struct {
	Message string            `json:"message"`
	Token   string            `json:"token"`
	User    LoginUserResponse `json:"user"`
}
