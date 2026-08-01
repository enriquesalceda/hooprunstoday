package domain

type CourtType string

const (
	CourtOutdoor CourtType = "OUTDOOR"
	CourtIndoor  CourtType = "INDOOR"
)

// Court is a place where runs happen. Managed as fixture data until the
// Radar features arrive.
type Court struct {
	ID   string
	Name string
	Type CourtType
}
