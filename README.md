# YouthLink - Mental Health Support Platform

A comprehensive web application providing mental health resources, support services, and appointment booking for young people in Australia.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)
![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA-blue)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Functionality](#key-functionality)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

YouthLink is a not-for-profit platform developed by MindWell NFP to support youth mental health and wellbeing through technology. The platform provides:

- **Mental Health Information**: Comprehensive resources on various mental health topics
- **Service Locator**: Interactive map to find nearby support services
- **Appointment Booking**: Calendar-based booking system for consultations
- **Resource Library**: Curated collection of mental health resources
- **Community Engagement**: Ways to get involved and support the cause

## Features

### Core Features

✅ **User Authentication** (BR D.1)
- Firebase Authentication with email/password
- Role-based access control (User, Admin)
- Secure session management

✅ **Interactive Map** (BR E.2)
- Leaflet-based interactive map
- Service location markers with details
- Filter by service type
- Geolocation support

✅ **Data Tables** (BR D.3)
- Sortable columns
- Global and column-specific search
- Pagination (10 rows per page)
- Real-time filtering

✅ **Data Export** (BR E.4)
- Export to CSV (PapaParse)
- Export to PDF with professional formatting (jsPDF)
- Custom column selection
- Automatic timestamping

✅ **Accessibility** (BR E.3)
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Skip navigation links
- High contrast focus indicators
- Semantic HTML structure

✅ **Innovation Features** (BR F.1)
- **Interactive Charts**: 5 chart types with Chart.js (Line, Bar, Pie)
- **Appointment Calendar**: FullCalendar integration
- **Analytics Dashboard**: Real-time data visualization
- **Toast Notifications**: User-friendly feedback system

### Admin Features

- **Dashboard**: Overview of system statistics
- **User Management**: View, edit, and manage user accounts
- **Appointments Management**: Track and update appointment bookings
- **Course Management**: Create and manage training courses
- **Analytics**: Interactive charts and reports

## Technology Stack

### Frontend
- **Framework**: Vue 3.5+ (Composition API, TypeScript)
- **Build Tool**: Vite 7.0+
- **UI Framework**: Bootstrap 5.3+ & PrimeVue 4.3+
- **State Management**: Pinia
- **Routing**: Vue Router 4

### Backend
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Functions**: Firebase Cloud Functions (ready)

### Libraries
- **Maps**: Leaflet 1.9+
- **Calendar**: FullCalendar 6.1+
- **Charts**: Chart.js 4.5+ & Vue-ChartJS 5.3+
- **Export**: PapaParse (CSV), jsPDF (PDF)
- **Icons**: Lucide Vue Next

## Getting Started

### Prerequisites

- Node.js 20.19.0 or 22.12.0+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/youthlink.git
cd youthlink
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Initialize the database**

Run the application and navigate to `/admin` after registering the first user. Manually set the user's role to `admin` in Firestore.

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:5173

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
youthlink/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable Vue components
│   │   ├── accessibility/   # WCAG compliance components
│   │   ├── charts/          # Chart.js components
│   │   ├── export/          # Export functionality
│   │   ├── loading/         # Loading states
│   │   ├── notifications/   # Toast notifications
│   │   └── tables/          # Data table components
│   ├── composables/         # Composition API hooks
│   ├── config/              # Configuration files
│   ├── router/              # Vue Router setup
│   ├── services/            # Business logic & API calls
│   │   ├── charts/          # Chart data services
│   │   ├── export/          # Export services
│   │   └── tables/          # Table data services
│   ├── stores/              # Pinia stores
│   ├── utils/               # Utility functions
│   ├── views/               # Page components
│   │   ├── admin/           # Admin pages
│   │   └── auth/            # Authentication pages
│   ├── App.vue              # Root component
│   └── main.ts              # Entry point
├── public/                  # Public static files
├── firestore.rules          # Firestore security rules
├── DEPLOYMENT.md            # Deployment guide
├── TECHNICAL_DOCUMENTATION.md # Technical docs
└── package.json             # Dependencies
```

## Key Functionality

### Data Tables

Interactive tables with:
- Column sorting (ascending/descending)
- Global search
- Per-column filtering
- Pagination
- Empty states

```vue
<BaseDataTable
  :columns="columns"
  :data="tableData"
  :model-value="tableState"
  @sort="onSort"
  @filter="onFilter"
/>
```

### Data Export

Export data to CSV or PDF:

```typescript
import { useDataExport } from '@/composables/useDataExport'

const { exportToCSV, exportToPDF } = useDataExport()

// Export to CSV
exportToCSV(data, columns, 'users')

// Export to PDF
exportToPDF(data, columns, 'User Report', 'users')
```

### Interactive Charts

5 chart types available:

```vue
<LineChart :labels="labels" :data="data" label="New Users" />
<BarChart :labels="labels" :data="data" />
<PieChart :labels="labels" :data="data" :colors="colors" />
```

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape, Arrows)
- **Screen Reader**: ARIA labels and live regions
- **Focus Management**: Visible focus indicators (3px outline)
- **Skip Navigation**: Skip to main content link
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Business Requirements Coverage

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| BR D.1: External Auth | ✅ Complete | Firebase Authentication |
| BR D.2: Email Service | 🔄 Ready | SendGrid integration ready |
| BR D.3: Interactive Tables | ✅ Complete | Custom table component + composable |
| BR D.4: Cloud Deployment | ✅ Ready | Firebase Hosting ready |
| BR E.1: Cloud Functions | 🔄 Ready | Firebase Functions structure |
| BR E.2: Geo Location | ✅ Complete | Leaflet + OpenStreetMap |
| BR E.3: Accessibility | ✅ Complete | WCAG 2.1 AA compliant |
| BR E.4: Data Export | ✅ Complete | CSV & PDF export |
| BR F.1: Innovation | ✅ Complete | Charts, Calendar, Analytics |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Firebase

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Testing

### Unit Tests
```bash
npm run test:unit
```

### End-to-End Tests
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Linting
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

YouthLink is committed to digital accessibility. The platform conforms to WCAG 2.1 Level AA standards:

- Keyboard navigable
- Screen reader compatible
- High contrast support
- Focus visible indicators
- Semantic HTML structure

See [Accessibility Statement](/accessibility) for details.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- **Technical Documentation**: [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Documentation**: Coming soon
- **User Guide**: Coming soon

## Support

- **Email**: support@youthlink.org
- **Documentation**: https://youthlink.org/docs
- **Issues**: https://github.com/your-org/youthlink/issues

### Emergency Resources

If you're in crisis:
- **Lifeline**: 13 11 14 (24/7)
- **Kids Helpline**: 1800 55 1800 (24/7)
- **Beyond Blue**: 1300 22 4636 (24/7)

## License

Proprietary - MindWell NFP © 2025. All rights reserved.

## Acknowledgments

- MindWell NFP team
- Youth mental health advocates
- Open source community
- Firebase team
- Vue.js team

---

**Made with ❤️ by MindWell NFP**

Supporting youth mental health through technology.
