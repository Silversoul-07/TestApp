# Calendar Feature Documentation

## Overview
A dedicated calendar screen that allows users to view their media watching/reading activity organized by date. The calendar provides both daily and aggregate views for tracking viewing habits.

## Access
- **Location**: Home screen, top left corner
- **Icon**: Calendar icon button (ghost style)
- **Route**: `/calendar`

## Features

### 1. **Interactive Calendar View**
- Monthly calendar grid with day navigation
- Visual indicators for days with activity:
  - **Colored dot**: Days with entries
  - **Highlighted cell**: Selected day
  - **Border**: Current day
  - **Primary background**: Selected day
- Month navigation with previous/next buttons

### 2. **View Modes**

#### Daily View
- Shows activity for a specific selected date
- Interactive calendar to pick any date
- Date-specific stats:
  - Total entries on that day
  - Episodes watched
  - Chapters read
- Empty state for dates with no activity

#### All Entries View
- Displays all media entries across all dates
- Aggregate statistics:
  - Total entries
  - Total episodes
  - Total chapters
- Useful for seeing complete viewing history

### 3. **Entry List**
- Shows media items for selected date/view
- Each entry displays:
  - Cover image
  - Title
  - Media type and unit label
  - Progress (current/total)
  - Progress bar
  - Quick +1 increment button
- Tap entry to view full details
- Quick actions directly from list

### 4. **Statistics Summary**
- Real-time stats based on selected view
- Episode count (for video content)
- Chapter count (for reading content)
- Total entry count

## User Experience

### Navigation Flow
```
Home Screen → Calendar Button (top left) → Calendar Screen
                                          ↓
                                    Select Date/View Mode
                                          ↓
                                    View Entries
                                          ↓
                                    Tap Entry → Media Detail
```

### Visual Design
- **Card-based layout** for calendar and stats
- **Color coding**:
  - Primary color for active/selected states
  - Muted colors for inactive states
  - Activity indicators (dots) for days with entries
- **Rounded corners** (3xl for main card)
- **Border accents** for emphasis

## Technical Implementation

### Data Grouping
```typescript
// Entries grouped by date (YYYY-MM-DD)
entriesByDate: Record<string, MediaEntry[]>

// Example:
{
  "2025-11-30": [entry1, entry2],
  "2025-11-29": [entry3],
  ...
}
```

### Date Calculations
- Automatic calendar generation for current month
- Proper handling of month start day offset
- Leap year support (native Date object)

### State Management
```typescript
selectedDate: Date        // Currently selected day
viewMode: 'day' | 'all'  // View toggle
currentMonth: Date       // Calendar month being displayed
```

### Performance
- Memoized calculations for:
  - Date grouping
  - Calendar day generation
  - Filtered entries
  - Statistics
- Efficient re-renders on date/view changes

## Use Cases

### 1. Track Daily Progress
- See what you watched/read on specific days
- Identify viewing patterns (weekend vs weekday)
- Review past activity

### 2. Binge Watching Awareness
- Visual representation of intense viewing periods
- Understand viewing velocity over time
- Promote mindful consumption habits

### 3. Activity Logging
- Quick reference for "What did I watch yesterday?"
- Track completion dates
- Review recent updates

### 4. Historical Analysis
- Browse through past months
- Identify active periods
- Compare activity across dates

## Future Enhancements

### Potential Features
1. **Week View**: 7-day scroll view for detailed tracking
2. **Month Stats**: Aggregate statistics per month
3. **Activity Heatmap**: Year-long intensity visualization
4. **Filters**: Filter by media type, status, or rating
5. **Streaks**: Highlight consecutive activity days
6. **Goals**: Set and track daily/weekly viewing goals
7. **Export**: Export activity data for analysis
8. **Notes**: Add daily notes or mood tracking
9. **Sharing**: Share monthly summaries
10. **Comparison**: Compare months or periods

### Improvements
- **Performance**: Virtual scrolling for large datasets
- **Animations**: Smooth transitions between dates
- **Gestures**: Swipe to change months
- **Presets**: Quick jump to "This week", "Last month"
- **Search**: Find entries by title within calendar
- **Sorting**: Different sort orders for entry list

## Integration with Other Features

### Profile Section
- Calendar data powers activity heatmap
- Daily velocity calculations
- Streak tracking

### Home Screen
- Recently updated leverages date sorting
- Continue watching based on last activity date

### Statistics
- Time-based analytics
- Viewing patterns
- Completion rates over time

## Benefits for Mindful Watching

1. **Self-Awareness**: See your viewing patterns clearly
2. **Accountability**: Visual record of binge sessions
3. **Balance**: Identify imbalanced viewing periods
4. **Planning**: Plan what to watch on specific days
5. **Memory**: Remember what you watched and when
6. **Motivation**: Track consistency and streaks

---

## Summary
The Calendar feature transforms the app from a simple tracker into a comprehensive activity journal, promoting mindful media consumption through visual, date-based tracking and insights.
