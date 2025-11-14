-- add blog/education and testimonials system

-- articles table already has approval columns
-- create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    user_type TEXT NOT NULL CHECK(user_type IN ('patient', 'health_professional', 'institutional_admin')),
    content TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    approval_status TEXT DEFAULT 'pending' CHECK(approval_status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER,
    approved_at DATETIME,
    rejection_reason TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_approval_status ON articles(approval_status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_type, author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, approval_status);
CREATE INDEX IF NOT EXISTS idx_testimonials_approval_status ON testimonials(approval_status);
CREATE INDEX IF NOT EXISTS idx_testimonials_user ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, approval_status);
