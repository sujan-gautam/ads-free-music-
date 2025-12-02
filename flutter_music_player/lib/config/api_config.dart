class ApiConfig {
  // IMPORTANT: Change this to your backend server URL
  // For local development on Mac: use your Mac's local IP address
  // For production: use your deployed server URL
  static const String API_URL = "http://localhost:5000";
  
  // If running backend on Mac and testing on iPhone:
  // 1. Find your Mac's IP: System Preferences → Network
  // 2. Replace localhost with your Mac's IP, e.g., "http://192.168.1.100:5000"
  
  // API Endpoints
  static const String STREAM = "/stream";
  static const String SEARCH = "/search";
  static const String METADATA = "/metadata";
  static const String TRENDING = "/trending";
  static const String EXPLORE = "/explore";
  static const String FAVORITES = "/favorites";
  static const String PLAYLISTS = "/playlists";
  static const String HISTORY = "/history";
  static const String LYRICS = "/lyrics";
  static const String YOUTUBE_PLAYLISTS = "/youtube-music/playlists";
  static const String YOUTUBE_PLAYLIST_DETAIL = "/youtube-music/playlist";
  
  // Socket.IO
  static String get socketUrl => API_URL;
  
  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
