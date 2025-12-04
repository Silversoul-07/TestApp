# Shiori (BingeTrack) - Development Roadmap & TODO

This document contains all the planned improvements and features for Shiori.

## 📋 Overview

All TODO items have been added directly to the relevant files. This document provides a high-level summary and prioritization.

---

## 🎯 Priority 1: UI/UX Improvements

### 1. Home Page Redesign
**File**: `app/(tabs)/home.tsx`

- [ ] Redesign card layout for better visual appeal
- [ ] Improve list style with better spacing
- [ ] Enhance filter options UI
- [ ] Add smooth transitions between grid and list
- [ ] Add quick actions overlay on cards
- [ ] Improve mobile responsiveness

### 2. Media Cards Enhancement
**Files**: `components/cards/media-card.tsx`, `components/cards/media-list-item.tsx`

- [ ] Add gradient overlay on images
- [ ] Implement skeleton loading states
- [ ] Add hover/press animations
- [ ] Add swipe gestures for quick actions
- [ ] Implement smooth progress animations
- [ ] Add thumbnail loading placeholders

### 3. Transition Improvements
**File**: `app/_layout.tsx`

- [ ] Add smooth page transitions
- [ ] Implement shared element transitions
- [ ] Add fade/slide animations
- [ ] Improve modal presentation
- [ ] Add gesture-based navigation
- [ ] Consider using Reanimated for performance

---

## 🗓️ Priority 2: Calendar Enhancements

**File**: `app/calendar.tsx`

- [ ] Display all entries in daily view
- [ ] Add support for future date entries
- [ ] Implement reminder system
- [ ] Add notification support
- [ ] Add week and month views
- [ ] Add entry completion predictions
- [ ] Integrate with device calendar

---

## 🔍 Priority 3: Discover Page Complete Makeover

**File**: `app/(tabs)/search.tsx`

### Backend (Serverless - Supabase)
- [ ] Setup Supabase project
- [ ] Create Edge Functions for recommendations
- [ ] Integrate TMDB/AniList APIs
- [ ] Implement AI-powered recommendations
- [ ] Add caching layer for API responses
- [ ] Create recommendation algorithm

### UI
- [ ] Complete redesign with modern layout
- [ ] Add infinite scroll
- [ ] Implement advanced filters
- [ ] Add trending section with real-time data
- [ ] Allow custom public lists
- [ ] Add "Discover" feed with curated collections
- [ ] Improve search autocomplete
- [ ] Add preview cards with quick actions

---

## ✏️ Priority 4: Add Entry Improvements

**File**: `app/(tabs)/add-entry.tsx`

### UI Enhancements
- [ ] Redesign with step-by-step wizard
- [ ] Add visual form validation feedback
- [ ] Improve layout and typography
- [ ] Add image picker for covers
- [ ] Add quick templates
- [ ] Implement auto-save

### Form Improvements
- [ ] Add search integration for auto-fill
- [ ] Add genre multi-select
- [ ] Add voice input
- [ ] Implement smart defaults
- [ ] Add bulk import
- [ ] Add duplicate detection

---

## ⭐ Priority 5: Rating System Enhancements

**File**: `components/forms/star-rating.tsx`

- [ ] Add tier-based rating (S, A, B, C, D)
- [ ] Implement emoji-based rating
- [ ] Add percentage-based rating
- [ ] Allow custom rating scales
- [ ] Add rating categories (story, art, etc.)
- [ ] Implement weighted averages
- [ ] Add user preference for rating system

---

## 📤 Priority 6: Import/Export & Social Sharing

**File**: `lib/sharing.ts`

### Import/Export
- [ ] Implement JSON export
- [ ] Implement CSV export
- [ ] Add JSON import with validation
- [ ] Add CSV import with field mapping
- [ ] Add third-party format support
- [ ] Add batch operations
- [ ] Add progress indicators

### Social Sharing (Serverless)
- [ ] Create Supabase Edge Functions
- [ ] Implement secure share ID generation
- [ ] Store shared entries in database
- [ ] Add privacy controls
- [ ] Implement expiration for links
- [ ] Add view counter
- [ ] Create API endpoints
- [ ] Implement rate limiting

### Social Sharing UI
- [ ] Add "Share" button on entries
- [ ] Create shareable card design
- [ ] Generate deep links
- [ ] Add social media integration
- [ ] Implement QR code generation
- [ ] Add "Copy Link" functionality
- [ ] Create web viewer for shared links
- [ ] Show share analytics

---

## 🎮 Priority 7: Profile Gamification

**File**: `app/(tabs)/profile.tsx`

### Gamified Features
- [ ] Implement achievement system
- [ ] Add user level and XP system
- [ ] Create leaderboards
- [ ] Add daily/weekly challenges
- [ ] Implement streak tracking
- [ ] Add collectible badges

### Mindful Binge-Watching Analytics
- [ ] Add time spent tracking
- [ ] Show diversity score (genre variety)
- [ ] Add completion rate trends
- [ ] Implement watching pattern analysis
- [ ] Add personal interest graphs
- [ ] Show content quality metrics
- [ ] Add recommendations based on patterns
- [ ] Create shareable annual/monthly reports

---

## ⚙️ Priority 8: Settings Improvements

**File**: `app/settings.tsx`

- [ ] Add theme customization (colors, accents)
- [ ] Implement cloud backup to Supabase
- [ ] Add GitHub version checker
- [ ] Add export to JSON/CSV
- [ ] Add import from JSON/CSV
- [ ] Add data sync status indicator
- [ ] Implement account management
- [ ] Add notification preferences
- [ ] Add language/localization
- [ ] Add privacy settings

---

## 🔧 Priority 9: Backend Infrastructure

**File**: `lib/supabase/client.ts`

### Supabase Setup
- [ ] Create Supabase project
- [ ] Install @supabase/supabase-js
- [ ] Set up environment variables
- [ ] Create database schema
- [ ] Set up Row Level Security

### Database Tables
- [ ] shared_entries table
- [ ] recommendations table
- [ ] user_backups table
- [ ] external_media_cache table

### Edge Functions
- [ ] generate-recommendations function
- [ ] search-media function
- [ ] create-share-link function
- [ ] fetch-shared-entry function
- [ ] sync-user-data function
- [ ] backup-user-data function

### External APIs
- [ ] TMDB API integration
- [ ] AniList API integration
- [ ] API caching implementation
- [ ] Rate limiting implementation

---

## 📊 Implementation Timeline

### Phase 1 (Weeks 1-2): Quick Wins
- Home page card/list UI improvements
- Media card enhancements
- Basic transition improvements
- Add entry form improvements

### Phase 2 (Weeks 3-4): Core Features
- Calendar enhancements
- Rating system alternatives
- Import/Export functionality (local)
- Settings improvements

### Phase 3 (Weeks 5-6): Backend Setup
- Supabase project setup
- Database schema creation
- Edge Functions implementation
- External API integrations

### Phase 4 (Weeks 7-8): Advanced Features
- Discover page complete redesign
- Social sharing backend and UI
- Cloud backup implementation
- Recommendation engine

### Phase 5 (Weeks 9-10): Gamification
- Profile gamification system
- Achievement system
- Analytics and visualizations
- Mindful watching insights

### Phase 6 (Weeks 11-12): Polish & Testing
- Performance optimization
- Bug fixes
- User testing
- Documentation
- App store preparation

---

## 🧪 Testing Checklist

After each major feature implementation:

- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Performance testing (React DevTools Profiler)
- [ ] Network testing (offline mode)
- [ ] Error handling verification
- [ ] Accessibility testing
- [ ] User feedback collection

---

## 📚 Documentation Needed

- [ ] API documentation for backend
- [ ] User guide for new features
- [ ] Developer setup guide
- [ ] Contributing guidelines
- [ ] Privacy policy (for social features)
- [ ] Terms of service (for social features)

---

## 🔐 Security Considerations

- [ ] Implement proper authentication (if needed)
- [ ] Add input validation on all forms
- [ ] Sanitize user-generated content
- [ ] Implement rate limiting
- [ ] Add CSRF protection for API calls
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling (no secret leaks)
- [ ] Add content moderation for shared entries

---

## 📦 Dependencies to Add

```json
{
  "@supabase/supabase-js": "^2.x",
  "react-native-reanimated": "^3.x",
  "react-native-gesture-handler": "^2.x",
  "@react-native-community/datetimepicker": "^8.x",
  "expo-notifications": "~0.x",
  "expo-calendar": "~13.x",
  "react-native-qrcode-svg": "^6.x"
}
```

---

## 🎨 Design System Improvements

- [ ] Define consistent spacing scale
- [ ] Create typography scale
- [ ] Define color palette with semantic tokens
- [ ] Create animation/transition presets
- [ ] Define shadow/elevation system
- [ ] Create component variants documentation

---

## 📱 Platform-Specific Considerations

### iOS
- [ ] Haptic feedback for interactions
- [ ] Native share sheet integration
- [ ] Widget support (iOS 14+)
- [ ] Spotlight search integration

### Android
- [ ] Material Design 3 components
- [ ] Native share menu
- [ ] Home screen widgets
- [ ] Quick settings tile

---

## 🚀 Future Ideas (Post-Launch)

- [ ] Social features (friends, activity feed)
- [ ] Community lists and recommendations
- [ ] Integration with streaming services
- [ ] Watch party feature
- [ ] Browser extension for quick add
- [ ] Desktop app (Electron/Tauri)
- [ ] API for third-party integrations
- [ ] Machine learning for predictions

---

## 📞 Support & Maintenance

- [ ] Set up issue templates
- [ ] Create Discord/community channel
- [ ] Implement crash reporting (Sentry)
- [ ] Add analytics (privacy-focused)
- [ ] Create feedback mechanism in app
- [ ] Set up automated testing (CI/CD)

---

**Last Updated**: December 4, 2025
**Version**: 1.0.0-dev
