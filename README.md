
# Cybersecurity Threat Detection Platform

![Cybersecurity Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)

## 🛡️ Overview

This AI-powered cybersecurity threat detection platform offers real-time monitoring, incident analysis, and integration with major threat intelligence feeds. The interactive dashboard allows you to visualize, analyze, and quickly respond to potential security threats.

## 📸 Screenshots

### Main Dashboard
![Dashboard Overview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)
*Real-time security monitoring dashboard with alerts and analytics*

### Network Traffic Analysis
![Network Analysis](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)
*Detailed network traffic monitoring and anomaly detection*

### Threat Intelligence
![Threat Intel](https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)
*Integration with VirusTotal and OTX for comprehensive threat analysis*

### Global Threat Map
![Threat Map](https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)
*Geographic visualization of attack sources and malicious activities*

### Log Analysis
![Log Analysis](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)
*Advanced log analysis and suspicious activity detection*

## 🔍 Key Features

- **Real-time Monitoring**: Visualization of security alerts and anomalies as they occur
- **Analytics Dashboard**: Intuitive panels and charts for security data visualization
- **Log Analysis**: Upload and analyze log files for suspicious activities
- **OTX Integration**: Check IPs, domains, and hashes against AlienVault's threat intelligence
- **VirusTotal Integration**: Analyze files, URLs, IPs, and domains against multiple antivirus engines
- **Global Threat Map**: Geographic visualization of attack sources and malicious activities
- **Real-time Alerts**: Instant notifications when new threats are detected

## 🔧 Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Data Visualization**: Recharts
- **API Integration**: Axios, Supabase
- **Security Services**: VirusTotal API, AlienVault OTX API

## 📊 Architecture

The project follows a modular architecture consisting of:

- **Presentation Layer**: React components organized by function
- **Service Layer**: Modules for interaction with external APIs (VirusTotal, OTX) and internal services
- **Analysis Layer**: Real-time security data processing and analysis
- **Persistence Layer**: Data storage and caching via Supabase

### Architecture Diagram

```
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   React UI    │◄─────────►│   Analysis    │◄─────────►│ External APIs │
│   Interface   │           │   Services    │           │  (VT, OTX)    │
└───────────────┘           └───────────────┘           └───────────────┘
        ▲                           ▲                           ▲
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   Supabase    │◄─────────►│    Cache &    │◄─────────►│   Real-time   │
│   Storage     │           │     State     │           │   Analysis    │
└───────────────┘           └───────────────┘           └───────────────┘
```

## 🚀 Installation and Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- API keys for VirusTotal and OTX (optional, but recommended for full functionality)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/cybersecurity-platform.git
   cd cybersecurity-platform
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Run the application in development mode:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Access the application at `http://localhost:8080`

## ⚙️ API Configuration

### VirusTotal API

1. Get a free API key at [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Add your API key through the VirusTotal analyzer interface in the dashboard

### AlienVault OTX (Open Threat Exchange)

1. Create an account at [AlienVault OTX](https://otx.alienvault.com/)
2. Get your API key from your user profile
3. Add your API key through the OTX analyzer interface in the dashboard

## 📋 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Dashboard/   # Dashboard-specific components
│   └── ui/          # Base UI components (shadcn)
├── hooks/           # Custom React hooks
├── lib/            # Utilities and helper functions
├── pages/          # Page/route components
├── services/       # API services and integration
│   ├── api/        # Internal API services
│   ├── otx/        # OTX API services
│   └── virusTotal/ # VirusTotal API services
└── types/          # TypeScript type definitions
```

## 🔐 Security

- All API keys are stored only in the client browser
- Integration with Supabase recommended for secure credential storage in production
- Sensitive data is never shared externally

## 🚨 Important Notes

- **API Keys Security**: Make sure your API keys are not exposed in the repository. All keys are stored locally in the browser.
- **Real-time Features**: Some features require Supabase integration for full real-time functionality.
- **Development Mode**: The platform works in demo mode without API keys, using mock data.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

For questions or support, contact us through [LinkedIn](https://www.linkedin.com/in/pamelaascefcazarini/).

---

Developed with ❤️ by [Pâm]
