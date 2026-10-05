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
  { id: 1, name: "Web Development", icon: "code", description: "Frontend UI/UX, HTML, CSS, Javascript, React, and modern client-side architectures.", color: "#0284c7", isActive: true },
  { id: 2, name: "Backend Engineering", icon: "server", description: "Robust server logic, databases, APIs, microservices, and system integrations.", color: "#b91c1c", isActive: true },
  { id: 3, name: "Data Science", icon: "database", description: "Machine learning models, statistics, big data pipelines, and analytics.", color: "#047857", isActive: true },
  { id: 4, name: "System Architecture", icon: "git-branch", description: "Distributed systems design, scale topologies, network infrastructure, and resilience.", color: "#6d28d9", isActive: true },
  { id: 5, name: "DevOps", icon: "terminal", description: "Continuous integration, container orchestration, cloud deployment, and GitOps.", color: "#d97706", isActive: true },
  { id: 6, name: "QA & Testing", icon: "cpu", description: "Automation frameworks, integration unit tests, and performance benchmarks.", color: "#475569", isActive: true }
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Spring Boot Masterclass",
    slug: "spring-boot-masterclass",
    description: "Learn how to build production-grade backend APIs from scratch with Java, JPA, and Spring Boot.",
    shortDescription: "Master backend persistence and Java API design.",
    level: "Intermediate",
    language: "English",
    duration: "9 Hours",
    category: mockCategories[1],
    seoScore: 92,
    totalViews: 1450,
    totalClicks: 198,
    ctr: 13.6,
    isPublished: true,
    isFeatured: true,
    isActive: true,
    modules: [
      {
        id: 101,
        title: "1. Introduction to Spring Boot",
        description: "Understanding the IoC container, bean lifecycle, and project setup.",
        moduleOrder: 1,
        submodules: [
          {
            id: 1011,
            title: "What is Spring Boot?",
            slug: "what-is-spring-boot",
            submoduleOrder: 1,
            contents: [
              { id: 1, type: "heading", title: "Introduction to Spring Boot Concepts", headingLevel: 1 },
              { id: 2, type: "text", text: "Spring Boot makes it easy to create stand-alone, production-grade Spring-based Applications that you can run. It takes an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss." },
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
            title: "Project Setup & Structure",
            slug: "project-setup-structure",
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
              { id: 8, type: "text", text: "Jakarta Persistence (JPA) allows mapping Java POJOs (Plain Old Java Objects) directly to SQL tables. Use the @Entity annotation at the class level." }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "React & TypeScript Deep Dive",
    slug: "react-typescript-deep-dive",
    description: "Build high-performance web applications using modern React patterns, hooks, context, and TypeScript.",
    shortDescription: "Advanced state and UI systems.",
    level: "Advanced",
    language: "English",
    duration: "15 Hours",
    category: mockCategories[0],
    seoScore: 88,
    totalViews: 2450,
    totalClicks: 320,
    ctr: 13.0,
    isPublished: true,
    isFeatured: true,
    isActive: true,
    modules: []
  },
  {
    id: 3,
    title: "Python Data Science Bootcamp",
    slug: "python-data-science",
    description: "Learn Python data analysis, pandas, numpy, visualization, and machine learning models from scratch.",
    shortDescription: "Complete data science pathway.",
    level: "Beginner",
    language: "English",
    duration: "30 Hours",
    category: mockCategories[2],
    seoScore: 95,
    totalViews: 3120,
    totalClicks: 450,
    ctr: 14.4,
    isPublished: true,
    isFeatured: false,
    isActive: true,
    modules: []
  },
  {
    id: 4,
    title: "Kubernetes for Production",
    slug: "kubernetes-production",
    description: "Architect and manage production-ready Kubernetes clusters, Helm charts, service meshes, and GitOps.",
    shortDescription: "Scale infrastructure orchestration.",
    level: "Advanced",
    language: "English",
    duration: "20 Hours",
    category: mockCategories[4],
    seoScore: 91,
    totalViews: 1820,
    totalClicks: 210,
    ctr: 11.5,
    isPublished: false,
    isFeatured: false,
    isActive: true,
    modules: []
  },
  {
    id: 5,
    title: "System Design Fundamentals",
    slug: "system-design-fundamentals",
    description: "Learn how to design scalable, fault-tolerant distributed systems, databases, caching, and CDNs.",
    shortDescription: "Scalability and microservices.",
    level: "Advanced",
    language: "English",
    duration: "12 Hours",
    category: mockCategories[3],
    seoScore: 96,
    totalViews: 2950,
    totalClicks: 390,
    ctr: 13.2,
    isPublished: true,
    isFeatured: false,
    isActive: true,
    modules: []
  },
  {
    id: 6,
    title: "GraphQL API Development",
    slug: "graphql-api-development",
    description: "Build schemas, queries, mutations, resolvers, and subscriptions using GraphQL and Apollo server.",
    shortDescription: "Declarative backend data query.",
    level: "Intermediate",
    language: "English",
    duration: "8 Hours",
    category: mockCategories[1],
    seoScore: 85,
    totalViews: 1100,
    totalClicks: 145,
    ctr: 13.1,
    isPublished: false,
    isFeatured: false,
    isActive: true,
    modules: []
  }
];

// Local Storage Keys
const LOCAL_COURSES_KEY = 'xebia_lms_courses';
const LOCAL_CATEGORIES_KEY = 'xebia_lms_categories';
const LOCAL_IS_LIVE_API_KEY = 'xebia_lms_is_live_api';

// Initialize LocalStorage with mock data and handle forced overrides to match screenshots
const DB_VERSION_KEY = 'xebia_lms_db_version';
const CURRENT_VERSION = '3'; // Force update trigger

if (localStorage.getItem(DB_VERSION_KEY) !== CURRENT_VERSION) {
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(mockCategories));
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(mockCourses));
  localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
} else {
  // Safe fallbacks if keys are somehow missing
  if (!localStorage.getItem(LOCAL_CATEGORIES_KEY)) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem(LOCAL_COURSES_KEY)) {
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(mockCourses));
  }
}

let lastProbeTime = 0;
const PROBE_INTERVAL = 10000; // 10 seconds

const probeApiInBackground = async () => {
  const now = Date.now();
  if (now - lastProbeTime < PROBE_INTERVAL) return;
  lastProbeTime = now;
  try {
    await axios.get(`${API_BASE_URL}/categories`, { timeout: 1000 });
    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'true');
    console.log("Backend API detected. Switching to live mode.");
  } catch (e) {
    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
  }
};

let isProbed = false;

export const getIsLiveApi = (): boolean => {
  if (!isProbed) {
    isProbed = true;
    probeApiInBackground();
    return false; // Fast path for first load
  }
  return localStorage.getItem(LOCAL_IS_LIVE_API_KEY) === 'true';
};

// API Services
export const categoryServices = {
  getAll: async (): Promise<Category[]> => {
    if (!getIsLiveApi()) {
      probeApiInBackground();
      const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      return local ? JSON.parse(local) : mockCategories;
    }

    try {
      const res = await apiClient.get<Category[]>('/categories', { timeout: 1500 });
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'true');
      
      const categories = res.data;

      // Fetch local courses to see if there are any locally created courses
      const localCoursesRaw = localStorage.getItem(LOCAL_COURSES_KEY);
      const localCourses: Course[] = localCoursesRaw ? JSON.parse(localCoursesRaw) : [];
      const localCreatedCourses = localCourses.filter((c: any) => c.isLocal === true);

      // Fetch local categories
      const localCatsRaw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      const localCats: Category[] = localCatsRaw ? JSON.parse(localCatsRaw) : [];
      const localCreatedCats = localCats.filter((c: any) => c.isLocal === true);

      // Merge local categories
      const mergedCategories = [...categories];
      localCreatedCats.forEach(localCat => {
        const exists = categories.some(c => 
          c.id === localCat.id || 
          c.name.toLowerCase() === localCat.name.toLowerCase()
        );
        if (!exists) {
          mergedCategories.push(localCat);
        }
      });

      // Inject local courses into category course lists
      return mergedCategories.map(cat => {
        const matchingLocalCourses = localCreatedCourses.filter(c => {
          const cCatId = c.category && typeof c.category === 'object' ? c.category.id : c.category;
          return String(cCatId) === String(cat.id);
        });

        if (matchingLocalCourses.length > 0) {
          const existingCourses = (cat as any).courses || [];
          const merged = [...existingCourses];
          matchingLocalCourses.forEach(lc => {
            if (!merged.some(ec => ec.id === lc.id || ec.slug === lc.slug)) {
              merged.push(lc);
            }
          });
          return {
            ...cat,
            courses: merged
          };
        }
        return cat;
      });
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
      isLocal: true // Tag as local so we can merge it
    } as any;
    list.push(newCategory);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
    return newCategory;
  },

  update: async (id: number, category: Category): Promise<Category> => {
    const isLive = getIsLiveApi();
    if (isLive) {
      try {
        const res = await apiClient.post<Category>('/categories', category);
        return res.data;
      } catch (err) {
        console.error("API error while updating category, falling back to mock save", err);
      }
    }

    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
    const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    let list: Category[] = local ? JSON.parse(local) : [...mockCategories];
    
    const existing = list.find(c => String(c.id) === String(id));
    const isLocal = existing ? (existing as any).isLocal : false;

    const updatedCategory = {
      ...category,
      id,
      isLocal
    };

    list = list.map(c => String(c.id) === String(id) ? updatedCategory : c);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
    return updatedCategory;
  },

  delete: async (id: number): Promise<void> => {
    const isLive = getIsLiveApi();
    const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    let list: Category[] = local ? JSON.parse(local) : [...mockCategories];
    const target = list.find(c => String(c.id) === String(id));
    
    if (target && isLive) {
      try {
        await apiClient.post<Category>('/categories', { ...target, isActive: false });
      } catch (err) {
        console.error("API error soft-deleting category", err);
      }
    }

    list = list.filter(c => String(c.id) !== String(id));
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
  }
};

export const courseServices = {
  getAll: async (): Promise<Course[]> => {
    if (!getIsLiveApi()) {
      probeApiInBackground();
      const local = localStorage.getItem(LOCAL_COURSES_KEY);
      return local ? JSON.parse(local) : mockCourses;
    }

    try {
      const [catsRes, coursesRes] = await Promise.all([
        apiClient.get<Category[]>('/categories', { timeout: 1500 }),
        apiClient.get<Course[]>('/courses', { timeout: 1500 })
      ]);
      localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'true');

      const categories = catsRes.data;
      const courses = coursesRes.data;

      // Build a map of courseId -> Category from categories' courses list
      const courseIdToCategoryMap = new Map<number, Category>();
      categories.forEach(cat => {
        const catCourses = (cat as any).courses || [];
        catCourses.forEach((c: any) => {
          courseIdToCategoryMap.set(c.id, cat);
        });
      });

      // Enrich backend courses with their category details
      const enrichedCourses = courses.map(course => {
        const cat = courseIdToCategoryMap.get(course.id) || course.category;
        return {
          ...course,
          category: cat
        };
      });

      // Retrieve locally created courses
      const localCoursesRaw = localStorage.getItem(LOCAL_COURSES_KEY);
      const localCourses: Course[] = localCoursesRaw ? JSON.parse(localCoursesRaw) : [];
      const localCreatedCourses = localCourses.filter((c: any) => c.isLocal === true);

      // Merge local courses
      const mergedCourses = [...enrichedCourses];
      localCreatedCourses.forEach(localCourse => {
        const exists = enrichedCourses.some(ec => 
          ec.id === localCourse.id || 
          ec.slug === localCourse.slug || 
          ec.title.toLowerCase() === localCourse.title.toLowerCase()
        );
        if (!exists) {
          mergedCourses.push(localCourse);
        }
      });

      return mergedCourses;
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
        const savedCourse = res.data;

        // Fetch categories to find details for the new course's category
        const cats = await categoryServices.getAll();
        const cat = cats.find(c => String(c.id) === String(course.category.id)) || course.category;

        return {
          ...savedCourse,
          category: cat
        };
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
      totalViews: Math.floor(Math.random() * 2000) + 500,
      totalClicks: Math.floor(Math.random() * 300) + 50,
      ctr: 0.0,
      modules: [],
      isLocal: true // Tag as local so we can merge it
    } as any;
    newCourse.ctr = newCourse.totalViews ? parseFloat(((newCourse.totalClicks! / newCourse.totalViews) * 100).toFixed(1)) : 0;
    list.push(newCourse);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
    return newCourse;
  },

  update: async (id: number, course: Course): Promise<Course> => {
    const isLive = getIsLiveApi();
    if (isLive) {
      try {
        const res = await apiClient.post<Course>('/courses', course);
        const savedCourse = res.data;

        const cats = await categoryServices.getAll();
        const cat = cats.find(c => String(c.id) === String(course.category.id)) || course.category;

        return {
          ...savedCourse,
          category: cat
        };
      } catch (err) {
        console.error("API error while updating course, falling back to mock save", err);
      }
    }

    localStorage.setItem(LOCAL_IS_LIVE_API_KEY, 'false');
    const local = localStorage.getItem(LOCAL_COURSES_KEY);
    let list: Course[] = local ? JSON.parse(local) : [...mockCourses];
    
    const existing = list.find(c => String(c.id) === String(id));
    const isLocal = existing ? (existing as any).isLocal : false;

    const updatedCourse = {
      ...course,
      id,
      isLocal
    };

    list = list.map(c => String(c.id) === String(id) ? updatedCourse : c);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
    return updatedCourse;
  },

  delete: async (id: number): Promise<void> => {
    const isLive = getIsLiveApi();
    const local = localStorage.getItem(LOCAL_COURSES_KEY);
    let list: Course[] = local ? JSON.parse(local) : [...mockCourses];
    const target = list.find(c => String(c.id) === String(id));

    if (target && isLive) {
      try {
        await apiClient.post<Course>('/courses', { ...target, isActive: false });
      } catch (err) {
        console.error("API error soft-deleting course", err);
      }
    }

    list = list.filter(c => String(c.id) !== String(id));
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(list));
  }
};
