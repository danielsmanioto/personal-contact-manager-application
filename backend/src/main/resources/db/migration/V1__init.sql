-- Create contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NULL
);

-- Create indexes for performance optimization
-- Search by email (soft delete filter)
CREATE INDEX idx_contacts_email ON contacts(email) WHERE deleted_at IS NULL;

-- Search by name (soft delete filter)
CREATE INDEX idx_contacts_name ON contacts(name) WHERE deleted_at IS NULL;

-- Filter by birth date (soft delete filter)
CREATE INDEX idx_contacts_birth_date ON contacts(birth_date) WHERE deleted_at IS NULL;

-- Soft delete filtering (commonly used WHERE clause)
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at);

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'Personal contacts with soft delete support';
COMMENT ON COLUMN contacts.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN contacts.name IS 'Contact full name (1-255 chars, required)';
COMMENT ON COLUMN contacts.email IS 'Contact email (unique, required, RFC 5322)';
COMMENT ON COLUMN contacts.phone IS 'Contact phone number (10-20 digits, optional)';
COMMENT ON COLUMN contacts.birth_date IS 'Date of birth (optional, past dates only)';
COMMENT ON COLUMN contacts.created_at IS 'Creation timestamp (auto-set)';
COMMENT ON COLUMN contacts.updated_at IS 'Last update timestamp (auto-updated)';
COMMENT ON COLUMN contacts.deleted_at IS 'Soft delete timestamp (NULL = active)';
