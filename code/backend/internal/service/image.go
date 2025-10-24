package service

import (
	"bytes"
	"image"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
)

type ImageService struct{}

func NewImageService() *ImageService {
	return &ImageService{}
}

func (s *ImageService) ProcessImage(c *gin.Context, fieldName string) ([]byte, error) {
	file, _, err := c.Request.FormFile(fieldName)
	if err != nil {
		return nil, err
	}
	defer file.Close()


	var buf bytes.Buffer
	_, err = io.Copy(&buf, file)
	if err != nil {
		return nil, err
	}


	imgData := buf.Bytes()
	

	_, _, err = image.DecodeConfig(bytes.NewReader(imgData))
	if err != nil {
		return nil, err
	}


	return imgData, nil
}

func (s *ImageService) GetImageContentType(imgData []byte) string {

	if len(imgData) < 8 {
		return "application/octet-stream"
	}


	if len(imgData) >= 8 && imgData[0] == 0x89 && imgData[1] == 0x50 && imgData[2] == 0x4E && imgData[3] == 0x47 {
		return "image/png"
	}


	if len(imgData) >= 3 && imgData[0] == 0xFF && imgData[1] == 0xD8 && imgData[2] == 0xFF {
		return "image/jpeg"
	}

	return "application/octet-stream"
}

func (s *ImageService) ResizeImage(imgData []byte, maxWidth, maxHeight int) ([]byte, error) {


	return imgData, nil
}

func (s *ImageService) ValidateImageType(filename string) bool {
	ext := strings.ToLower(filename[strings.LastIndex(filename, ".")+1:])
	allowedTypes := []string{"jpg", "jpeg", "png", "gif"}
	
	for _, allowedType := range allowedTypes {
		if ext == allowedType {
			return true
		}
	}
	return false
}

