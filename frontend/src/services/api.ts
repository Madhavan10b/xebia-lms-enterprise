import axios from 'axios';
import { Category, Course } from '../types';

const API_BASE_URL = '/api';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// High-fidelity Mock Data Fallback
const mockCategories: Category[] = [
  { id: 1, name: "Software Development", icon: "code", description: "Backend, Web, and Mobile Engineering", color: "#6C1D5F", isActive: true },
  { id: 2, name: "System Design", icon: "git-branch", description: "Distributed Systems, Microservices, and Scale", color: "#01AC9F", isActive: true },
  { id: 3, name: "DevOps & Cloud", icon: "server", description: "Docker, Kubernetes, CI/CD, and AWS", color: "#FF6200", isActive: true }
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Introduction to Spring Boot",
    slug: "intro-to-spring-boot",
    description: "Learn how to build production-grade backend APIs from scratch with Java and Spring Boot.",
    shortDescription: "Sleek Spring Boot basics for developers.",
    level: "Beginner",
    language: "English",
    duration: "10 Hours",
    category: mockCategories[0],
    seoScore: 94,
    totalViews: 1540,
    totalClicks: 230,
    ctr: 14.9,
    isPublished: true,
    modules: [
      {
        id: 101,
        title: "1. Spring Core Concepts",
        description: "Dependency injection, Beans, and Application Context.",
        moduleOrder: 1,
        submodules: [
          {
            id: 1011,
            title: "Introduction to Dependency Injection",
            slug: "intro-dependency-injection",
            submoduleOrder: 1,
            contents: [
              { id: 1, type: "heading", title: "Understanding Inversion of Control", headingLevel: 1 },
              { id: 2, type: "text", text: "In traditional programming, code instantiates its own dependencies. In Spring, the IoC Container manages objects (Beans) and injects them when needed. This loosely couples your code." },
              { id: 3, type: "callout", title: "Key Pro-Tip", text: "Always prefer constructor injection over @Autowired field injection to write easily testable classes." },
              {
                id: 4,
                type: "code",
                language: "java",
                code: `@Service\npublic class CourseService {\n    private final CourseRepository repository;\n\n    // Constructor injection is standard in Spring Boot\n    public CourseService(CourseRepository repository) {\n        this.repository = repository;\n    }\n}`
              }
            ]
          },
          {
            id: 1012,
            title: "Spring Boot Auto-Configuration",
            slug: "auto-config",
            submoduleOrder: 2,
            contents: [
              { id: 5, type: "heading", title: "How @SpringBootApplication Works", headingLevel: 2 },
              { id: 6, type: "text", text: "The @SpringBootApplication annotation is a convenience annotation that adds: @Configuration, @EnableAutoConfiguration, and @ComponentScan. Spring Boot configures beans automatically based on jar dependencies on the classpath." }
            ]
          }
        ]
      },
      {
        id: 102,
        title: "2. JPA & Hibernate Mapping",
        description: "Persisting data in SQL databases using Jakarta Persistence.",
        moduleOrder: 2,
        submodules: [
          {
            id: 1021,
            title: "JPA Entities Mapping",
            slug: "jpa-entities-mapping",
            submoduleOrder: 1,
            contents: [
              { id: 7, type: "heading", title: "Declaring Entities", headingLevel: 1 },
              { id: 8, type: "text", text: "Jakarta Persistence (JPA) allows mapping Java POJOs (Plain Old Java Objects) directly to SQL tables. Use the @Entity annotation at the class level." },
              {
                id: 9,
                type: "code",
                language: "java",
                code: `@Entity\n@Table(name = "categories")\n@Data\n@NoArgsConstructor\n@AllArgsConstructor\n@Builder\npublic class CategoryEntity {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false, unique = true, length = 100)\n    private String name;\n}`
              },
              { id: 10, type: "callout", title: "Note on Lomboks", text: "Lombok's @Data is excellent for quick development. However, be cautious with circular @ToString or @EqualsAndHashCode in bi-directional relations!" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Mastering JPA & Hibernate",
    slug: "mastering-jpa-hibernate",
    description: "Advanced mapping strategies, query optimization, lazy loading issues, and caching configuration.",
    shortDescription: "Deep dive persistence engineering.",
    level: "Advanced",
    language: "English",
    duration: "18 Hours",
    category: mockCategories[0],
    seoScore: 88,
    totalViews: 2150,
    totalClicks: 310,
    ctr: 14.4,
    isPublished: true,
    modules: [
      {
        id: 201,
        title: "1. Advanced Relationships",
        description: "Mapping @OneToMany, @ManyToOne, and resolving circular references.",
        moduleOrder: 1,
        submodules: [
          {
            id: 2011,
            title: "Resolving Circular Serialization",
            slug: "resolving-circular-serialization",
            submoduleOrder: 1,
            contents: [
              { id: 11, type: "heading", title: "The Jackson Loop Problem", headingLevel: 1 },
              { id: 12, type: "text", text: "When you have bi-directional relations (e.g. Category has Courses, Course has Category), serializing them to JSON directly results in an infinite loop and StackOverflowError." },
              { id: 13, type: "callout", title: "Solution: @JsonIgnore or DTOs", text: "Add @JsonIgnore to the back-reference (usually the parent relation in the child entity) to stop Jackson from serializing it recursively." },
              {
                id: 14,
                type: "code",
                language: "java",
                code: `@ManyToOne(fetch = FetchType.LAZY)\n@JoinColumn(name = "category_id", nullable = false)\n@JsonIgnore  // <-- Breaks circular serialization loop!\nprivate CategoryEntity category;`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "High-Performance Systems",
    slug: "high-performance-systems",
    description: "Master system scaling concepts: Load balancing, caching patterns, sharding, and message queues.",
    shortDescription: "Architecture design for high traffic.",
    level: "Intermediate",
    language: "English",
    duration: "15 Hours",
    category: mockCategories[1],
    seoScore: 96,
    totalViews: 3420,
    totalClicks: 680,
    ctr: 19.8,
    isPublished: true,
    modules: []
  }
];

// Local Storage Keys
const LOCAL_COURSES_KEY = 'geeknito_courses';
const LOCAL_CATEGORIES_KEY = 'geeknito_categories';
const LOCAL_IS_LIVE_API_KEY = 'geeknito_is_live_api';

// Initialize LocalStorage with mock data if not set
if (!localStorage.getItem(LOCAL_CATEGORIES_KEY)) {
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(mockCategories));
}
if (!localStorage.getItem(LOCAL_COURSES_KEY)) {
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(mockCourses));
}

export const getIsLiveApi = (): boolean => {
  return localStorage.getItem(LOCAL_IS_LIVE_API_KEY) === 'true';
};

// API Services
export const categoryServices = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await apiClient.get<Category[]>('/categories', { timeout: 1500 });
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'true');
      return res.data;
    } catch (e) {
      console.warn("Categories API offline, falling back to mock database.");
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
      const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      return local ? JSON.parse(local) : mockCategories;
    }
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const isLive = getIsLiveApi();
    if (isLive) {
      try {
        const res = await apiClient.post<Category>('/categories', category);
        return res.data;
      } catch (err) {
        console.error("API error while creating category, falling back to mock save", err);
      }
    }
    
    // Local fallback save
    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
    const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    const list: Category[] = local ? JSON.parse(local) : [...mockCategories];
    const newCategory: Category = {
      ...category,
      id: Date.now(),
    };
    list.push(newCategory);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
    return newCategory;
  }
};

export const courseServices = {
  getAll: async (): Promise<Course[]> => {
    try {
      const res = await apiClient.get<Course[]>('/courses', { timeout: 1500 });
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'true');
      return res.data;
    } catch (e) {
      console.warn("Courses API offline, falling back to mock database.");
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
      const local = localStorage.getItem(LOCAL_COURSES_KEY);
      return local ? JSON.parse(local) : mockCourses;
    }
  },

  create: async (course: Omit<Course, 'id'>): Promise<Course> => {
    const isLive = getIsLiveApi();
    if (isLive) {
      try {
        const res = await apiClient.post<Course>('/courses', course);
        return res.data;
      } catch (err) {
        console.error("API error while creating course, falling back to mock save", err);
      }
    }
    
    // Local fallback save
    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
    const local = localStorage.getItem(LOCAL_COURSES_KEY);
    const list: Course[] = local ? JSON.parse(local) : [...mockCourses];
    
    // Resolve Category Details in mock mode
    const catLocal = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    const cats: Category[] = catLocal ? JSON.parse(catLocal) : mockCategories;
    const cat = cats.find(c => String(c.id) === String(course.category.id)) || course.category;

    const newCourse: Course = {
      ...course,
      id: Date.now(),
      category: cat,
      totalViews: 0,
      totalClicks: 0,
      ctr: 0.0,
      modules: []
    };
    list.push(newCourse);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
    return newCourse;
  }
};
