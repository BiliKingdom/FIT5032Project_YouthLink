# YouthLink Technical Documentation

## Architecture Overview

YouthLink is a modern single-page application (SPA) built with Vue 3, TypeScript, and Firebase. The application follows a modular architecture with clear separation of concerns.

### Technology Stack

**Frontend:**
- Vue 3.5+ (Composition API)
- TypeScript 5.8+
- Vite 7.0+ (Build tool)
- Bootstrap 5.3+ (UI framework)
- PrimeVue 4.3+ (Advanced UI components)

**Backend:**
- Firebase Authentication
- Cloud Firestore (Database)
- Firebase Cloud Functions (Server-side logic)

**Charts & Visualization:**
- Chart.js 4.5+
- Vue-ChartJS 5.3+

**Data Export:**
- PapaParse (CSV export)
- jsPDF + jsPDF-AutoTable (PDF export)

**Maps:**
- Leaflet 1.9+
- OpenStreetMap

**Calendar:**
- FullCalendar 6.1+

## Project Structure

```
youthlink/
├── src/
│   ├── assets/              # Static assets (images, styles)
│   ├── components/          # Reusable Vue components
│   │   ├── accessibility/   # Accessibility components
│   │   ├── charts/          # Chart components
│   │   ├── export/          # Export components
│   │   ├── icons/           # Icon components
│   │   ├── loading/         # Loading components
│   │   ├── notifications/   # Notification components
│   │   └── tables/          # Table components
│   ├── composables/         # Reusable composition functions
│   ├── config/              # Configuration files
│   ├── router/              # Vue Router configuration
│   ├── services/            # Business logic & API services
│   │   ├── charts/          # Chart data services
│   │   ├── export/          # Export services
│   │   └── tables/          # Table data services
│   ├── stores/              # Pinia state management
│   ├── utils/               # Utility functions
│   ├── views/               # Page components
│   │   ├── admin/           # Admin pages
│   │   └── auth/            # Authentication pages
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── public/                  # Static public files
├── dist/                    # Production build output
├── firestore.rules          # Firestore security rules
└── package.json             # Dependencies & scripts
```

## Key Features & Implementation

### 1. Interactive Data Tables (BR D.3)

**Components:**
- `src/components/tables/BaseDataTable.vue` - Reusable table component
- `src/composables/useDataTable.ts` - Table logic composable

**Features:**
- Column sorting (ascending/descending)
- Global search across all columns
- Per-column filtering
- Pagination (10 rows per page)
- Empty states and loading indicators

**Usage:**
```vue
<BaseDataTable
  :columns="columns"
  :data="paginatedData"
  :model-value="tableState"
  :total-records="totalRecords"
  @sort="onSort"
  @filter="onFilter"
/>
```

### 2. Data Export (BR E.4)

**Services:**
- `src/services/export/csvExportService.ts` - CSV export with PapaParse
- `src/services/export/pdfExportService.ts` - PDF export with jsPDF

**Features:**
- Export to CSV with custom formatting
- Export to PDF with professional layout
- Column selection
- Data filtering before export
- Automatic file naming with timestamps

**Usage:**
```typescript
import { useDataExport } from '@/composables/useDataExport'

const { exportToCSV, exportToPDF } = useDataExport()

// Export to CSV
exportToCSV(data, columns, 'filename')

// Export to PDF
exportToPDF(data, columns, 'Report Title', 'filename')
```

### 3. Interactive Charts (BR F.1)

**Components:**
- `src/components/charts/LineChart.vue`
- `src/components/charts/BarChart.vue`
- `src/components/charts/PieChart.vue`

**Service:**
- `src/services/charts/chartDataService.ts` - Data aggregation

**Charts Implemented:**
1. User Registration Trend (Line chart)
2. Monthly Appointments (Bar chart)
3. Appointments by Service Type (Horizontal bar)
4. Appointment Status Distribution (Pie chart)
5. Users by Role (Pie chart)

**Usage:**
```vue
<LineChart
  :labels="monthLabels"
  :data="registrationData"
  label="New Users"
/>
```

### 4. Accessibility Features (BR E.3)

**WCAG 2.1 AA Compliance:**

**Components:**
- `src/components/accessibility/SkipNavigation.vue` - Skip to main content
- `src/components/accessibility/LiveRegion.vue` - Screen reader announcements

**Composables:**
- `src/composables/useKeyboardNavigation.ts` - Keyboard shortcuts
- `src/composables/useFocusTrap.ts` - Focus management
- `src/composables/useScreenReader.ts` - Screen reader support

**Features:**
- Keyboard navigation (Tab, Enter, Arrow keys, Escape)
- Focus indicators (3px blue outline)
- ARIA labels and landmarks
- Skip navigation link
- Semantic HTML structure
- Color contrast ratios (4.5:1 minimum)
- Screen reader announcements for dynamic content

### 5. Authentication (BR D.1)

**Implementation:**
- Firebase Authentication with email/password
- Role-based access control (user, admin)
- Protected routes with navigation guards
- Session persistence

**Store:**
- `src/stores/auth.ts` - Pinia store for auth state

**Routes:**
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/account` - User profile (protected)
- `/admin/*` - Admin pages (admin only)

### 6. Appointment Booking (BR F.1)

**Component:**
- `src/views/CourseBooking.vue` - Calendar-based booking

**Features:**
- FullCalendar integration
- Date/time selection
- Service type selection
- Urgency level
- Email confirmations (ready for SendGrid)

### 7. Geographic Map (BR E.2)

**Component:**
- `src/views/SupportMap.vue` - Interactive map

**Features:**
- Leaflet + OpenStreetMap
- Service location markers
- Click for details
- Filter by service type
- Geolocation support

## State Management

### Pinia Stores

**Auth Store (`src/stores/auth.ts`):**
```typescript
interface User {
  id: string
  email: string
  displayName: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
}
```

**Actions:**
- `login(email, password)` - Authenticate user
- `register(email, password, displayName)` - Create account
- `logout()` - Sign out
- `updateProfile(data)` - Update user profile

## API Services

### Firestore Service (`src/services/firestore.ts`)

**Collections:**
- `users` - User profiles
- `appointments` - Appointment bookings
- `resources` - Mental health resources
- `service_locations` - Service providers
- `courses` - Training courses
- `contact_submissions` - Contact form entries

**Standard Interface:**
```typescript
interface ServiceResult<T> {
  success: boolean
  data?: T
  error?: string
}
```

**Common Methods:**
- `getAll()` - Fetch all documents
- `getById(id)` - Fetch single document
- `create(data)` - Create document
- `update(id, data)` - Update document
- `delete(id)` - Delete document

### Chart Data Service (`src/services/charts/chartDataService.ts`)

**Methods:**
- `getUserRegistrationTrend(months)` - User signup data
- `getAppointmentsByService()` - Service breakdown
- `getAppointmentsByStatus()` - Status distribution
- `getMonthlyAppointments(months)` - Time series data
- `getUsersByRole()` - Role distribution

## Composables (Reusable Logic)

### Data Management
- `useDataTable<T>` - Table state & operations
- `useDataExport` - Export functionality
- `useChartData` - Chart data loading

### Accessibility
- `useKeyboardNavigation` - Keyboard event handling
- `useFocusTrap` - Focus management in modals
- `useScreenReader` - Announcements for screen readers

### UI/UX
- `useNotifications` - Toast notifications
- Global notification system

## Routing

### Public Routes
- `/` - Home page
- `/info` - Mental health information
- `/info/:slug` - Topic details
- `/support/map` - Service locations map
- `/resources/list` - Resources library
- `/resources/:id` - Resource details
- `/involved` - Get involved page
- `/about` - About page
- `/contact` - Contact form
- `/accessibility` - Accessibility statement

### Protected Routes (Authentication Required)
- `/account` - User profile
- `/courses/book` - Course booking

### Admin Routes (Admin Role Required)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/appointments` - Appointments management
- `/admin/courses` - Course management
- `/admin/analytics` - Analytics dashboard

### Authentication Routes (Guest Only)
- `/auth/login` - Login
- `/auth/register` - Registration

## Security

### Firebase Security Rules

**Firestore Rules Pattern:**
```javascript
match /collection/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth.uid == resource.data.userId;
  allow delete: if isAdmin();
}

function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

### Input Validation
- Client-side validation with Vue
- Server-side validation in Firestore rules
- XSS protection (sanitization ready)

### Authentication
- Firebase Auth with secure token management
- Password requirements enforced
- Session timeout
- Protected API endpoints

## Performance Optimization

### Code Splitting
- Route-level code splitting
- Dynamic imports for large dependencies

### Asset Optimization
- Image lazy loading
- SVG icons (Lucide)
- Optimized fonts

### Caching Strategy
- Service worker ready
- Browser caching headers
- Firestore offline persistence

## Testing

### Unit Tests
```bash
npm run test:unit
```

Location: `src/components/__tests__/`

### E2E Tests
```bash
npm run test:e2e
```

Configuration: `playwright.config.ts`

## Build & Development

### Development
```bash
npm run dev
```
- Hot module replacement
- Development server on http://localhost:5173

### Production Build
```bash
npm run build
```
- TypeScript type checking
- Minification
- Tree shaking
- Asset optimization

### Preview Production Build
```bash
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **Third-party content**: Some embedded content may not be fully accessible
2. **Offline support**: Limited offline functionality (Firestore cache only)
3. **File uploads**: Not implemented yet
4. **Real-time notifications**: WebSocket notifications not implemented

## Future Enhancements

- [ ] Email service integration (SendGrid)
- [ ] Firebase Cloud Functions deployment
- [ ] GenAI chatbot (Gemini API)
- [ ] Push notifications
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support (i18n)
- [ ] Advanced search with Algolia
- [ ] Video consultation integration
- [ ] Mobile app (React Native / Flutter)

## Contributing

See `CONTRIBUTING.md` for guidelines.

## License

Proprietary - MindWell NFP © 2025

## Support

- Documentation: https://youthlink.org/docs
- Issues: https://github.com/your-org/youthlink/issues
- Email: support@youthlink.org
