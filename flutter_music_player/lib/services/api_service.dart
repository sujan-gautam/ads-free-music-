import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/track.dart';
import '../models/playlist.dart';
import '../models/lyrics.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client();

  // Search YouTube
  Future<List<Track>> search(String query) async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.SEARCH}?q=${Uri.encodeComponent(query)}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final results = data['results'] as List<dynamic>;
        return results.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Search failed: ${response.statusCode}');
      }
    } catch (e) {
      print('Search error: $e');
      rethrow;
    }
  }

  // Get trending tracks
  Future<List<Track>> getTrending() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.TRENDING}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final results = data['results'] as List<dynamic>;
        return results.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Failed to fetch trending');
      }
    } catch (e) {
      print('Trending error: $e');
      rethrow;
    }
  }

  // Get explore category
  Future<List<Track>> getExploreCategory(String category) async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.EXPLORE}?category=$category'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final results = data['results'] as List<dynamic>;
        return results.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Failed to fetch category');
      }
    } catch (e) {
      print('Explore error: $e');
      rethrow;
    }
  }

  // Get play history
  Future<List<Track>> getHistory() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.HISTORY}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final history = data['history'] as List<dynamic>;
        return history.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Failed to fetch history');
      }
    } catch (e) {
      print('History error: $e');
      return [];
    }
  }

  // Get favorites
  Future<List<Track>> getFavorites() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.FAVORITES}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final favorites = data['favorites'] as List<dynamic>;
        return favorites.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Failed to fetch favorites');
      }
    } catch (e) {
      print('Favorites error: $e');
      return [];
    }
  }

  // Toggle favorite
  Future<bool> toggleFavorite(Track track) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.FAVORITES}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(track.toJson()),
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['isFavorite'] ?? false;
      } else {
        throw Exception('Failed to toggle favorite');
      }
    } catch (e) {
      print('Toggle favorite error: $e');
      rethrow;
    }
  }

  // Get playlists
  Future<List<Playlist>> getPlaylists() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.PLAYLISTS}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final playlists = data['playlists'] as List<dynamic>;
        return playlists.map((p) => Playlist.fromJson(p)).toList();
      } else {
        throw Exception('Failed to fetch playlists');
      }
    } catch (e) {
      print('Playlists error: $e');
      return [];
    }
  }

  // Create playlist
  Future<Playlist?> createPlaylist(String name) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.PLAYLISTS}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': name}),
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Playlist.fromJson(data['playlist']);
      } else {
        throw Exception('Failed to create playlist');
      }
    } catch (e) {
      print('Create playlist error: $e');
      return null;
    }
  }

  // Add to playlist
  Future<bool> addToPlaylist(String playlistId, Track track) async {
    try {
      final response = await _client.post(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.PLAYLISTS}/$playlistId/add'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(track.toJson()),
      ).timeout(ApiConfig.connectionTimeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Add to playlist error: $e');
      return false;
    }
  }

  // Remove from playlist
  Future<bool> removeFromPlaylist(String playlistId, String videoId) async {
    try {
      final response = await _client.delete(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.PLAYLISTS}/$playlistId/tracks/$videoId'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Remove from playlist error: $e');
      return false;
    }
  }

  // Delete playlist
  Future<bool> deletePlaylist(String playlistId) async {
    try {
      final response = await _client.delete(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.PLAYLISTS}/$playlistId'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Delete playlist error: $e');
      return false;
    }
  }

  // Get YouTube Music playlists
  Future<Map<String, List<YoutubePlaylist>>> getYoutubePlaylists() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.YOUTUBE_PLAYLISTS}'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final playlists = data['playlists'] as Map<String, dynamic>;
        
        return playlists.map((key, value) {
          final list = (value as List<dynamic>)
              .map((p) => YoutubePlaylist.fromJson(p))
              .toList();
          return MapEntry(key, list);
        });
      } else {
        throw Exception('Failed to fetch YouTube playlists');
      }
    } catch (e) {
      print('YouTube playlists error: $e');
      return {};
    }
  }

  // Get YouTube playlist tracks
  Future<List<Track>> getYoutubePlaylistTracks(String playlistId) async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}${ApiConfig.YOUTUBE_PLAYLIST_DETAIL}/$playlistId'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final tracks = data['tracks'] as List<dynamic>;
        return tracks.map((t) => Track.fromJson(t)).toList();
      } else {
        throw Exception('Failed to fetch playlist tracks');
      }
    } catch (e) {
      print('YouTube playlist tracks error: $e');
      return [];
    }
  }

  // Get lyrics
  Future<Lyrics?> getLyrics(Track track) async {
    try {
      final uri = Uri.parse('${ApiConfig.API_URL}${ApiConfig.LYRICS}').replace(
        queryParameters: {
          'videoId': track.videoId,
          'title': track.title,
          'artist': track.uploader,
          'duration': track.duration.toString(),
        },
      );

      final response = await _client.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      ).timeout(ApiConfig.connectionTimeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['lyrics'] != null) {
          return Lyrics.fromJson(data['lyrics']);
        }
      }
      return null;
    } catch (e) {
      print('Lyrics error: $e');
      return null;
    }
  }

  // Get stream URL
  String getStreamUrl(Track track) {
    return '${ApiConfig.API_URL}${ApiConfig.STREAM}?url=${Uri.encodeComponent(track.url)}';
  }

  // Health check
  Future<bool> healthCheck() async {
    try {
      final response = await _client.get(
        Uri.parse('${ApiConfig.API_URL}/health'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      print('Health check error: $e');
      return false;
    }
  }

  void dispose() {
    _client.close();
  }
}
