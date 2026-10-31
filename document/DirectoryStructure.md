src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Sidebar + Topbar, role-aware nav
│   │   ├── dashboard/page.tsx          # Role-based redirect landing
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   ├── page.tsx            # List users (filters, pagination)
│   │   │   │   ├── new/page.tsx        # Create user (role switch form)
│   │   │   │   └── [id]/page.tsx       # Edit user / archive / restore
│   │   │   ├── users/archived/page.tsx
│   │   │   ├── departments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx       # Detail + members
│   │   │   └── settings/page.tsx       # SystemParameter CRUD
│   │   ├── teacher/
│   │   │   ├── profile/page.tsx        # /teachers/me
│   │   │   ├── classes/page.tsx        # /teachers/me/classes
│   │   │   └── students/
│   │   │       ├── page.tsx            # /teachers/me/students
│   │   │       └── [studentId]/page.tsx
│   │   ├── student/
│   │   │   ├── profile/page.tsx        # /students/me
│   │   │   ├── classes/page.tsx
│   │   │   ├── grades/page.tsx
│   │   │   └── attendance/page.tsx
│   │   └── parent/
│   │       └── page.tsx                # Placeholder (children overview)
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── globals.css                     # ← your color themes go here
├── components/
│   ├── ui/                             # Button, Input, Select, Table, Card, Badge, Modal, Pagination, Skeleton
│   ├── layout/                         # Sidebar, Topbar, ThemeToggle, UserMenu
│   ├── admin/                          # UserForm, UserTable, DepartmentForm, SettingForm
│   ├── teacher/                        # StudentTable, ClassCard
│   └── student/                        # GradeList, AttendanceList
├── lib/
│   ├── auth.ts                         # NextAuth config
│   ├── api.ts                          # Axios instance + interceptors
│   ├── queryClient.ts                  # QueryClient + devtools
│   ├── queryKeys.ts                    # Centralized query keys
│   └── utils.ts                        # cn(), formatters
├── hooks/
│   ├── useAuth.ts
│   ├── queries/
│   │   ├── useUsers.ts
│   │   ├── useDepartments.ts
│   │   ├── useSettings.ts
│   │   ├── useTeacher.ts
│   │   └── useStudent.ts
│   └── mutations/
│       ├── useUserMutations.ts
│       ├── useDepartmentMutations.ts
│       └── useSettingMutations.ts
├── types/
│   ├── api.ts                          # ApiResponse<T>, ApiError, Meta
│   ├── user.ts
│   ├── department.ts
│   ├── setting.ts
│   └── next-auth.d.ts                  # module augmentation for session.user.role
└── middleware.ts                       # route protection by role