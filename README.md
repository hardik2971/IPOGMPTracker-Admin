# IPOG Admin Panel

## ✨ Features

- 🎨 Modern fintech-style UI with clean, professional design
- 📊 Comprehensive dashboard with analytics and charts
- 🔐 User & role management (Admin, Sub-admin, Viewer)
- 📦 Product Management with CRUD operations
- 📈 IPO Management (Upcoming, Live, Closed)
- 📁 Category Management
- 💳 Subscription & Plan Management
- 🛒 Orders & Transactions tracking
- 📝 Content Management System (Blogs, Pages, Banners)
- 🔔 Notifications (Push, Email, In-app)
- 📊 Reports & Analytics with export functionality
- ⚙️ Settings (General, Payment Gateway, SEO, Admin Profile)
- 📱 Fully responsive design (Desktop-first, mobile-friendly)
- 🔍 Advanced table features (Search, Pagination, Sorting, Filters)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with ShadCN design patterns
- **Tables**: TanStack Table (React Table v8)
- **Forms**: React Hook Form + Zod (ready for integration)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ipo-g-admin/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── products/          # Product Management
│   ├── ipos/              # IPO Management
│   ├── categories/        # Category Management
│   ├── users/             # User Management
│   ├── subscriptions/     # Subscription Plans
│   ├── orders/            # Orders & Transactions
│   ├── content/           # Content Management
│   ├── notifications/     # Notifications
│   ├── reports/           # Reports & Analytics
│   ├── settings/          # Settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       ├── DataTable.tsx
│       └── Toast.tsx
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── constants.ts       # Constants & menu config
│   └── toast.tsx          # Toast notification system
├── types/
│   └── index.ts           # TypeScript type definitions
└── data/
    └── mockData.ts         # Mock data for development
```

## 🎯 Key Modules

### 1. Dashboard
- Overview cards (Products, IPOs, Users, Revenue)
- IPO performance charts
- User activity graphs
- Revenue trends
- Recent activity log

### 2. Product Management
- Product list with search & filters
- Add/Edit product modal
- Category assignment
- Price & status management
- Image upload support (UI ready)

### 3. IPO Management
- IPO listing with status tracking
- Add/Edit IPO details
- Price band configuration
- Lot size management
- Open/Close date tracking

### 4. User Management
- User list with roles
- Block/Activate users
- Role assignment (Admin, Sub-admin, Viewer)
- Last login tracking

### 5. Subscription Plans
- Plan creation & editing
- Pricing & duration management
- Feature mapping
- Status control

### 6. Orders & Transactions
- Transaction history
- Payment status tracking
- Export functionality
- Filter by date & status

### 7. Content Management
- Blog posts management
- Static pages (About, Terms, Privacy)
- Banner management
- Draft/Published status

### 8. Notifications
- Push notifications
- Email templates
- In-app notifications
- Status tracking

### 9. Reports & Analytics
- Sales reports
- IPO performance reports
- User activity reports
- Export to CSV/PDF

### 10. Settings
- General settings
- Payment gateway configuration
- SEO settings
- Admin profile management

## 🎨 UI/UX Features

- **Color Theme**: Fintech/IPO style with professional blue tones
- **Typography**: Inter font family
- **Icons**: Lucide React icon set
- **Responsive**: Mobile-first approach with desktop optimization
- **Accessibility**: Keyboard navigation, focus states
- **Loading States**: Ready for API integration
- **Toast Notifications**: Success, error, info, warning

## 🔧 Customization

### Adding New Modules

1. Create a new page in `app/[module-name]/page.tsx`
2. Add menu item in `lib/constants.ts`
3. Add route in sidebar menu configuration

### Styling

- Modify `tailwind.config.ts` for theme customization
- Update CSS variables in `app/globals.css` for color scheme
- Component styles use Tailwind utility classes

### Data Integration

- Replace mock data in `data/mockData.ts` with API calls
- Use React Query or SWR for data fetching
- Implement form validation with Zod schemas

## 📝 Next Steps

1. **Connect to Backend API**
   - Replace mock data with API calls
   - Implement authentication
   - Add error handling

2. **Add Form Validation**
   - Integrate Zod schemas with React Hook Form
   - Add client-side validation

3. **Implement File Uploads**
   - Add image upload functionality
   - Integrate with cloud storage (AWS S3, Cloudinary)

4. **Add Authentication**
   - Implement login/logout
   - Add protected routes
   - Role-based access control

5. **Enhance Features**
   - Add bulk actions
   - Implement advanced filters
   - Add export functionality

## 📄 License

Private - IPOG Admin Panel

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for IPOG**
