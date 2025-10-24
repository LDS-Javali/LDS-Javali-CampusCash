package codegen

import (
    "math/rand"
    "time"
    "fmt"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func GenerateCouponCode(prefix string) string {
    rand.Seed(time.Now().UnixNano())
    b := make([]byte, 8)
    for i := range b {
        b[i] = charset[rand.Intn(len(charset))]
    }
    return fmt.Sprintf("%s-%s", prefix, string(b))
}