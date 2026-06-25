-- =========================================================
-- SQL DDL SCHEMA GENERATED FROM JPA ENTITIES
-- =========================================================

-- 1. Create categories table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(1000),
    description TEXT,
    color VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create courses table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    description LONGTEXT,
    short_description TEXT,
    level VARCHAR(50),
    language VARCHAR(100),
    duration VARCHAR(100),
    icon VARCHAR(1000),
    thumbnail VARCHAR(1000),
    banner_image VARCHAR(1000),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- SEO Fields
    meta_title VARCHAR(70),
    meta_description VARCHAR(320),
    meta_keywords LONGTEXT,
    canonical_url VARCHAR(1000),
    primary_keyword VARCHAR(300),
    secondary_keywords LONGTEXT,
    focus_keywords LONGTEXT,
    robots VARCHAR(100) DEFAULT 'index, follow',
    author VARCHAR(200),
    seo_category VARCHAR(200),
    seo_tags LONGTEXT,
    
    -- Open Graph Fields
    og_title VARCHAR(150),
    og_description VARCHAR(500),
    og_image VARCHAR(1000),
    og_url VARCHAR(1000),
    og_type VARCHAR(255) DEFAULT 'website',
    
    -- Twitter Fields
    twitter_title VARCHAR(150),
    twitter_description VARCHAR(500),
    twitter_image VARCHAR(1000),
    twitter_card VARCHAR(255) DEFAULT 'summary_large_image',
    
    -- Structured Data Schema
    schema_markup LONGTEXT,
    faq_schema LONGTEXT,
    breadcrumb_schema LONGTEXT,
    
    -- Video & Outcomes
    youtube_video_url VARCHAR(1000),
    preview_video_url VARCHAR(1000),
    learning_outcomes LONGTEXT,
    prerequisites LONGTEXT,
    target_audience LONGTEXT,
    course_highlights LONGTEXT,
    career_opportunities LONGTEXT,
    
    -- Programmatic SEO
    search_intent LONGTEXT,
    semantic_keywords LONGTEXT,
    related_topics LONGTEXT,
    search_synonyms LONGTEXT,
    faq_content LONGTEXT,
    custom_head_script LONGTEXT,
    custom_body_script LONGTEXT,
    
    -- Analytics
    total_views BIGINT DEFAULT 0,
    total_clicks BIGINT DEFAULT 0,
    ctr DOUBLE DEFAULT 0.0,
    seo_score INT DEFAULT 0,
    
    -- Flags
    is_published BOOLEAN DEFAULT FALSE,
    allow_indexing BOOLEAN DEFAULT TRUE,
    show_in_search BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_course_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Indexes for courses table
CREATE INDEX idx_course_slug ON courses(slug);
CREATE INDEX idx_course_primary_keyword ON courses(primary_keyword);
CREATE INDEX idx_course_active ON courses(is_active);
CREATE INDEX idx_course_featured ON courses(is_featured);
CREATE INDEX idx_course_level ON courses(level);
CREATE INDEX idx_course_title ON courses(title);

-- 3. Create modules table
CREATE TABLE modules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    module_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_module_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Create submodules table
CREATE TABLE submodules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    meta_title VARCHAR(70),
    meta_description VARCHAR(320),
    canonical_url VARCHAR(1000),
    og_title VARCHAR(150),
    og_description VARCHAR(500),
    og_image VARCHAR(1000),
    submodule_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    slug VARCHAR(250) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_submodule_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- 5. Create contents table
CREATE TABLE contents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submodule_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    text TEXT,
    code TEXT,
    language VARCHAR(50),
    video_url VARCHAR(500),
    image_url VARCHAR(500),
    alt VARCHAR(200),
    caption VARCHAR(300),
    title VARCHAR(300),
    heading_level INT,
    content_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_content_submodule FOREIGN KEY (submodule_id) REFERENCES submodules(id) ON DELETE CASCADE
);
