package service

import (
	"backenedprojectphase2/models"
	"backenedprojectphase2/repository"
	"backenedprojectphase2/utils"
)

type AuthService struct {
	userrepo  *repository.UserRepository
	jwtSecret string
}

func NewAuthService(userrepo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userrepo:  userrepo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) CreateUser(
	name string,
	email string,
	password string,
	role string,
) (models.User, error) {

	// Validate password length.
	if len(password) < 8 {
		return models.User{}, utils.ErrWeakPassword
	}

	// Hash the plain password before storing it.
	passwordHash, err := utils.HashPassword(password)
	if err != nil {
		return models.User{}, err
	}

	// Store the hashed password in PostgreSQL.
	user, err := s.userrepo.CreateUser(
		name,
		email,
		passwordHash,
		role,
	)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (s *AuthService) Login(email string, password string) (models.User, string, error) {

	user, err := s.userrepo.GetUserByEmail(email)
	if err != nil {
		return models.User{}, "", err
	}

	err = utils.CheckPassword(password, user.PasswordHash)
	if err != nil {
		return models.User{}, "", err
	}

	token, err := utils.GenerateToken(
		user.ID,
		user.Email,
		user.Role,
		s.jwtSecret,
	)

	if err != nil {
		return models.User{}, "", err
	}

	return user, token, nil
}
