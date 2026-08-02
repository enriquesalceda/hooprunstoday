package domain

import (
	"errors"
	"regexp"
	"strings"
	"time"
)

var (
	ErrInvalidLeadName      = errors.New("name must be 1-80 characters")
	ErrInvalidContactMethod = errors.New("contact method must be EMAIL or MOBILE")
	ErrInvalidLeadContact   = errors.New("contact must be a valid email address or mobile number")
)

var (
	leadEmailPattern  = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$`)
	leadMobilePattern = regexp.MustCompile(`^\+?[0-9]{7,15}$`)
	// Punctuation people type into phone numbers; stripped before validation.
	mobileNoise = strings.NewReplacer(" ", "", "-", "", "(", "", ")", "", ".", "")
)

type ContactMethod string

const (
	ContactEmail  ContactMethod = "EMAIL"
	ContactMobile ContactMethod = "MOBILE"
)

func ParseContactMethod(s string) (ContactMethod, error) {
	switch ContactMethod(s) {
	case ContactEmail, ContactMobile:
		return ContactMethod(s), nil
	}
	return "", ErrInvalidContactMethod
}

// Lead is someone who asked to be told when their city goes live. They have
// no account — just a name and one way to reach them.
type Lead struct {
	ID        string
	Name      string
	Method    ContactMethod
	Contact   string
	CreatedAt time.Time
}

type LeadParams struct {
	Name    string
	Method  ContactMethod
	Contact string
}

// NewLead validates and normalizes: name trimmed, email lowercased, mobile
// stripped to digits (dedup in storage is on the normalized contact).
func NewLead(p LeadParams) (Lead, error) {
	name := strings.TrimSpace(p.Name)
	if name == "" || len(name) > 80 {
		return Lead{}, ErrInvalidLeadName
	}

	method, err := ParseContactMethod(string(p.Method))
	if err != nil {
		return Lead{}, err
	}

	contact, err := normalizeContact(method, p.Contact)
	if err != nil {
		return Lead{}, err
	}

	return Lead{Name: name, Method: method, Contact: contact}, nil
}

func normalizeContact(method ContactMethod, raw string) (string, error) {
	switch method {
	case ContactEmail:
		email := strings.ToLower(strings.TrimSpace(raw))
		if len(email) > 254 || !leadEmailPattern.MatchString(email) {
			return "", ErrInvalidLeadContact
		}
		return email, nil
	default: // ContactMobile — ParseContactMethod already excluded the rest
		mobile := mobileNoise.Replace(strings.TrimSpace(raw))
		if !leadMobilePattern.MatchString(mobile) {
			return "", ErrInvalidLeadContact
		}
		return mobile, nil
	}
}
