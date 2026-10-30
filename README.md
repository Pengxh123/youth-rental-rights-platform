# Youth Rental Rights Platform

## Project Overview

This is a fully-featured, beautifully designed WeChat Mini Program focused on providing end-to-end rental services for college students and young professionals within 3 years of graduation, including housing reference, fee verification, rights protection, and experience sharing.

## Project Structure

```
miniprogram-6/
├── app.js                 # Mini Program entry file
├── app.json              # Global configuration
├── app.wxss              # Global styles
├── components/           # Custom components
│   └── bottom-nav/       # Bottom navigation component
├── pages/                # Pages directory
│   ├── index/            # Home page
│   ├── housing-verify/   # Housing reference
│   ├── fee-check/        # Fee verification
│   ├── rights-protect/   # Rights protection
│   ├── discussion/       # Discussion forum
│   ├── profile/          # Personal center
│   ├── fee-calculator/   # Fee calculator
│   ├── report-detail/    # Rights report detail
│   ├── topic-detail/     # Topic detail
│   ├── verify-result/    # Verification result
│   ├── help-center/      # Help center
│   └── contract-template/# Contract template
├── images/               # Image resources
├── project.config.json   # Project configuration
└── sitemap.json          # Sitemap configuration
```

## Core Features

### 1. Home Page (Core Navigation)
- City/district quick selection + location feature
- Scam warning carousel (high/medium risk)
- Four core function entrances (housing reference, fee verification, rights protection, discussion)
- Quick rights access channels (12345 hotline, housing department, emergency alert)
- Hot topics display
- Tips to avoid scams
- Data statistics (users served, rights cases, success rate)

### 2. Housing Reference Section (Pre-Rental Pitfall Avoidance)
- City/district selector
- Area rental basic data:
  - Average rent (by unit type)
  - Typical deposit ratio
  - Civil/commercial utility ratio
  - Nearby amenities
- Scenario-based housing recommendations (internship/shared/solo)
- On-site viewing checklist with visual guide
- Verified housing recommendations (official listings, verified platform entrances)

### 3. Fee Verification Tool (Core Innovation)
- Official utility fee verification:
  - Select city and fee type
  - Enter landlord's quote
  - Compare against official standards
  - Highlight exceeding portions
  - Generate screenshot-ready verification report
  - Negotiation script templates
- Rent reasonableness reference:
  - Enter housing information
  - Compare against similar properties in area
  - Alert for deviations
  - Price location visualization
- Total rental cost calculator:
  - One-click calculation of rent, property fees, utilities, etc.
  - Supports monthly/quarterly/yearly totals
  - Cost breakdown analysis

### 4. Rights Protection Station (Problem Resolution)
- Rights claim filing:
  - Anonymous/real-name submission
  - Select rights type (deposit not returned/overcharging/fake listings, etc.)
  - Upload image/video evidence
  - Fill in demands
  - Generate case number for progress tracking
- Rights toolkit:
  - Pitfall-proof rental contract templates (downloadable)
  - Easy-to-understand legal basis for rental rights
  - Local rights channel directory (address/phone/online entrance)
  - Pro bono lawyer consultation entrance
  - Illustrated rights process guide
- Rights progress query
- Success case carousel
- Legal aid entrance

### 5. Youth Discussion Forum (Experience Sharing)
- Categorized topic sections:
  - Scam experience sharing
  - Rental pitfall avoidance tips
  - Rights success stories
  - Housing help requests
- Basic interactions:
  - Topic publishing (images + tags)
  - Comments/likes/favorites
  - Keyword search
  - Hot topic recommendations
- Content compliance: keyword filtering + light human moderation

### 6. Personal Center (Personalized Management)
- Personal info management (avatar/nickname, optional real-name)
- History records:
  - My rights cases (progress/results)
  - Verification reports
  - Published content
- Favorites:
  - Housing tips
  - Rights tools
  - Quality topics
- Notifications:
  - Rights progress
  - Interaction alerts
  - Platform announcements
- Basic settings:
  - Notification toggles
  - Privacy settings
  - Feedback
  - Clear cache

## Technical Features

### Interface Design
- **Modern UI**: Gradient colors, card-based design, rounded corner style
- **Fully responsive**: Adapts to all screen sizes
- **Smooth interactions**: Animation effects, loading states, operation feedback
- **Data visualization**: Progress bars, statistical charts, proportion displays

### Technology Stack
- **Framework**: WeChat Mini Program native framework
- **Language**: JavaScript
- **Template Engine**: WXML
- **Styling**: WXSS
- **Data Storage**: Local storage (wx.setStorage)

### Core Highlights
1. **Fee verification tool** - Enter landlord's quote, auto-compare against official standards, generate screenshot-ready reports and negotiation scripts
2. **Smart calculator** - One-click rental total cost calculation, supports different periods, auto-calculates cost breakdown
3. **Rights process visualization** - Clear display of rights progress, real-time status updates
4. **Discussion community** - Supports anonymous publishing, topic tags, interactive comments, hot recommendations
5. **Local storage** - Rights records, verification reports, favorite content cached locally

## How to Run

1. Ensure WeChat DevTools is installed
2. Open WeChat DevTools, import the project
3. Select the project root directory (the folder containing `app.js`)
4. Click "Compile" to preview

## Notes

1. **Bottom navigation**: Custom bottom navigation component used, includes 5 main function entrances
2. **Data storage**: Currently uses Mock data, all data stored locally
3. **Map feature**: Requires Tencent Maps API key configuration
4. **Real-name authentication**: To use WeChat login, requires corresponding permission configuration

## Future Optimization Suggestions

1. Connect real backend APIs
2. Add WeChat login and real-name authentication
3. Implement data sync to cloud
4. Add push notification feature
5. Optimize image loading and caching mechanisms
6. Add official fee standard data for more cities

## Version Information

Current version: v1.0.0
Last updated: May 2026
