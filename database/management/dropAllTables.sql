-- Destruction --
DROP TABLE IF EXISTS measurements;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS outputs CASCADE;
DROP TABLE IF EXISTS places;
DROP TYPE IF EXISTS client_status;
DROP TYPE IF EXISTS signal_status;
DROP TABLE IF EXISTS lifecycle;