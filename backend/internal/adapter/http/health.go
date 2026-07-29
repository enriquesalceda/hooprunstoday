package http

import (
	"encoding/json"
	"net/http"
)

// Health reports service liveness. Cloud Run and CI health checks hit this.
func Health(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
