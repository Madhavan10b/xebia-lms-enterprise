package com.geeknito.geeknito_backend.entity.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentEntity{
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    /** text | code | video | image | heading | callout | table */
    @Column(nullable = false, length = 30)
    private String type;
 
    // ── text / callout
    @Column(columnDefinition = "TEXT")
    private String text;
 
    // ── code
    @Column(columnDefinition = "TEXT")
    private String code;
 
    @Column(length = 50)
    private String language;
 
    // ── video
    @Column(length = 500)
    private String videoUrl;
 
    // ── image
    @Column(length = 500)
    private String imageUrl;
 
    @Column(length = 200)
    private String alt;
 
    @Column(length = 300)
    private String caption;
 
    // ── heading / callout
    @Column(length = 300)
    private String title;
 
    /** 1–6 (heading type only) */
    private Integer headingLevel;
 
    @Column(nullable = false)
    @Builder.Default
    private Integer contentOrder = 0;
 
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
 
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
 
    @UpdateTimestamp
    private LocalDateTime updatedAt;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submodule_id", nullable = false)
    @JsonIgnore
    private SubmoduleEntity submodule;
}
