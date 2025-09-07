# 🚀 Gojira

**Gojira** is a modern desktop application for project management and development tools, built with Tauri, React, and TypeScript. It provides a powerful, secure, and intuitive interface for managing your development workflow with integrated JIRA connectivity.

## ✨ Key Features

### 🎨 **Modern Interface**
- **Multi-theme Support**: Light, Dark, and System-adaptive themes
- **Internationalization**: Multi-language support with React i18next
- **Responsive Design**: Optimized layout that works across different screen sizes
- **Tailwind CSS**: Modern styling with Tailwind CSS v4

### 🔧 **Development Tools**
- **Dashboard**: Centralized overview of your projects and metrics
- **Development Environment**: Tools for monitoring and managing development processes
- **History Tracking**: Keep track of project changes and progress
- **Performance Monitoring**: Real-time monitoring of application performance

### 🔐 **JIRA Integration**
Secure and seamless integration with Atlassian JIRA for enhanced project management:

#### **Security First**
- **Native Keyring Storage**: Credentials are stored securely in your system's native keyring (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- **Smart Fallback**: In WSL2 environments, uses encrypted local files when keyring is unavailable
- **AES-256-GCM Encryption**: Additional encryption layer for all stored credentials
- **Token Masking**: JIRA tokens are never displayed in the interface
- **HTTPS Only**: All connections to JIRA are encrypted and validated
- **Environment Detection**: Automatically detects WSL2, keyring availability, and adjusts security accordingly

#### **JIRA Features**
- **Easy Configuration**: Simple setup form with real-time validation
- **Connection Testing**: Test your JIRA connectivity before saving credentials
- **Project Access**: Retrieve and display your JIRA projects
- **Issue Management**: Search and manage JIRA issues with JQL support
- **User Information**: Access current user details and permissions
- **Automatic Updates**: Track usage and maintain connection status

#### **Configuration Process**
1. **Navigate to Settings**: Go to the Settings page in the application
2. **JIRA Configuration**: Find the dedicated JIRA section at the top
3. **Enter Credentials**:
   - JIRA Instance URL (e.g., `https://company.atlassian.net`)
   - Email address associated with your JIRA account
   - API Token (generated from your Atlassian account)
4. **Test Connection**: Verify your credentials work correctly
5. **Save Securely**: Credentials are encrypted and stored in your system's keyring

#### **Supported JIRA Operations**
- Authenticate with JIRA Cloud instances
- Retrieve current user information
- List accessible projects
- Search issues using JQL (JIRA Query Language)
- Maintain secure session management

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React i18next**: Internationalization framework
- **Tabler Icons**: Beautiful and consistent icon set

### **Backend Stack**
- **Rust**: High-performance, memory-safe systems language
- **Tauri**: Secure and lightweight desktop application framework
- **Keyring**: Native credential storage integration
- **AES-GCM**: Advanced encryption for sensitive data
- **Argon2**: Password hashing and key derivation
- **Reqwest**: HTTP client for JIRA API communication

### **Security Architecture**
- **Multi-layer Encryption**: System keyring + AES-256-GCM encryption
- **Secure Communication**: HTTPS-only API calls with proper authentication
- **Token Management**: Secure storage and automatic token masking
- **Input Validation**: Comprehensive validation of all user inputs

## 🎯 Use Cases

- **Development Teams**: Streamline project management with JIRA integration
- **Project Managers**: Centralized dashboard for tracking project progress
- **Individual Developers**: Personal workspace with development tools
- **Agile Teams**: Enhanced workflow management with JIRA connectivity
- **Cross-platform Teams**: Consistent experience across Windows, macOS, and Linux

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally on your machine
- **Encrypted Credentials**: JIRA credentials are encrypted and stored securely
- **No Data Collection**: The application does not collect or transmit personal data
- **Open Source**: Transparent codebase for security auditing
- **System Integration**: Uses native OS security features

## 🌐 Multi-platform Support

Gojira runs natively on:
- **Windows**: Windows 10/11 with native Windows Credential Manager integration
- **macOS**: macOS 10.15+ with native macOS Keychain integration
- **Linux**: Various distributions with native Linux Secret Service integration
- **WSL2**: Full support with intelligent fallback when keyring is unavailable

### WSL2 Specific Features
- **Automatic Detection**: Detects WSL2 environment and adjusts security strategy
- **Encrypted File Storage**: Uses AES-256-GCM encrypted files when native keyring is unavailable
- **Security Transparency**: Clear indicators showing current security level and suggestions for improvement
- **Easy Keyring Setup**: Provides instructions to install and configure gnome-keyring in WSL2

#### Setting up Keyring in WSL2 (Optional - for maximum security)
To enable native keyring support in WSL2:

1. **Install gnome-keyring**:
   ```bash
   sudo apt install gnome-keyring
   ```

2. **Start the keyring daemon**:
   ```bash
   gnome-keyring-daemon --start --components=secrets
   ```

3. **Add to your shell profile** (optional, for automatic startup):
   ```bash
   echo 'gnome-keyring-daemon --start --components=secrets' >> ~/.bashrc
   ```

After setup, restart Gojira to use native keyring storage for maximum security.

## 🛠️ Extensibility

The application is built with extensibility in mind:
- **Modular Architecture**: Easy to add new features and integrations
- **Plugin-ready**: Structure supports future plugin development
- **API Integration**: Ready for additional service integrations
- **Theming System**: Customizable themes and styling

---

**Gojira** combines the power of modern web technologies with native desktop performance, providing a secure and efficient workspace for development teams and project management.