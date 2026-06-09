# Navigation Puck Assets

## Required Images

### puck-bearing.png
- Blue 3D navigation arrow/chevron pointing upward
- Style similar to Google Maps
- Recommended size: 128x128px (or higher resolution for retina displays)
- Transparent background
- Blue gradient with 3D shading

### puck-shadow.png
- White semi-transparent oval shadow base
- Recommended size: 128x128px
- Transparent background
- Soft blur/drop shadow effect
- Opacity 50-70%

## Usage
Loaded by `NavigationLocationPuck` when the driver is not in active turn-by-turn navigation.
During navigation, `NavigationDriverMarker` renders the Google Maps-style arrow on the route.
