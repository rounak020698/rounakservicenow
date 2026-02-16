# ServiceNow Incident Management Application

A modern, React-based incident management interface for ServiceNow built with the Now SDK and Fluent DSL.

![ServiceNow](https://img.shields.io/badge/ServiceNow-UI%20Builder%20Style-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Now SDK](https://img.shields.io/badge/Now%20SDK-4.2.0-orange)

## 🚀 Features

### ✨ **Modern React Interface**
- **ServiceNow UI Builder Design**: Authentic ServiceNow styling with brand colors and gradients
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UX**: Clean, intuitive interface matching enterprise standards

### 📋 **Incident Management**
- **Create Incidents**: Comprehensive form with validation and real-time feedback
- **View Incidents**: Dual-view modes (Table & Cards) with filtering capabilities
- **Update Incidents**: Quick actions to resolve or close incidents
- **Live Statistics**: Real-time dashboard with incident counts by status

### 🎯 **Key Capabilities**
- **Table View**: Professional data table with sortable columns and hover effects
- **Card View**: Rich incident cards with highlighted key information
- **Magnifying Glass Integration**: Direct links to ServiceNow native incident forms
- **Advanced Filtering**: Filter by status (All, Active, Resolved, Closed)
- **Manual Refresh**: User-controlled data updates with loading indicators

## 🛠 Technology Stack

- **Frontend**: React 18.2.0 with functional components and hooks
- **Styling**: Custom CSS with ServiceNow UI Builder design patterns
- **Backend**: ServiceNow Table API for CRUD operations
- **Build System**: ServiceNow SDK 4.2.0 with automatic bundling
- **Language**: TypeScript/JavaScript with ServiceNow Fluent DSL

## 📁 Project Structure

```
src/
├── client/                 # React frontend application
│   ├── components/         # Reusable React components
│   │   ├── IncidentForm.jsx    # Incident creation form
│   │   ├── IncidentList.jsx    # Incident list with dual view modes  
│   │   ├── IncidentItem.jsx    # Individual incident card component
│   │   └── *.css              # Component-specific styles
│   ├── services/          # API integration layer
│   │   └── IncidentService.js  # ServiceNow Table API client
│   ├── app.jsx            # Main application component
│   ├── main.jsx           # React application bootstrap
│   └── index.html         # HTML entry point
├── fluent/                # ServiceNow metadata definitions
│   ├── ui-pages/          # UI Page definitions in Fluent DSL
│   └── index.now.ts       # Main fluent exports
└── server/                # Server-side configurations
```

## 🚀 Quick Start

### Prerequisites
- ServiceNow Developer Instance
- Node.js 16+ and npm
- ServiceNow SDK CLI tools

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/rounak020698/rounakservicenow.git
cd rounakservicenow
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure ServiceNow connection:**
Update `now.config.json` with your instance details:
```json
{
  "name": "Incident Man",
  "scope": "x_1835748_incident", 
  "description": "Modern incident form interface built with React components"
}
```

4. **Build the application:**
```bash
npm run build
```

5. **Deploy to ServiceNow:**
```bash
npm run deploy
```

## 📖 Usage

### Accessing the Application
After deployment, access your application at:
```
https://[your-instance].service-now.com/x_1835748_incident_form.do
```

### Creating Incidents
1. Click "Create Incident" tab
2. Fill in the incident details:
   - **Short Description** (required)
   - **Detailed Description** 
   - **Category, Priority, Impact, Urgency**
   - **Caller ID and Assignment Group**
3. Click "Create Incident"

### Viewing Incidents
1. Click "View Incidents" tab
2. Use filters to find specific incidents
3. Toggle between Table and Card views
4. Click magnifying glass icons to view full incident details
5. Use Resolve/Close buttons for quick actions

## 🎨 Design Features

### ServiceNow UI Builder Style
- **Authentic Colors**: ServiceNow blue gradients (`#0073e7` to `#004c9b`)
- **Professional Typography**: Source Sans Pro font family
- **State Colors**: Official ServiceNow status color coding
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Layout**: Grid systems and flexible containers

### Component Architecture
- **Modular Design**: Self-contained components with single responsibilities
- **CSS Organization**: Component-specific stylesheets
- **Props-Based**: Clean data flow between parent and child components
- **Error Handling**: Comprehensive error states and user feedback

## 🔧 Development

### Available Scripts
```bash
npm run build      # Build the ServiceNow application
npm run deploy     # Deploy to ServiceNow instance
npm run transform  # Transform Fluent code
npm run types      # Generate TypeScript types
```

### Key Components

#### IncidentService.js
Handles all ServiceNow Table API interactions:
- `list()` - Fetch incidents with display values
- `create()` - Create new incidents
- `update()` - Update existing incidents
- `get()` - Fetch single incident details

#### React Components
- **App.jsx**: Main application with navigation
- **IncidentForm.jsx**: Comprehensive incident creation form
- **IncidentList.jsx**: Dual-view incident listing with filtering
- **IncidentItem.jsx**: Individual incident card with actions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ServiceNow Platform Team for the Now SDK
- React Team for the excellent framework
- ServiceNow Design System for UI/UX patterns

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check ServiceNow Developer Documentation
- Review Now SDK documentation

---

**Built with ❤️ for ServiceNow Development**