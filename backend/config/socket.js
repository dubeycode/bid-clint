const socketIO = require('socket.io');

const setupSocket = (server) => {
  // Normalize URLs to handle trailing slashes
  const normalizeUrl = (url) => {
    if (!url) return url;
    return url.trim().replace(/\/+$/, ''); // Remove trailing slashes
  };

  const getAllowedOrigins = () => {
    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl) return ['http://localhost:5173'];
    
    // Support comma-separated multiple origins
    return clientUrl.split(',').map(normalizeUrl);
  };

  const allowedOrigins = getAllowedOrigins();

  // Helper to check if origin is allowed (handles trailing slashes)
  const isOriginAllowed = (origin) => {
    if (!origin) return true; // Allow requests with no origin
    
    const normalizedOrigin = normalizeUrl(origin);
    
    // Check if normalized origin matches any allowed origin
    return allowedOrigins.some(allowed => {
      const normalizedAllowed = normalizeUrl(allowed);
      return normalizedOrigin === normalizedAllowed || origin === normalizedAllowed;
    });
  };

  const io = socketIO(server, {
    cors: {
      origin: function (origin, callback) {
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          console.warn(`Socket CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(` User connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(` User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = setupSocket;