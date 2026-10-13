package configs

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	HOST      string
	PORT      string
	USER      string
	PASSWORD  string
	DBNAME    string
	SSLMODE   string
	JWTSecret string
}

func LoadConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}
	config := &Config{
		HOST:      os.Getenv("DB_HOST"),
		PORT:      os.Getenv("DB_PORT"),
		USER:      os.Getenv("DB_USER"),
		PASSWORD:  os.Getenv("DB_PASSWORD"),
		DBNAME:    os.Getenv("DB_NAME"),
		SSLMODE:   os.Getenv("DB_SSLMODE"),
		JWTSecret: os.Getenv("DB_JWTSecret"),
	}
	return config, nil
}
