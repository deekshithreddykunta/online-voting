ALTER TABLE password_reset_otp
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    