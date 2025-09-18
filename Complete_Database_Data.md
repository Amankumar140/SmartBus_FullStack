# SmartBus Complete Database Data

**Export Date**: September 18, 2025 at 20:43:38 UTC  
**Database**: defaultdb  
**Total Records**: 122 across 10 tables  

---

## Table 1: users
**Status**: ❌ Error - Unknown column 'phone' in field list  
**Record Count**: 0  
**Data**: No accessible data due to schema error

---

## Table 2: busstops
**Record Count**: 7  

| stop_id | stop_name | location | region |
|---------|-----------|----------|---------|
| 1 | ISBT Chandigarh | Sector 43, Chandigarh | Chandigarh |
| 2 | Sector 17 Bus Stand | Sector 17, Chandigarh | Chandigarh |
| 3 | Ludhiana Bus Stand | Gill Road, Ludhiana | Ludhiana |
| 4 | Jalandhar Bus Stand | Nakodar Road, Jalandhar | Jalandhar |
| 5 | Amritsar Bus Stand | Grand Trunk Road, Amritsar | Amritsar |
| 6 | Patiala Bus Stand | Bhupindra Road, Patiala | Patiala |
| 10 | Phagwara Bus Stop | Phagwara | Punjab |

---

## Table 3: routes
**Record Count**: 4  

| route_id | route_name | start_stop_id | end_stop_id | distance_km |
|----------|------------|---------------|-------------|-------------|
| 1 | Chandigarh to Ludhiana | 1 | 3 | 100.5 |
| 2 | Chandigarh to Jalandhar | 1 | 4 | 150 |
| 3 | Ludhiana to Amritsar | 3 | 5 | 135 |
| 4 | Patiala to Chandigarh | 6 | 1 | 75 |

---

## Table 4: buses
**Record Count**: 4  

| bus_id | bus_number | capacity | current_location | route_id | status |
|--------|------------|----------|------------------|----------|---------|
| 1 | PB10AB1234 | 50 | On route near Kharar | 1 | Running |
| 2 | PB11XY5678 | 45 | Ludhiana Bus Stand | 3 | Idle |
| 3 | PB09CD4321 | 50 | 31.2240,75.7739 | 2 | active |
| 4 | PB39EF9876 | 40 | Patiala Bus Stand | 4 | Idle |

---

## Table 5: route_stops
**Record Count**: 0  
**Data**: Empty table - no intermediate route stops defined

---

## Table 6: driver_routes
**Record Count**: 3  

| id | route_number | route_name | source_stop | destination_stop | total_stops | estimated_duration | is_active | created_at | updated_at |
|----|--------------|------------|-------------|------------------|-------------|-------------------|-----------|------------|------------|
| 4 | DL-CP-NP-001 | Connaught Place to Nehru Place | Connaught Place | Nehru Place | 7 | 120 | 1 | 2025-09-18T04:08:14.000Z | 2025-09-18T04:08:14.000Z |
| 5 | DL-DU-IGI-002 | Delhi University to IGI Airport | Delhi University | IGI Airport | 5 | 120 | 1 | 2025-09-18T04:08:16.000Z | 2025-09-18T04:08:16.000Z |
| 6 | DL-GGN-CP-003 | Gurgaon Sector 14 to Connaught Place | Gurgaon Sector 14 | Connaught Place | 5 | 120 | 1 | 2025-09-18T04:08:17.000Z | 2025-09-18T04:08:17.000Z |

---

## Table 7: driver_sessions
**Record Count**: 1  

| id | driver_id | route_id | bus_number | status | started_at | ended_at | created_at | updated_at |
|----|-----------|----------|------------|--------|------------|----------|------------|------------|
| 1 | 1 | 1 | null | active | 2025-09-18T07:41:03.000Z | null | 2025-09-18T07:41:03.000Z | 2025-09-18T07:41:03.000Z |

---

## Table 8: location_updates
**Record Count**: 100 (Last 100 records shown)  

### Recent Location Updates (Most Recent First):

| id | session_id | latitude | longitude | accuracy | speed | bearing | timestamp | location_source | device_type | device_id | hardware_info |
|----|------------|----------|-----------|----------|-------|---------|-----------|-----------------|-------------|-----------|---------------|
| 257 | 1 | 28.47077833 | 77.48499500 | 3.5 | null | null | 2025-09-18T18:56:47.000Z | gps | mobile_app | null | null |
| 256 | 1 | 28.47077833 | 77.48499500 | 3.5 | null | null | 2025-09-18T18:56:17.000Z | gps | mobile_app | null | null |
| 255 | 1 | 28.47071167 | 77.48492167 | 49.2 | null | null | 2025-09-18T18:55:47.000Z | gps | mobile_app | null | null |
| 254 | 1 | 28.47071167 | 77.48492167 | 49.2 | null | null | 2025-09-18T18:55:18.000Z | gps | mobile_app | null | null |
| 253 | 1 | 28.47071167 | 77.48492167 | 49.2 | null | null | 2025-09-18T18:54:47.000Z | gps | mobile_app | null | null |
| 252 | 1 | 28.47071167 | 77.48492167 | 49.2 | null | null | 2025-09-18T18:54:17.000Z | gps | mobile_app | null | null |
| 251 | 1 | 28.47083667 | 77.48474667 | 5 | null | null | 2025-09-18T18:53:47.000Z | gps | mobile_app | null | null |
| 250 | 1 | 28.47082667 | 77.48463667 | 3.3 | null | null | 2025-09-18T18:53:16.000Z | gps | mobile_app | null | null |
| 249 | 1 | 28.47082667 | 77.48463667 | 3.3 | null | null | 2025-09-18T18:52:47.000Z | gps | mobile_app | null | null |
| 248 | 1 | 28.47082667 | 77.48463667 | 3.3 | null | null | 2025-09-18T18:52:18.000Z | gps | mobile_app | null | null |

### Location Pattern Analysis:
- **Primary Location Cluster**: Around coordinates 28.470°N, 77.484°E
- **Secondary Location**: 28.630°N, 77.466°E (appears in records 190-194)
- **Third Location**: 28.490°N, 77.455°E (appears in records 169-189)
- **GPS Accuracy**: Ranges from 1.8m to 59m
- **Tracking Frequency**: Every 30 seconds approximately
- **Session ID**: All location updates belong to driver session #1

### Geographic Context:
- **28.470°N, 77.484°E**: Near Gurgaon/Faridabad area (Delhi NCR)
- **28.630°N, 77.466°E**: North Delhi area
- **28.490°N, 77.455°E**: South Delhi area

---

## Table 9: notifications
**Record Count**: 3  

| notification_id | user_id | type | message | sent_at |
|-----------------|---------|------|---------|---------|
| 1 | 1 | ETA Alert | Your bus PB10AB1234 will arrive at Sector 17 in 5 mins | 2025-09-03T08:13:54.000Z |
| 2 | 2 | Booking Confirmed | Your ticket Chandigarh → Jalandhar has been confirmed | 2025-09-03T08:13:54.000Z |
| 3 | 3 | Delay Alert | Bus PB11XY5678 is running 15 mins late from Ludhiana | 2025-09-03T08:13:54.000Z |

---

## Table 10: reports
**Status**: ❌ Error - Unknown column 'created_at' in 'order clause'  
**Record Count**: 0  
**Data**: No accessible data due to schema error

---

# Data Summary & Insights

## Active Operations:
- **Active Driver Session**: 1 driver currently active (session #1, started at 07:41:03 UTC)
- **Active Buses**: 
  - PB10AB1234 (Running) on Chandigarh to Ludhiana route
  - PB09CD4321 (active) on Chandigarh to Jalandhar route
- **Real-time Tracking**: 100+ location updates from active driver session

## Route Network:
- **4 Main Routes** connecting major Punjab cities
- **7 Bus Stops** across Punjab region
- **4 Buses** with total capacity of 185 passengers
- **Distance Coverage**: 460.5 km total across all routes

## Geographic Coverage:
- **Primary Region**: Punjab, India (Chandigarh, Ludhiana, Jalandhar, Amritsar, Patiala)
- **Live Tracking**: Delhi NCR area (likely test/development data)

## System Health:
- **Functional Tables**: 8 out of 10 tables working properly
- **Error Tables**: 2 tables (users, reports) have schema issues
- **Data Quality**: Good with consistent timestamps and proper foreign key relationships

## Recent Activity:
- **Last Location Update**: 2025-09-18 at 18:56:47 UTC
- **Active Session Duration**: ~11 hours (since 07:41:03 UTC)
- **Notification History**: 3 sample notifications from September 3rd

---

**Total Database Size**: 122 records across functional tables  
**Export Status**: ✅ Success (with 2 noted table errors)