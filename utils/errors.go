package utils

import "errors"

var (
	ErrEmployeeNotFound   = errors.New("Employee Not Found")
	ErrInvalidEmployee    = errors.New("Invalid Employee")
	ErrEmailAlreadyExists = errors.New("Email already Exists")
)
