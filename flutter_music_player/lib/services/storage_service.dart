import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/track.dart';
import '../models/playlist.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  SharedPreferences? _prefs;

  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Keys
  static const String _queueKey = 'queue';
  static const String _currentTrackKey = 'current_track';
  static const String _volumeKey = 'volume';
  static const String _shuffleKey = 'shuffle';
  static const String _repeatKey = 'repeat';
  static const String _favoritesKey = 'favorites';
  static const String _playlistsKey = 'playlists';

  // Queue
  Future<void> saveQueue(List<Track> queue) async {
    final jsonList = queue.map((t) => t.toJson()).toList();
    await _prefs?.setString(_queueKey, json.encode(jsonList));
  }

  List<Track> getQueue() {
    final jsonString = _prefs?.getString(_queueKey);
    if (jsonString == null) return [];
    
    try {
      final jsonList = json.decode(jsonString) as List<dynamic>;
      return jsonList.map((j) => Track.fromJson(j)).toList();
    } catch (e) {
      return [];
    }
  }

  // Current Track
  Future<void> saveCurrentTrack(Track? track) async {
    if (track == null) {
      await _prefs?.remove(_currentTrackKey);
    } else {
      await _prefs?.setString(_currentTrackKey, json.encode(track.toJson()));
    }
  }

  Track? getCurrentTrack() {
    final jsonString = _prefs?.getString(_currentTrackKey);
    if (jsonString == null) return null;
    
    try {
      return Track.fromJson(json.decode(jsonString));
    } catch (e) {
      return null;
    }
  }

  // Volume
  Future<void> saveVolume(double volume) async {
    await _prefs?.setDouble(_volumeKey, volume);
  }

  double getVolume() {
    return _prefs?.getDouble(_volumeKey) ?? 1.0;
  }

  // Shuffle
  Future<void> saveShuffle(bool shuffle) async {
    await _prefs?.setBool(_shuffleKey, shuffle);
  }

  bool getShuffle() {
    return _prefs?.getBool(_shuffleKey) ?? false;
  }

  // Repeat
  Future<void> saveRepeat(bool repeat) async {
    await _prefs?.setBool(_repeatKey, repeat);
  }

  bool getRepeat() {
    return _prefs?.getBool(_repeatKey) ?? false;
  }

  // Favorites (local cache)
  Future<void> saveFavorites(List<Track> favorites) async {
    final jsonList = favorites.map((t) => t.toJson()).toList();
    await _prefs?.setString(_favoritesKey, json.encode(jsonList));
  }

  List<Track> getFavorites() {
    final jsonString = _prefs?.getString(_favoritesKey);
    if (jsonString == null) return [];
    
    try {
      final jsonList = json.decode(jsonString) as List<dynamic>;
      return jsonList.map((j) => Track.fromJson(j)).toList();
    } catch (e) {
      return [];
    }
  }

  // Playlists (local cache)
  Future<void> savePlaylists(List<Playlist> playlists) async {
    final jsonList = playlists.map((p) => p.toJson()).toList();
    await _prefs?.setString(_playlistsKey, json.encode(jsonList));
  }

  List<Playlist> getPlaylists() {
    final jsonString = _prefs?.getString(_playlistsKey);
    if (jsonString == null) return [];
    
    try {
      final jsonList = json.decode(jsonString) as List<dynamic>;
      return jsonList.map((j) => Playlist.fromJson(j)).toList();
    } catch (e) {
      return [];
    }
  }

  // Clear all data
  Future<void> clearAll() async {
    await _prefs?.clear();
  }
}
