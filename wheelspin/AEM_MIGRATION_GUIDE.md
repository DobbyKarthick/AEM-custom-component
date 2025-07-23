# AEM Migration Guide: Shadcn Gamification Components

This guide documents the migration of Shadcn gamification components to Adobe Experience Manager (AEM).

## Project Structure

```
Projects/wheelspin/
├── core/                    # Sling Models and business logic
├── ui.apps/                 # AEM components and dialogs
├── ui.content/              # Content Fragment models
├── ui.frontend/             # React components and build
└── ui.config/               # OSGi configurations
```

## Migrated Components

### 1. Spin Wheel Component ✅
- **HTL Template**: `ui.apps/.../spin-wheel/spin-wheel.html`
- **React Component**: `ui.frontend/.../spin-wheel.tsx`
- **Dialog**: `ui.apps/.../spin-wheel/_cq_dialog/.content.xml`
- **Content Fragment Model**: `ui.content/.../spin-wheel-config.cfm`
- **Configuration**: Uses `window.wheelspinConfig` for AEM data

### 2. Pick-a-Gift Component ✅
- **HTL Template**: `ui.apps/.../pick-gift/pick-gift.html`
- **React Component**: `ui.frontend/.../pick-a-gift.tsx`
- **Dialog**: `ui.apps/.../pick-gift/_cq_dialog/.content.xml`
- **Content Fragment Model**: `ui.content/.../pick-a-gift-config.cfm`
- **Configuration**: Uses `window.pickGiftConfig` for AEM data

### 3. Scratch Card Component ✅
- **HTL Template**: `ui.apps/.../scratch-card/scratch-card.html`
- **React Component**: `ui.frontend/.../scratch-card.tsx`
- **Dialog**: `ui.apps/.../scratch-card/_cq_dialog/.content.xml`
- **Content Fragment Model**: `ui.content/.../scratch-card-config.cfm`
- **Configuration**: Uses `window.scratchCardConfig` for AEM data

## Configuration Flow

### 1. AEM Component Properties
Content authors configure components via:
- **Component Dialogs**: In-place editing with Coral UI
- **Content Fragment Models**: Structured content management

### 2. Data Flow
```
AEM Component Properties → HTL Template → window.*Config → React Component
```

### 3. Configuration Loading
Each component uses the `loadFromComponentProps` utility:
```typescript
const config = loadFromComponentProps(window.*Config || {}, default*Config);
```

## Content Fragment Models

### Spin Wheel Configuration
- **Model Path**: `/conf/wheelspin/settings/dam/cfm/models/spin-wheel-config`
- **Fields**: title, buttonText, wheelSize, animationDuration, minRevolutions, maxRevolutions, variant, size, segments

### Pick-a-Gift Configuration
- **Model Path**: `/conf/wheelspin/settings/dam/cfm/models/pick-a-gift-config`
- **Fields**: title, subtitle, autoOpen, showCloseButton, animationDuration, variant, size, prizes

### Scratch Card Configuration
- **Model Path**: `/conf/wheelspin/settings/dam/cfm/models/scratch-card-config`
- **Fields**: title, instructions, cardWidth, cardHeight, brushRadius, scratchColor, scratchPattern, revealThreshold, resetButtonText, variant, size, prizes

## Development Workflow

### 1. Build and Deploy
```bash
cd Projects/wheelspin
mvn clean install -PautoInstallPackage
```

### 2. Frontend Development
```bash
cd ui.frontend
npm install
npm run dev
```

### 3. Component Testing
1. Deploy to AEM instance
2. Add components to pages via AEM author interface
3. Configure via component dialogs
4. Test functionality in both author and publish modes

## Component Features

### Spin Wheel
- ✅ Radial text placement
- ✅ Customizable segments and colors
- ✅ Animation controls
- ✅ Responsive design
- ✅ AEM configuration integration

### Pick-a-Gift
- ✅ Multiple gift box selection
- ✅ Animated reveal effects
- ✅ Customizable prizes and styling
- ✅ Auto-open and close button options
- ✅ AEM configuration integration

### Scratch Card
- ✅ Canvas-based scratch surface
- ✅ Touch and mouse support
- ✅ Progress tracking
- ✅ Customizable appearance
- ✅ AEM configuration integration

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - Ensure `tsconfig.json` targets ES2015+ for Promise support
   - Add global Window interface declarations for config objects

2. **HTL Validation Errors**
   - Avoid complex expressions in `<script>` tags
   - Use data attributes for configuration passing

3. **Build Failures**
   - Check Maven profile configuration
   - Ensure all dependencies are resolved
   - Verify AEM instance is running for auto-install

### Debug Configuration
```javascript
// Check configuration in browser console
console.log('Spin Wheel Config:', window.wheelspinConfig);
console.log('Pick-a-Gift Config:', window.pickGiftConfig);
console.log('Scratch Card Config:', window.scratchCardConfig);
```

## Next Steps

### Completed ✅
- [x] Spin Wheel component migration
- [x] Pick-a-Gift component migration  
- [x] Scratch Card component migration
- [x] Content Fragment models creation
- [x] Configuration system implementation
- [x] Build and deployment setup

### Future Enhancements
- [ ] Additional gamification components (from CSV list)
- [ ] Analytics integration
- [ ] A/B testing capabilities
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Mobile-specific optimizations

## Resources

- **Shadcn UI**: https://ui.shadcn.com/
- **AEM Documentation**: https://experienceleague.adobe.com/docs/experience-manager-65.html
- **Content Fragment Models**: https://experienceleague.adobe.com/docs/experience-manager-65/assets/administer/content-fragments/content-fragments-models.html
- **HTL Documentation**: https://experienceleague.adobe.com/docs/experience-manager-htl/using/overview.html 