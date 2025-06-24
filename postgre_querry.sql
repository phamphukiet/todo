-- Bảng trạng thái công việc
CREATE TABLE task_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE
);

INSERT INTO task_status (name)
VALUES 
  ('To do'),
  ('Doing'),
  ('Done');

-- Bảng người dùng (giả định đã có)
-- Nếu chưa có thì tạo bảng users trước:
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cập nhật kiểu dữ liệu nếu cần
ALTER TABLE users
ALTER COLUMN password_hash TYPE TEXT;

ALTER TABLE users
ALTER COLUMN username TYPE VARCHAR(50);

-- Chèn dữ liệu mẫu
INSERT INTO users (username, password_hash)
VALUES 
  ('sang123', '123'),
  ('kietpro', '1234'),
  ('anhcute', '12345');

-- Bảng công việc
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status_id INTEGER REFERENCES task_status(id),
    created_at TIMESTAMP DEFAULT now()
);

-- Chèn task mẫu
INSERT INTO tasks (user_id, title, description, due_date, status_id)
VALUES 
  (1, 'Hoàn thành init.sql', 'Tạo bảng PostgreSQL và insert data mẫu', '2025-06-23', 3),
  (1, 'Viết báo cáo kỹ thuật', NULL, '2025-06-30', 1),
  (2, 'Thiết kế giao diện Kanban', 'HTML/CSS cho task view', NULL, 2),
  (2, 'Chỉnh sửa README.md', 'Viết hướng dẫn setup và khởi chạy', '2025-06-25', 1),
  (3, 'Đăng ký tài khoản demo', NULL, NULL, 1);

-- Truy vấn kiểm tra
SELECT * FROM task_status;
SELECT * FROM tasks;
