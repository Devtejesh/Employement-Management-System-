package service

import (
	"backenedprojectphase2/models"
	"backenedprojectphase2/repository"
	"backenedprojectphase2/utils"
)

type AuthService struct {
	userrepo *repository.UserRepository
}

func NewAuthService(userrepo *repository.UserRepository) *AuthService {
	return &AuthService{
		userrepo: userrepo,
	}
}
func (s *AuthService) CreateUser(
	email string,
	password string,
	role string,
) (models.User, error) {

	// Hash the plain password before storing it.
	passwordHash, err := utils.HashPassword(password)
	if err != nil {
		return models.User{}, err
	}

	// Store the hashed password in PostgreSQL.
	user, err := s.userrepo.CreateUser(
		email,
		passwordHash,
		role,
	)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
