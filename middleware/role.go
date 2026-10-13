package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequiredRole(requiredrole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")

		fmt.Println("ROLE FROM CONTEXT:", role)
		fmt.Println("REQUIRED ROLE:", requiredrole) // Your JWT authentication middleware must put the role into Gin's context.

		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "role not found",
			})
			c.Abort()
			return
		}

		if role != requiredrole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You don't have permission to perform this action",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
