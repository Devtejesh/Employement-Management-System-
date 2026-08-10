package database //Connect to PostgreSQL and provide the database connection.

import (
	"backenedprojectphase2/configs"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func ConnectDB(config *configs.Config) (*sql.DB, error) {
	connectionString := fmt.Sprintf(
		"host=%s port =%s user=%s password=%s dbname=%s sslmode=%s",
		config.HOST,
		config.PORT,
		config.USER,
		config.PASSWORD,
		config.DBNAME,
		config.SSLMODE,
	)
	fmt.Println(connectionString)
	db, err := sql.Open(
		"postgres", connectionString)
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
