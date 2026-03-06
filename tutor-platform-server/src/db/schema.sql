-- Tutor Platform Database Schema (Phase 1)
-- MySQL 8+

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  role ENUM('ADMIN','FAMILY','TUTOR') NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_email (email)
);

-- Tutor profile (1-to-1 with users where role='TUTOR')
CREATE TABLE IF NOT EXISTS tutor_profiles (
  tutor_id BIGINT UNSIGNED PRIMARY KEY,
  bio TEXT NULL,
  location_city VARCHAR(80) NULL,
  location_area VARCHAR(80) NULL,
  education VARCHAR(150) NULL,
  experience_years INT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tutor_profiles_user
    FOREIGN KEY (tutor_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Tutor billing status (registration + renewal every 6 months)
CREATE TABLE IF NOT EXISTS tutor_billing (
  tutor_id BIGINT UNSIGNED PRIMARY KEY,
  registration_paid TINYINT(1) NOT NULL DEFAULT 0,
  next_renewal_date DATE NULL,
  billing_status ENUM('ACTIVE','PAST_DUE','SUSPENDED') NOT NULL DEFAULT 'SUSPENDED',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_tutor_billing_user
    FOREIGN KEY (tutor_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Payments made by tutors (registration/renewal)
CREATE TABLE IF NOT EXISTS tutor_payments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  tutor_id BIGINT UNSIGNED NOT NULL,
  type ENUM('REGISTRATION','RENEWAL') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('PENDING','PAID','FAILED') NOT NULL DEFAULT 'PENDING',
  provider VARCHAR(40) NULL,
  provider_ref VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_tutor_payments_tutor (tutor_id),
  KEY idx_tutor_payments_status (status),

  CONSTRAINT fk_tutor_payments_user
    FOREIGN KEY (tutor_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Bookings created by families with tutors
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  tutor_id BIGINT UNSIGNED NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  session_type ENUM('ONLINE','IN_PERSON') NOT NULL DEFAULT 'ONLINE',
  location_note VARCHAR(200) NULL,
  status ENUM('PENDING_PAYMENT','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_bookings_tutor_time (tutor_id, start_time),
  KEY idx_bookings_family (family_id),
  KEY idx_bookings_status (status),

  CONSTRAINT fk_bookings_family
    FOREIGN KEY (family_id) REFERENCES users(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_bookings_tutor
    FOREIGN KEY (tutor_id) REFERENCES users(id)
    ON DELETE RESTRICT
);

-- Payment for booking (pay-per-booking)
CREATE TABLE IF NOT EXISTS booking_payments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  provider VARCHAR(40) NULL,
  provider_ref VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_booking_payments_booking (booking_id),
  KEY idx_booking_payments_status (status),

  CONSTRAINT fk_booking_payments_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
);