package com.geeknito.geeknito_backend.entity.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "courses",
        indexes = {
                @Index(name = "idx_course_slug", columnList = "slug"),
                @Index(name = "idx_course_primary_keyword", columnList = "primaryKeyword"),
                @Index(name = "idx_course_active", columnList = "isActive"),
                @Index(name = "idx_course_featured", columnList = "isFeatured"),
                @Index(name = "idx_course_level", columnList = "level"),
                @Index(name = "idx_course_title", columnList = "title")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEntity {

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // BASIC COURSE INFORMATION
    // =========================================================

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    // FULL COURSE DESCRIPTION
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    // SHORT DESCRIPTION
    @Lob
    @Column(columnDefinition = "TEXT")
    private String shortDescription;

    @Column(length = 50)
    private String level;

    @Column(length = 100)
    private String language;

    @Column(length = 67)
    private String duration;

    @Column(length = 1000)
    private String icon;

    @Column(length = 1000)
    private String thumbnail;

    @Column(length = 1000)
    private String bannerImage;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isFeatured = false;

    // =========================================================
    // SEO CORE
    // =========================================================

    @Column(length = 70)
    private String metaTitle;

    @Column(length = 320)
    private String metaDescription;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String metaKeywords;

    @Column(length = 1000)
    private String canonicalUrl;

    // =========================================================
    // ADVANCED SEO
    // =========================================================

    @Column(length = 300)
    private String primaryKeyword;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String secondaryKeywords;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String focusKeywords;

    @Column(length = 100)
    @Builder.Default
    private String robots = "index, follow";

    @Column(length = 200)
    private String author;

    @Column(length = 200)
    private String seoCategory;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String seoTags;

    // =========================================================
    // OPEN GRAPH SEO
    // =========================================================

    @Column(length = 150)
    private String ogTitle;

    @Column(length = 500)
    private String ogDescription;

    @Column(length = 1000)
    private String ogImage;

    @Column(length = 1000)
    private String ogUrl;

    @Builder.Default
    private String ogType = "website";

    // =========================================================
    // TWITTER / X SEO
    // =========================================================

    @Column(length = 150)
    private String twitterTitle;

    @Column(length = 500)
    private String twitterDescription;

    @Column(length = 1000)
    private String twitterImage;

    @Builder.Default
    private String twitterCard = "summary_large_image";

    // =========================================================
    // STRUCTURED DATA
    // =========================================================

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String schemaMarkup;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String faqSchema;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String breadcrumbSchema;

    // =========================================================
    // COURSE CONTENT SEO
    // =========================================================

    @Column(length = 1000)
    private String youtubeVideoUrl;

    @Column(length = 1000)
    private String previewVideoUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String learningOutcomes;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String prerequisites;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String targetAudience;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String courseHighlights;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String careerOpportunities;

    // =========================================================
    // PROGRAMMATIC SEO
    // =========================================================

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String searchIntent;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String semanticKeywords;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String relatedTopics;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String searchSynonyms;

    // =========================================================
    // FAQ CONTENT
    // =========================================================

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String faqContent;

    // =========================================================
    // CUSTOM SEO CONTENT
    // =========================================================

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String customHeadScript;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String customBodyScript;

    // =========================================================
    // ANALYTICS
    // =========================================================

    @Builder.Default
    private Long totalViews = 0L;

    @Builder.Default
    private Long totalClicks = 0L;

    @Builder.Default
    private Double ctr = 0.0;

    @Builder.Default
    private Integer seoScore = 0;

    // =========================================================
    // COURSE FLAGS
    // =========================================================

    @Builder.Default
    private Boolean isPublished = false;

    @Builder.Default
    private Boolean allowIndexing = true;

    @Builder.Default
    private Boolean showInSearch = true;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // =========================================================
    // RELATIONSHIPS
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private CategoryEntity category;

    @OneToMany(
            mappedBy = "course",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<ModuleEntity> modules = new ArrayList<>();
}
