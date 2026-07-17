# Innav 🗺️

An innovative indoor navigation and mapping application built with React Native and Expo. Innav helps users navigate through complex indoor spaces with real-time positioning and interactive map features.

## Project Overview

Innav is a cross-platform mobile application that provides indoor navigation capabilities. It leverages modern React Native technologies to deliver a seamless navigation experience across iOS, Android, and web platforms. The app features interactive map viewing, gesture controls, and efficient pathfinding algorithms.

### Key Features

- **Interactive Indoor Maps**: Zoomable and pannable SVG-based map visualization
- **Real-time Navigation**: Camera integration for location awareness and navigation
- **Haptic Feedback**: Enhanced user experience with vibration feedback
- **Cross-Platform Support**: Native apps for iOS and Android, plus web support
- **Bottom Tab Navigation**: Intuitive navigation structure with multiple sections
- **Pathfinding Algorithm**: Dijkstra-based routing for optimal path calculation
- **Vector Icons**: Rich icon set for intuitive UI elements

### Technology Stack

- **Framework**: React Native 0.81.4 with Expo 54.0
- **Language**: TypeScript
- **Navigation**: Expo Router with React Navigation
- **UI Components**: 
  - React Native Vector Icons
  - Expo Vector Icons
  - React Native SVG with pan/zoom capabilities
- **Camera**: Expo Camera for location capture
- **State Management**: React Native Reanimated for smooth animations
- **Routing Algorithm**: Dijkstra.js for pathfinding

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Expo CLI installed globally (optional but recommended)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Sanelemthembu1/Innav.git
   cd Innav
   ```

2. Install dependencies

   ```bash
   npm install
   ```

### Running the App

**Development Build:**
```bash
npx expo start
```

In the output, you'll find options to open the app in:
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

**Platform-Specific Commands:**

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Development

The project uses [file-based routing](https://docs.expo.dev/router/introduction) with the **app** directory containing all route definitions and screens.

**Reset Project:**
When you're ready to start with a fresh project structure:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory.

**Code Quality:**
```bash
# Run ESLint
npm run lint
```

## Project Structure

- **app/** - Application screens and routes (file-based routing)
- **scripts/** - Utility scripts for project management
- **package.json** - Project dependencies and scripts

## Learn More

To learn more about developing with this tech stack:

- [Expo Documentation](https://docs.expo.dev/): Learn fundamentals and advanced topics
- [React Native Documentation](https://reactnative.dev/): Core React Native concepts
- [Expo Router Guide](https://docs.expo.dev/router/introduction/): File-based routing setup
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Step-by-step project creation guide

## Community & Support

- [Expo GitHub Repository](https://github.com/expo/expo): Open source platform and contributions
- [Expo Discord Community](https://chat.expo.dev): Chat with developers and ask questions
- [React Native Community](https://reactnative.dev/help): React Native support resources

## License

This project is currently unlicensed. See LICENSE file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve Innav.

---

Created with ❤️ using [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
