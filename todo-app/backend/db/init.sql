-- XÓA BẢNG NẾU CÓ (để chạy lại không lỗi)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_status;
DROP TABLE IF EXISTS users;

-- 1. Bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Bảng task_status
CREATE TABLE task_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE
);

-- Nhập dữ liệu mẫu cho task_status
INSERT INTO task_status (id, name) VALUES
    (1, 'To do'),
    (2, 'Doing'),
    (3, 'Done');

-- 3. Bảng tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status_id INTEGER REFERENCES task_status(id),
    created_at TIMESTAMP DEFAULT NOW()
);
