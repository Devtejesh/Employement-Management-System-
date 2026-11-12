package handlers

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func NewPDFUploadHandler(aiAgentURL, uploadServiceKey string) gin.HandlerFunc {
	return func(c *gin.Context) {

		if aiAgentURL == "" || uploadServiceKey == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "AI Agent upload configuration is missing",
			})
			return
		}

		c.Request.Body = http.MaxBytesReader(
			c.Writer,
			c.Request.Body,
			100<<20,
		)

		if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid upload request or total upload size exceeds 100 MB",
			})
			return
		}

		if c.Request.MultipartForm == nil ||
			len(c.Request.MultipartForm.File["files"]) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Please upload at least one PDF",
			})
			return
		}

		var body bytes.Buffer
		writer := multipart.NewWriter(&body)

		for _, fileHeader := range c.Request.MultipartForm.File["files"] {

			if len(fileHeader.Filename) == 0 {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid filename",
				})
				return
			}

			file, err := fileHeader.Open()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Unable to open uploaded file",
				})
				return
			}

			part, err := writer.CreateFormFile("files", fileHeader.Filename)
			if err != nil {
				file.Close()
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Unable to prepare PDF upload",
				})
				return
			}

			_, copyErr := io.Copy(part, file)
			file.Close()

			if copyErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Unable to read uploaded PDF",
				})
				return
			}
		}

		if err := writer.Close(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to finalize upload request",
			})
			return
		}

		request, err := http.NewRequestWithContext(
			c.Request.Context(),
			http.MethodPost,
			aiAgentURL+"/internal/knowledge/upload",
			&body,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to create AI Agent request",
			})
			return
		}

		request.Header.Set("Content-Type", writer.FormDataContentType())
		request.Header.Set("X-Upload-Service-Key", uploadServiceKey)

		client := &http.Client{
			Timeout: 5 * time.Minute,
		}

		response, err := client.Do(request)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{
				"error": fmt.Sprintf("AI Agent is unavailable: %v", err),
			})
			return
		}
		defer response.Body.Close()

		responseBody, err := io.ReadAll(response.Body)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{
				"error": "Unable to read AI Agent response",
			})
			return
		}

		contentType := response.Header.Get("Content-Type")
		if contentType != "" {
			c.Header("Content-Type", contentType)
		}

		c.Data(response.StatusCode, contentType, responseBody)
	}
}
