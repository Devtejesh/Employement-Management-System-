package database //Connect to PostgreSQL and provide the database connection.

import (
	"backenedprojectphase2/configs"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

func ConnectDB(config *configs.Config) (*sql.DB, error) {
	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.HOST,
		config.PORT,
		config.USER,
		config.PASSWORD,
		config.DBNAME,
		config.SSLMODE,
	)
	db, err := sql.Open(
		"postgres", connectionString)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
