package repository

import (
	"database/sql"
	"errors"

	"backenedprojectphase2/models"
	"backenedprojectphase2/utils"

	"github.com/lib/pq"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) GetUserByEmail(email string) (models.User, error) {

	var user models.User

	err := r.db.QueryRow(`
		SELECT id,name, email, password_hash, role
		FROM users
		WHERE email = $1
	`, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
	)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (r *UserRepository) CreateUser(
	name string,
	email string,
	passwordHash string,
	role string,
) (models.User, error) {

	var user models.User

	err := r.db.QueryRow(`
		INSERT INTO users (name, email, password_hash, role)
		VALUES ($1, $2, $3,$4)
		RETURNING id,name, email, password_hash, role
	`,
		name,
		email,
		passwordHash,
		role,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
	)

	if err != nil {

		var pqErr *pq.Error

		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return models.User{}, utils.ErrEmailAlreadyExists
		}

		return models.User{}, err
	}

	return user, nil
}
