const db = require('../config/db');

// Get all buses with routes and stops
exports.getAllBuses = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.bus_id, 
        b.bus_number, 
        b.capacity, 
        b.current_location, 
        b.status,
        r.route_name,
        r.distance_km,
        start_stop.stop_name as start_stop_name,
        start_stop.location as start_location,
        end_stop.stop_name as end_stop_name,
        end_stop.location as end_location
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.route_id
      LEFT JOIN busstops start_stop ON r.start_stop_id = start_stop.stop_id
      LEFT JOIN busstops end_stop ON r.end_stop_id = end_stop.stop_id
      ORDER BY b.bus_id
    `;
    
    const [buses] = await db.query(query);
    res.json({ buses });
    
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search buses by source and destination
exports.searchBuses = async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required.' });
  }

  try {
    const sourceSearch = `%${source.toLowerCase()}%`;
    const destinationSearch = `%${destination.toLowerCase()}%`;

    const query = `
      SELECT 
        b.bus_id, 
        b.bus_number, 
        b.capacity, 
        b.current_location, 
        b.status,
        r.route_name,
        r.distance_km,
        start_stop.stop_name as start_stop_name,
        start_stop.location as start_location,
        end_stop.stop_name as end_stop_name,
        end_stop.location as end_location
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.route_id
      LEFT JOIN busstops start_stop ON r.start_stop_id = start_stop.stop_id
      LEFT JOIN busstops end_stop ON r.end_stop_id = end_stop.stop_id
      WHERE (LOWER(start_stop.stop_name) LIKE ? OR LOWER(start_stop.location) LIKE ?)
      AND (LOWER(end_stop.stop_name) LIKE ? OR LOWER(end_stop.location) LIKE ?)
      ORDER BY b.bus_id
    `;
    
    const [buses] = await db.query(query, [sourceSearch, sourceSearch, destinationSearch, destinationSearch]);
    res.json({ buses });
    
  } catch (error) {
    console.error('Error searching buses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all bus stops
exports.getAllBusStops = async (req, res) => {
  try {
    const [stops] = await db.query('SELECT * FROM busstops ORDER BY stop_name');
    res.json({ stops });
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get real-time bus locations
exports.getBusLocations = async (req, res) => {
  try {
    const query = `
      SELECT 
        ds.id as session_id,
        ds.bus_number,
        ds.status,
        lu.latitude,
        lu.longitude,
        lu.speed,
        lu.bearing,
        lu.timestamp,
        dr.route_name
      FROM driver_sessions ds
      LEFT JOIN location_updates lu ON ds.id = lu.session_id
      LEFT JOIN driver_routes dr ON ds.route_id = dr.id
      WHERE ds.status = 'active'
      AND lu.id = (
        SELECT MAX(id) FROM location_updates lu2 WHERE lu2.session_id = ds.id
      )
      ORDER BY lu.timestamp DESC
    `;
    
    const [locations] = await db.query(query);
    res.json({ locations });
    
  } catch (error) {
    console.error('Error fetching bus locations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get detailed bus information with driver and route details
exports.getBusDetails = async (req, res) => {
  const { busId } = req.params;
  
  if (!busId) {
    return res.status(400).json({ message: 'Bus ID is required.' });
  }

  try {
    const query = `
      SELECT 
        b.bus_id, 
        b.bus_number, 
        b.capacity, 
        b.current_location, 
        b.status,
        r.route_id,
        r.route_name,
        r.distance_km,
        start_stop.stop_id as start_stop_id,
        start_stop.stop_name as start_stop_name,
        start_stop.location as start_location,
        end_stop.stop_id as end_stop_id,
        end_stop.stop_name as end_stop_name,
        end_stop.location as end_location,
        dr.driver_id,
        u.name as driver_name,
        u.phone as driver_phone
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.route_id
      LEFT JOIN busstops start_stop ON r.start_stop_id = start_stop.stop_id
      LEFT JOIN busstops end_stop ON r.end_stop_id = end_stop.stop_id
      LEFT JOIN driver_routes dr ON r.route_id = dr.route_id
      LEFT JOIN users u ON dr.driver_id = u.user_id
      WHERE b.bus_id = ?
    `;
    
    const [buses] = await db.query(query, [busId]);
    
    if (buses.length === 0) {
      return res.status(404).json({ message: 'Bus not found.' });
    }
    
    res.json({ bus: buses[0] });
    
  } catch (error) {
    console.error('Error fetching bus details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get real-time location for a specific bus
exports.getBusLocationById = async (req, res) => {
  const { busId } = req.params;
  
  if (!busId) {
    return res.status(400).json({ message: 'Bus ID is required.' });
  }

  try {
    // First get the bus info
    const busQuery = `
      SELECT bus_id, bus_number, current_location, status
      FROM buses 
      WHERE bus_id = ?
    `;
    
    const [busInfo] = await db.query(busQuery, [busId]);
    
    if (busInfo.length === 0) {
      return res.status(404).json({ message: 'Bus not found.' });
    }
    
    // Then get real-time location if available
    const locationQuery = `
      SELECT 
        ds.id as session_id,
        ds.bus_number,
        ds.status as session_status,
        lu.latitude,
        lu.longitude,
        lu.speed,
        lu.bearing,
        lu.timestamp
      FROM driver_sessions ds
      LEFT JOIN location_updates lu ON ds.id = lu.session_id
      WHERE ds.bus_number = ?
      AND ds.status = 'active'
      AND lu.id = (
        SELECT MAX(id) FROM location_updates lu2 WHERE lu2.session_id = ds.id
      )
      ORDER BY lu.timestamp DESC
      LIMIT 1
    `;
    
    const [realTimeLocation] = await db.query(locationQuery, [busInfo[0].bus_number]);
    
    const result = {
      bus_id: busInfo[0].bus_id,
      bus_number: busInfo[0].bus_number,
      status: busInfo[0].status,
      stored_location: busInfo[0].current_location,
      real_time_location: realTimeLocation.length > 0 ? {
        latitude: realTimeLocation[0].latitude,
        longitude: realTimeLocation[0].longitude,
        speed: realTimeLocation[0].speed,
        bearing: realTimeLocation[0].bearing,
        timestamp: realTimeLocation[0].timestamp,
        session_id: realTimeLocation[0].session_id
      } : null,
      is_live: realTimeLocation.length > 0 && busInfo[0].status === 'active'
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching bus location:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get route stops for a bus
exports.getBusRoute = async (req, res) => {
  const { busId } = req.params;
  
  if (!busId) {
    return res.status(400).json({ message: 'Bus ID is required.' });
  }

  try {
    const query = `
      SELECT 
        rs.stop_id,
        rs.stop_order,
        rs.arrival_time,
        bs.stop_name,
        bs.location,
        r.route_name,
        r.distance_km
      FROM buses b
      JOIN routes r ON b.route_id = r.route_id
      JOIN route_stops rs ON r.route_id = rs.route_id
      JOIN busstops bs ON rs.stop_id = bs.stop_id
      WHERE b.bus_id = ?
      ORDER BY rs.stop_order
    `;
    
    const [stops] = await db.query(query, [busId]);
    
    if (stops.length === 0) {
      return res.status(404).json({ message: 'No route found for this bus.' });
    }
    
    res.json({ 
      route_name: stops[0].route_name,
      distance_km: stops[0].distance_km,
      stops: stops.map(stop => ({
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        location: stop.location,
        stop_order: stop.stop_order,
        arrival_time: stop.arrival_time
      }))
    });
    
  } catch (error) {
    console.error('Error fetching bus route:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Simple test endpoint to check bus data
exports.testBusData = async (req, res) => {
  try {
    const [buses] = await db.query('SELECT * FROM buses LIMIT 5');
    const [routes] = await db.query('SELECT * FROM routes LIMIT 3');
    const [stops] = await db.query('SELECT * FROM busstops LIMIT 5');
    
    res.json({
      buses: buses.length,
      routes: routes.length,
      stops: stops.length,
      sample_bus: buses[0] || null,
      sample_route: routes[0] || null,
      sample_stop: stops[0] || null
    });
  } catch (error) {
    console.error('Error testing bus data:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Seed dummy data for testing (idempotent)
// Export all database data
exports.exportAllData = async (req, res) => {
  try {
    console.log('Starting complete database export...');
    
    const exportData = {
      export_info: {
        timestamp: new Date().toISOString(),
        database: 'defaultdb',
        exported_by: 'SmartBus Admin'
      },
      tables: {}
    };

    // 1. Export Users (excluding sensitive data)
    try {
      const [users] = await db.query('SELECT user_id, name, email, phone, role, profile_image, created_at, updated_at FROM users ORDER BY user_id');
      exportData.tables.users = {
        count: users.length,
        data: users
      };
      console.log(`✅ Exported ${users.length} users`);
    } catch (e) {
      exportData.tables.users = { error: e.message, count: 0 };
    }

    // 2. Export Bus Stops
    try {
      const [busstops] = await db.query('SELECT * FROM busstops ORDER BY stop_id');
      exportData.tables.busstops = {
        count: busstops.length,
        data: busstops
      };
      console.log(`✅ Exported ${busstops.length} bus stops`);
    } catch (e) {
      exportData.tables.busstops = { error: e.message, count: 0 };
    }

    // 3. Export Routes
    try {
      const [routes] = await db.query('SELECT * FROM routes ORDER BY route_id');
      exportData.tables.routes = {
        count: routes.length,
        data: routes
      };
      console.log(`✅ Exported ${routes.length} routes`);
    } catch (e) {
      exportData.tables.routes = { error: e.message, count: 0 };
    }

    // 4. Export Buses
    try {
      const [buses] = await db.query('SELECT * FROM buses ORDER BY bus_id');
      exportData.tables.buses = {
        count: buses.length,
        data: buses
      };
      console.log(`✅ Exported ${buses.length} buses`);
    } catch (e) {
      exportData.tables.buses = { error: e.message, count: 0 };
    }

    // 5. Export Route Stops
    try {
      const [routeStops] = await db.query('SELECT * FROM route_stops ORDER BY route_id, stop_order');
      exportData.tables.route_stops = {
        count: routeStops.length,
        data: routeStops
      };
      console.log(`✅ Exported ${routeStops.length} route stops`);
    } catch (e) {
      exportData.tables.route_stops = { error: e.message, count: 0 };
    }

    // 6. Export Driver Routes
    try {
      const [driverRoutes] = await db.query('SELECT * FROM driver_routes ORDER BY id');
      exportData.tables.driver_routes = {
        count: driverRoutes.length,
        data: driverRoutes
      };
      console.log(`✅ Exported ${driverRoutes.length} driver routes`);
    } catch (e) {
      exportData.tables.driver_routes = { error: e.message, count: 0 };
    }

    // 7. Export Driver Sessions
    try {
      const [driverSessions] = await db.query('SELECT * FROM driver_sessions ORDER BY id');
      exportData.tables.driver_sessions = {
        count: driverSessions.length,
        data: driverSessions
      };
      console.log(`✅ Exported ${driverSessions.length} driver sessions`);
    } catch (e) {
      exportData.tables.driver_sessions = { error: e.message, count: 0 };
    }

    // 8. Export Location Updates (last 100 records)
    try {
      const [locationUpdates] = await db.query('SELECT * FROM location_updates ORDER BY timestamp DESC LIMIT 100');
      exportData.tables.location_updates = {
        count: locationUpdates.length,
        note: 'Last 100 records only',
        data: locationUpdates
      };
      console.log(`✅ Exported ${locationUpdates.length} location updates`);
    } catch (e) {
      exportData.tables.location_updates = { error: e.message, count: 0 };
    }

    // 9. Export Notifications
    try {
      const [notifications] = await db.query('SELECT * FROM notifications ORDER BY sent_at DESC');
      exportData.tables.notifications = {
        count: notifications.length,
        data: notifications
      };
      console.log(`✅ Exported ${notifications.length} notifications`);
    } catch (e) {
      exportData.tables.notifications = { error: e.message, count: 0 };
    }

    // 10. Export Reports
    try {
      const [reports] = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
      exportData.tables.reports = {
        count: reports.length,
        data: reports
      };
      console.log(`✅ Exported ${reports.length} reports`);
    } catch (e) {
      exportData.tables.reports = { error: e.message, count: 0 };
    }

    // Summary
    const totalRecords = Object.values(exportData.tables).reduce((sum, table) => sum + (table.count || 0), 0);
    exportData.summary = {
      total_tables: Object.keys(exportData.tables).length,
      total_records: totalRecords,
      export_status: 'success'
    };

    console.log(`🎉 Database export completed: ${totalRecords} total records from ${Object.keys(exportData.tables).length} tables`);
    
    res.json(exportData);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      message: 'Database export failed', 
      error: error.message
    });
  }
};

exports.seedTestData = async (req, res) => {
  try {
    console.log('Starting simple seed operation...');

    // Just seed essential bus stops first
    const stops = [
      { name: 'ISBT Chandigarh', location: 'Chandigarh', region: 'Chandigarh' },
      { name: 'Phagwara Bus Stop', location: 'Phagwara', region: 'Punjab' },
      { name: 'Jalandhar Bus Stand', location: 'Jalandhar', region: 'Punjab' },
    ];

    for (const s of stops) {
      try {
        const [existing] = await db.query(
          'SELECT stop_id FROM busstops WHERE stop_name = ? LIMIT 1',
          [s.name]
        );
        if (existing.length === 0) {
          await db.query(
            'INSERT INTO busstops (stop_name, location, region) VALUES (?, ?, ?)',
            [s.name, s.location, s.region]
          );
          console.log(`✅ Created stop: ${s.name}`);
        } else {
          console.log(`✓ Stop exists: ${s.name}`);
        }
      } catch (stopError) {
        console.log(`⚠️ Error with stop ${s.name}:`, stopError.message);
      }
    }

    // Create a simple bus entry with location
    console.log('Creating test bus...');
    const busNumber = 'PB09CD4321';
    const currentLoc = '31.2240,75.7739'; // Phagwara coordinates (will show as "Near Phagwara Bus Stop")
    
    try {
      const [busExisting] = await db.query(
        'SELECT bus_id FROM buses WHERE bus_number = ? LIMIT 1',
        [busNumber]
      );
      
      if (busExisting.length > 0) {
        await db.query(
          'UPDATE buses SET capacity = ?, status = ?, current_location = ? WHERE bus_id = ?',
          [50, 'active', currentLoc, busExisting[0].bus_id]
        );
        console.log('✅ Updated existing bus');
      } else {
        await db.query(
          'INSERT INTO buses (bus_number, capacity, status, current_location) VALUES (?, ?, ?, ?)',
          [busNumber, 50, 'active', currentLoc]
        );
        console.log('✅ Created new bus');
      }
    } catch (busError) {
      console.log('⚠️ Bus creation error:', busError.message);
    }

    console.log('✅ Seed operation completed!');
    res.json({ 
      success: true,
      message: 'Test data seeded successfully!', 
      data: {
        bus_number: busNumber,
        bus_location: currentLoc,
        stops_created: stops.length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Failed to seed data', 
      error: error.message,
      stack: error.stack
    });
  }
};
