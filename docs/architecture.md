# Media Tracker App - Current Architecture (Updated Nov 2024)

## Overview
A modern React Native media tracking application built with Expo Router, featuring a redesigned UI with persistent state management, custom lists, and enhanced data visualization.

---

## Project Structure

```
my-app/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation (4 tabs)
│   │   ├── _layout.tsx    # Tab navigation configuration
│   │   ├── library.tsx    # Home/Library screen (PRIMARY)
│   │   ├── search.tsx     # Discover screen (renamed from Search)
│   │   ├── add-entry.tsx  # Add media screen (hidden from tab bar)
│   │   ├── my-list.tsx    # Custom lists with TikTok-style tabs
│   │   ├── profile.tsx    # User profile with enhanced stats
│   │   └── home.tsx       # Old home (hidden, kept for reference)
│   ├── media/
│   │   └── [id].tsx       # Dynamic media detail page
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Root redirect to library
│   ├── settings.tsx       # Settings screen
│   └── +not-found.tsx     # 404 screen
├── components/
│   ├── cards/             # MediaCard, MilestoneCard, StatCard, MediaListItem
│   ├── charts/            # ActivityHeatmap, DistributionChart, FavoriteGenresBar
│   ├── forms/             # FormInput, FormDropdown, FormDatePicker, etc.
│   ├── shared/            # SearchBar, FilterChip, EmptyState, etc.
│   └── ui/                # Button, Icon, Text, Input, Badge, Card, etc.
├── hooks/
│   └── use-media.ts       # Media data hook with stats & CRUD operations
├── lib/
│   ├── constants/         # Media types, statuses, genres
│   ├── data/              # Mock data for development
│   ├── db/                # Drizzle ORM schema & SQLite setup
│   ├── types/             # TypeScript type definitions
│   ├── theme.ts           # Theme configuration (NAV_THEME, colors)
│   └── utils.ts           # Utility functions (cn, etc.)
├── providers/
│   └── media-provider.tsx # Global media context provider
└── assets/
    └── images/            # Static image assets
```

---

## Navigation Structure

### Active Tabs (4 tabs)
1. **Home** (library.tsx) - Primary screen
   - User's media library with search & filters
   - 3-column grid or list view toggle
   - Collapsible filter panel

2. **Discover** (search.tsx) - Renamed from "Search"
   - Browse and search for new media
   - Trending tabs: Seasonal, This Week, Top Rated
   - Add button in header (not in tab bar)

3. **My Lists** (my-list.tsx) - NEW
   - Custom list management
   - TikTok-style pill tabs
   - Default "Favourites" list (undeletable)

4. **Profile** (profile.tsx)
   - Enhanced user info card
   - Statistics grid with icons
   - Charts & achievements

### Hidden/Accessible Screens
- **add-entry**: Accessible via Discover header button
- **settings**: Accessible via Profile header button
- **media/[id]**: Dynamic detail pages for each media item

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native + Expo |
| Routing | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Database | Expo SQLite Next + Drizzle ORM |
| State Management | React Context + Hooks + AsyncStorage v2.2.0 |
| Animations | React Native Animated API (spring) |
| Icons | Lucide React Native |
| Type Safety | TypeScript (strict mode) |
| Package Manager | pnpm |

---

## Design System

### UI/UX Patterns
- **Center-Aligned Headers**: Consistent across all tab screens
- **3-Column Grid**: Default layout for media cards
- **Collapsible Filters**: Animated expand/collapse with spring
- **Filter Positioning**: Filter buttons next to search bars
- **TikTok-Style Tabs**: Horizontal scrolling pill-shaped tabs
- **Persistent State**: All user preferences saved to AsyncStorage

### Color & Theming
- Uses theme colors (primary, background, card, border, text, muted-foreground)
- No explicit background colors (theme-optimized)
- Border styling: `border-border/50` or `border-border/60`
- Rounded corners: rounded-2xl, rounded-3xl, rounded-full

### Component Variants
- **Button**: default, outline, ghost, destructive
- **Card**: default with border and rounded corners
- **Badge**: status indicators with color coding
- **Icon**: Consistent sizing (16, 20, 24)

---

## State Management

### Global State (MediaProvider)
- Media entries array
- Computed statistics
- Distribution & genre data
- Activity data
- CRUD operations: addMedia, updateMedia, deleteMedia

### Persistent State (AsyncStorage)
Saved user preferences with keys:
- `library_viewMode`: "grid" | "list"
- `library_mediaTypeFilter`: Selected media type
- `library_statusFilter`: Selected status
- `library_sortBy`: Sort preference
- `discover_quickFilter`: Active filter
- `discover_activeTab`: Selected tab
- `discover_trendingTab`: Trending tab selection
- `mylist_activeList`: Current list ID
- `customLists`: Array of user-created lists

### Local State (useState)
- UI interactions (modals, dropdowns, animations)
- Form inputs
- Temporary selections

---

## Key Features by Screen

### Library/Home Screen (library.tsx)
**Purpose**: Primary screen for viewing user's media collection

**Features**:
- Search bar with real-time filtering
- Collapsible filter panel (media type, status, genre)
- Sort options (title, rating, recently added, last updated)
- View toggle: 3-column grid or list view
- Persistent state for all preferences

**Components Used**:
- SearchBar, FilterChip, MediaCard, MediaListItem, LoadingState, EmptyState

**State**: viewMode, mediaTypeFilter, statusFilter, sortBy, showFilters (animated)

---

### Discover Screen (search.tsx)
**Purpose**: Browse and discover new media content

**Features**:
- Quick filters (All, Anime, Manga, Movies, TV Shows, Books)
- Tabbed interface: Trending (Seasonal, This Week, Top Rated) + Seasonal Content
- Search functionality
- Add button in header (quick access to add-entry)
- Ranking display for trending items

**Components Used**:
- SearchBar, Button (Add), Tabs, MediaCard, FilterChip

**State**: quickFilter, searchQuery, activeTab, trendingTab (persistent)

---

### My Lists Screen (my-list.tsx)
**Purpose**: Organize media into custom lists

**Features**:
- Default "Favourites" list (system list, undeletable)
- User-created custom lists with CRUD operations
- TikTok-style horizontal scrolling tabs (pill design)
- Animated tab scrolling with useSharedValue
- Active state highlighting
- 3-column grid layout per list

**Components Used**:
- Animated tabs, MediaCard, Button (Add/Delete)

**State**: customLists, activeList (persistent), scrollX (animated)

**Data Structure**:
```typescript
type CustomList = {
  id: string;
  name: string;
  mediaIds: number[];
  isDefault?: boolean; // For "Favourites"
};
```

---

### Profile Screen (profile.tsx)
**Purpose**: Display user statistics and achievements

**Features**:
- Enhanced user info card with avatar (initials)
- Quick stats row: Total, Completed, Watching, Avg Score
- Detailed statistics grid with colorful icons:
  - Episodes Watched (blue trending icon)
  - Chapters Read (pink heart icon)
  - Mean Score (yellow star icon)
  - Days Watched (purple clock icon)
- Distribution chart (media type pie chart)
- Favorite genres bar chart (top 5)
- Activity heatmap
- Achievements/milestones section
- Settings button in header

**Components Used**:
- DistributionChart, ActivityHeatmap, FavoriteGenresBar, MilestoneCard, Icon

**State**: Computed from useMedia hook (stats, distribution, genreDistribution, activity)

---

## Component Library

### Cards (components/cards/)

**MediaCard** - Optimized for 3-column grid
- Compact padding (p-2)
- AspectRatio 2/3 for poster
- Two-line title support
- Smaller progress bar
- Star rating display
- Bookmark icon for favorites

**MediaListItem** - List view variant
- Horizontal layout
- Full title display
- More metadata visible

**MilestoneCard** - Achievement display
- Icon, title, description
- Achievement date

**StatCard** - Statistics display
- Large value, label, optional icon

---

### Charts (components/charts/)

**DistributionChart**
- Pie/donut chart for media type distribution
- Shows percentage breakdown

**ActivityHeatmap**
- Visual grid showing daily activity
- Color intensity based on entries

**FavoriteGenresBar**
- Horizontal bar chart
- Top 5 genres with counts

---

### Forms (components/forms/)

**FormInput** - Text input with label and validation

**FormDropdown** - Selection dropdown with options

**FormDatePicker** - Date selection component

**FormStepper** - Numeric stepper for progress tracking

**FormSwitch** - Toggle switch for boolean options

**StarRating** - Interactive star rating (0-10)

---

### Shared (components/shared/)

**SearchBar** - Search input with icon and clear button

**FilterChip** - Tappable filter tag with active state styling

**GenreChip** - Genre tag display (read-only)

**StatusBadge** - Status indicator with color coding

**RatingDisplay** - Read-only star rating

**EmptyState** - Placeholder for empty data states

**LoadingState** - Loading spinner/indicator

**SectionHeader** - Consistent section titles with optional action button

---

## Data Flow

### Database Layer (SQLite + Drizzle ORM)
```
lib/db/schema.ts → Defines tables (mediaEntries, etc.)
lib/db/index.ts → SQLite connection, migrations, seed data
```

### Provider Layer
```
MediaProvider (providers/media-provider.tsx)
├── State: mediaItems, loading, error
├── Operations: addMedia, updateMedia, deleteMedia
└── Computed: stats, distribution, genreDistribution, activity
```

### Hook Layer
```
useMedia() → Exposes:
├── mediaItems
├── stats (totalEntries, meanScore, episodesWatched, etc.)
├── distribution (media type breakdown)
├── genreDistribution (genre frequency)
├── activity (recent activity data)
└── CRUD operations
```

### Component Layer
```
Screen Components → useMedia() → Display data
                  → AsyncStorage → Persist preferences
                  → Local state → UI interactions
```

---

## Animations

### Collapsible Filter Panel
```typescript
const filterHeight = useRef(new Animated.Value(0)).current;

const animatedHeight = filterHeight.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 300] // Adjust based on content
});
```

### TikTok-Style Tabs
```typescript
const scrollX = useSharedValue(0);
// Smooth horizontal scrolling with animated indicator
```

### Spring Animations
Used for smooth expand/collapse transitions:
```typescript
Animated.spring(animatedValue, {
  toValue: target,
  useNativeDriver: false,
  friction: 8,
  tension: 40
}).start();
```

---

## Performance Optimizations

### React Optimization
- **useMemo**: Filter/sort operations, interpolations
- **useCallback**: Event handlers
- **Consistent Hook Order**: All hooks before conditional returns

### Component Optimization
- FlatList for large datasets
- Conditional rendering for loading states
- Lazy loading where applicable

### State Optimization
- Debounced search input
- Batched AsyncStorage writes
- Selective re-renders

---

## Development Guidelines

### Code Style
```typescript
// Component structure
interface ComponentProps {
  // Props interface first
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks in consistent order
  const hook1 = useHook1();
  const [state, setState] = useState();
  const memoized = useMemo(() => {}, []);
  
  // Early returns for loading/error
  if (loading) return <LoadingState />;
  
  // Render
  return <View>...</View>;
}
```

### Naming Conventions
- **Components**: PascalCase (MediaCard, SearchBar)
- **Functions**: camelCase (handlePress, filterMedia)
- **Files**: kebab-case (media-card.tsx, use-media.ts)
- **Types**: PascalCase (MediaItem, CustomList)

### Import Order
1. React & React Native
2. Third-party libraries
3. Components (@ imports)
4. Hooks
5. Utils & types
6. Assets

### Styling Rules
- Use NativeWind className prop
- No inline styles unless dynamic
- Consistent spacing (multiples of 4)
- Theme colors only (no hardcoded colors)

---

## Recent Major Changes (November 2024)

### Navigation Restructure ✅
- Renamed Search → Discover
- Replaced Home → Library (now primary screen)
- Added My Lists tab (new feature)
- Moved Add button from tab bar → Discover header

### Design Updates ✅
- Center-aligned headers across all tabs
- 3-column grid layout for all media displays
- Filter buttons repositioned next to search bars
- TikTok-style pill tabs for My Lists
- Enhanced profile with quick stats card

### Feature Additions ✅
- Persistent state with AsyncStorage v2.2.0
- Collapsible filter panels with spring animations
- Custom lists with default Favourites
- View mode toggle (grid/list) in Library
- Enhanced statistics with icon grid in Profile

### Technical Fixes ✅
- Fixed React Hooks ordering violations
- Optimized MediaCard for 3-column layout
- Proper memoization patterns
- Type safety improvements
- Removed description field from CustomList type

---

## Future Enhancements

### High Priority
- [ ] Cloud sync and user accounts
- [ ] Enhanced media detail page
- [ ] List sharing functionality
- [ ] Advanced filtering (multiple genres, date ranges)
- [ ] Import/export (JSON, CSV)

### Medium Priority
- [ ] Custom themes and color schemes
- [ ] Push notifications for new releases
- [ ] Social features (sharing, recommendations)
- [ ] Advanced statistics dashboard
- [ ] Search history and suggestions

### Low Priority
- [ ] Batch operations (multi-select, bulk edit)
- [ ] Integration with external APIs (MAL, TMDB)
- [ ] Custom sort builder
- [ ] Offline mode improvements
- [ ] Widget support

---

## Testing Strategy

### Manual Testing
```bash
# Start development server
pnpm expo start

# Test on platforms
pnpm expo start --ios
pnpm expo start --android
pnpm expo start --web
```

### Type Checking
```bash
# TypeScript validation
npx tsc --noEmit
```

### Validation Checklist
- [ ] All tabs load without errors
- [ ] Search & filters work correctly
- [ ] State persists across app restarts
- [ ] Animations are smooth
- [ ] No console errors/warnings
- [ ] Data updates reflect correctly

---

## Troubleshooting

### Common Issues

**Hooks Order Error**
- Ensure all hooks are called before conditional returns
- Move useMemo/useCallback before if statements

**AsyncStorage Not Working**
- Verify @react-native-async-storage/async-storage is installed
- Check key naming consistency
- Use try/catch for error handling

**Animation Performance**
- Use `useNativeDriver: true` where possible
- Memoize interpolations with useMemo
- Avoid layout animations on Android if slow

**Type Errors**
- Run `npx tsc --noEmit` to see all errors
- Check type definitions in lib/types/
- Ensure props interfaces are complete

---

## Additional Resources

### Key Files to Reference
- `/lib/constants/media.ts` - Media types, statuses, genres
- `/lib/theme.ts` - Theme colors and configuration
- `/lib/utils.ts` - Utility functions (cn, etc.)
- `/hooks/use-media.ts` - Main data hook implementation

### External Documentation
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Native](https://reactnative.dev/)
- [Lucide Icons](https://lucide.dev/)

---

*Last Updated: November 30, 2024*
