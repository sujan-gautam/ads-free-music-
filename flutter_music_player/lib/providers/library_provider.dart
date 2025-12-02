import 'package:flutter/foundation.dart';
import '../models/track.dart';
import '../models/playlist.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class LibraryProvider with ChangeNotifier {
  final ApiService _api = ApiService();
  final StorageService _storage = StorageService();

  List<Track> _favorites = [];
  List<Playlist> _playlists = [];
  List<Track> _history = [];
  bool _isLoading = false;

  // Getters
  List<Track> get favorites => _favorites;
  List<Playlist> get playlists => _playlists;
  List<Track> get history => _history;
  bool get isLoading => _isLoading;

  LibraryProvider() {
    _initialize();
  }

  Future<void> _initialize() async {
    // Load from local storage first
    _favorites = _storage.getFavorites();
    _playlists = _storage.getPlaylists();
    notifyListeners();

    // Then fetch from server
    await fetchAll();
  }

  // Fetch all library data
  Future<void> fetchAll() async {
    _isLoading = true;
    notifyListeners();

    try {
      await Future.wait([
        fetchFavorites(),
        fetchPlaylists(),
        fetchHistory(),
      ]);
    } catch (e) {
      print('Fetch all error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Fetch favorites
  Future<void> fetchFavorites() async {
    try {
      _favorites = await _api.getFavorites();
      await _storage.saveFavorites(_favorites);
      notifyListeners();
    } catch (e) {
      print('Fetch favorites error: $e');
    }
  }

  // Toggle favorite
  Future<bool> toggleFavorite(Track track) async {
    try {
      final isFavorite = await _api.toggleFavorite(track);
      
      if (isFavorite) {
        if (!_favorites.any((t) => t.videoId == track.videoId)) {
          _favorites.insert(0, track);
        }
      } else {
        _favorites.removeWhere((t) => t.videoId == track.videoId);
      }
      
      await _storage.saveFavorites(_favorites);
      notifyListeners();
      return isFavorite;
    } catch (e) {
      print('Toggle favorite error: $e');
      return false;
    }
  }

  // Check if track is favorite
  bool isFavorite(Track track) {
    return _favorites.any((t) => t.videoId == track.videoId);
  }

  // Fetch playlists
  Future<void> fetchPlaylists() async {
    try {
      _playlists = await _api.getPlaylists();
      await _storage.savePlaylists(_playlists);
      notifyListeners();
    } catch (e) {
      print('Fetch playlists error: $e');
    }
  }

  // Create playlist
  Future<bool> createPlaylist(String name) async {
    try {
      final playlist = await _api.createPlaylist(name);
      if (playlist != null) {
        _playlists.add(playlist);
        await _storage.savePlaylists(_playlists);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Create playlist error: $e');
      return false;
    }
  }

  // Add to playlist
  Future<bool> addToPlaylist(String playlistId, Track track) async {
    try {
      final success = await _api.addToPlaylist(playlistId, track);
      if (success) {
        final index = _playlists.indexWhere((p) => p.id == playlistId);
        if (index != -1) {
          final playlist = _playlists[index];
          if (!playlist.tracks.any((t) => t.videoId == track.videoId)) {
            _playlists[index] = playlist.copyWith(
              tracks: [...playlist.tracks, track],
            );
            await _storage.savePlaylists(_playlists);
            notifyListeners();
          }
        }
      }
      return success;
    } catch (e) {
      print('Add to playlist error: $e');
      return false;
    }
  }

  // Remove from playlist
  Future<bool> removeFromPlaylist(String playlistId, String videoId) async {
    try {
      final success = await _api.removeFromPlaylist(playlistId, videoId);
      if (success) {
        final index = _playlists.indexWhere((p) => p.id == playlistId);
        if (index != -1) {
          final playlist = _playlists[index];
          _playlists[index] = playlist.copyWith(
            tracks: playlist.tracks.where((t) => t.videoId != videoId).toList(),
          );
          await _storage.savePlaylists(_playlists);
          notifyListeners();
        }
      }
      return success;
    } catch (e) {
      print('Remove from playlist error: $e');
      return false;
    }
  }

  // Delete playlist
  Future<bool> deletePlaylist(String playlistId) async {
    try {
      final success = await _api.deletePlaylist(playlistId);
      if (success) {
        _playlists.removeWhere((p) => p.id == playlistId);
        await _storage.savePlaylists(_playlists);
        notifyListeners();
      }
      return success;
    } catch (e) {
      print('Delete playlist error: $e');
      return false;
    }
  }

  // Fetch history
  Future<void> fetchHistory() async {
    try {
      _history = await _api.getHistory();
      notifyListeners();
    } catch (e) {
      print('Fetch history error: $e');
    }
  }

  // Get playlist by ID
  Playlist? getPlaylistById(String id) {
    try {
      return _playlists.firstWhere((p) => p.id == id);
    } catch (e) {
      return null;
    }
  }
}
