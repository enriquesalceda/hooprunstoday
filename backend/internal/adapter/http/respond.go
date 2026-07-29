package http

import (
	"encoding/json"
	"net/http"
)

type errorBody struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}

type errorEnvelope struct {
	Error errorBody `json:"error"`
}

func respondJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func respondError(w http.ResponseWriter, status int, code, message string) {
	respondJSON(w, status, errorEnvelope{Error: errorBody{Code: code, Message: message}})
}

func respondFieldErrors(w http.ResponseWriter, status int, code, message string, fields map[string]string) {
	respondJSON(w, status, errorEnvelope{Error: errorBody{Code: code, Message: message, Fields: fields}})
}
