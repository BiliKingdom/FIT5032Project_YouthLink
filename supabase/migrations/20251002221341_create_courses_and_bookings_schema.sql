/*
  # Course Booking System Schema

  ## Overview
  This migration creates the complete schema for the course booking system, including courses, 
  schedules, bookings, exceptions, and one-time sessions.

  ## Tables Created

  ### 1. courses
  - `id` (uuid, primary key) - Unique course identifier
  - `title` (text) - Course name
  - `description` (text) - Course description
  - `instructor` (text) - Instructor name
  - `duration` (integer) - Duration in minutes
  - `max_participants` (integer) - Maximum number of participants
  - `category` (text) - Course category (Mental Health, Wellness, etc.)
  - `price` (numeric) - Course price (0 for free courses)
  - `is_active` (boolean) - Whether the course is active
  - `course_type` (text) - Type: one-time, weekly, or monthly
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. course_schedules
  - `id` (uuid, primary key) - Unique schedule identifier
  - `course_id` (uuid, foreign key) - Reference to courses table
  - `day_of_week` (integer) - Day of week (0=Sunday, 1=Monday, etc.)
  - `start_time` (time) - Session start time
  - `end_time` (time) - Session end time
  - `is_active` (boolean) - Whether the schedule is active
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. course_bookings
  - `id` (uuid, primary key) - Unique booking identifier
  - `course_id` (uuid, foreign key) - Reference to courses table
  - `course_name` (text) - Course name (denormalized for performance)
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `user_name` (text) - User display name
  - `user_email` (text) - User email
  - `start_time` (timestamptz) - Booking start time
  - `end_time` (timestamptz) - Booking end time
  - `status` (text) - Booking status: confirmed, cancelled, completed
  - `notes` (text) - Optional booking notes
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. course_exceptions
  - `id` (uuid, primary key) - Unique exception identifier
  - `course_id` (uuid, foreign key) - Reference to courses table
  - `exception_date` (date) - Date when course is cancelled
  - `reason` (text) - Optional reason for cancellation
  - `created_at` (timestamptz) - Creation timestamp
  - `created_by` (uuid) - Admin user who created the exception

  ### 5. one_time_sessions
  - `id` (uuid, primary key) - Unique session identifier
  - `course_id` (uuid, foreign key) - Reference to courses table
  - `session_date` (date) - Session date
  - `start_time` (time) - Session start time
  - `end_time` (time) - Session end time
  - `is_active` (boolean) - Whether the session is active
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Policies are defined for authenticated users and admins
  - Users can only view active courses and their own bookings
  - Only admins can create/update/delete courses and schedules

  ## Indexes
  - Created indexes on foreign keys for performance
  - Created indexes on frequently queried columns
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  max_participants integer NOT NULL DEFAULT 12,
  category text NOT NULL DEFAULT 'Mental Health',
  price numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  course_type text NOT NULL DEFAULT 'weekly' CHECK (course_type IN ('one-time', 'weekly', 'monthly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_schedules table
CREATE TABLE IF NOT EXISTS course_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create course_bookings table
CREATE TABLE IF NOT EXISTS course_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (end_time > start_time)
);

-- Create course_exceptions table
CREATE TABLE IF NOT EXISTS course_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exception_date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  UNIQUE(course_id, exception_date)
);

-- Create one_time_sessions table
CREATE TABLE IF NOT EXISTS one_time_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_session_time CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_course_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_course_schedules_course_id ON course_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_course_id ON course_bookings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_user_id ON course_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_start_time ON course_bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_course_bookings_status ON course_bookings(status);
CREATE INDEX IF NOT EXISTS idx_course_exceptions_course_id ON course_exceptions(course_id);
CREATE INDEX IF NOT EXISTS idx_one_time_sessions_course_id ON one_time_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_one_time_sessions_session_date ON one_time_sessions(session_date);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_time_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses table
CREATE POLICY "Users can view active courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all courses"
  ON courses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for course_schedules table
CREATE POLICY "Users can view active schedules"
  ON course_schedules FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage schedules"
  ON course_schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for course_bookings table
CREATE POLICY "Users can view their own bookings"
  ON course_bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all bookings"
  ON course_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can create their own bookings"
  ON course_bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON course_bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings"
  ON course_bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for course_exceptions table
CREATE POLICY "Users can view exceptions"
  ON course_exceptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage exceptions"
  ON course_exceptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for one_time_sessions table
CREATE POLICY "Users can view active sessions"
  ON one_time_sessions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage sessions"
  ON one_time_sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_bookings_updated_at
  BEFORE UPDATE ON course_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
