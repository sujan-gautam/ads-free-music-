import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';
import '../models/track.dart';
import '../services/audio_service.dart';
import '../services/storage_service.dart';

class PlayerProvider with ChangeNotifier {
  final AudioPlayerService _audioService = AudioPlayerService();
  final StorageService _storage = StorageService();

  Track? _currentTrack;
  List<Track> _queue = [];
  bool _isPlaying = false;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;
  Duration _bufferedPosition = Duration.zero;
  double _volume = 1.0;
  bool _shuffle = false;
  bool _repeat = false;

  // Getters
  Track? get currentTrack => _currentTrack;
  List<Track> get queue => _queue;
  bool get isPlaying => _isPlaying;
  Duration get position => _position;
  Duration get duration => _duration;
  Duration get bufferedPosition => _bufferedPosition;
  double get volume => _volume;
  bool get shuffle => _shuffle;
  bool get repeat => _repeat;
  double get progress => _duration.inMilliseconds > 0
      ? _position.inMilliseconds / _duration.inMilliseconds
      : 0.0;

  PlayerProvider() {
    _initialize();
  }

  Future<void> _initialize() async {
    // Initialize audio service
    await _audioService.initialize();

    // Load saved state
    _volume = _storage.getVolume();
    _shuffle = _storage.getShuffle();
    _repeat = _storage.getRepeat();
    _queue = _storage.getQueue();
    _currentTrack = _storage.getCurrentTrack();

    // Set initial volume
    await _audioService.setVolume(_volume);

    // Listen to audio player streams
    _audioService.playingStream.listen((playing) {
      _isPlaying = playing;
      notifyListeners();
    });

    _audioService.positionStream.listen((position) {
      _position = position;
      notifyListeners();
    });

    _audioService.durationStream.listen((duration) {
      if (duration != null) {
        _duration = duration;
        notifyListeners();
      }
    });

    _audioService.bufferedPositionStream.listen((buffered) {
      _bufferedPosition = buffered;
      notifyListeners();
    });

    _audioService.playerStateStream.listen((state) {
      // Handle track completion
      if (state.processingState == ProcessingState.completed) {
        _handleTrackCompleted();
      }
    });

    notifyListeners();
  }

  // Play track
  Future<void> playTrack(Track track, {List<Track>? contextTracks}) async {
    try {
      _currentTrack = track;
      
      // Set queue based on context
      if (contextTracks != null && contextTracks.isNotEmpty) {
        _queue = contextTracks;
      } else {
        // If track not in queue, add it
        if (!_queue.any((t) => t.videoId == track.videoId)) {
          _queue.add(track);
        }
      }

      await _audioService.playTrack(track);
      
      // Save state
      await _storage.saveCurrentTrack(track);
      await _storage.saveQueue(_queue);
      
      notifyListeners();
    } catch (e) {
      print('Play track error: $e');
      rethrow;
    }
  }

  // Toggle play/pause
  Future<void> togglePlayPause() async {
    await _audioService.togglePlayPause();
  }

  // Play
  Future<void> play() async {
    await _audioService.play();
  }

  // Pause
  Future<void> pause() async {
    await _audioService.pause();
  }

  // Next track
  Future<void> next() async {
    if (_queue.isEmpty || _currentTrack == null) return;

    final currentIndex = _queue.indexWhere((t) => t.videoId == _currentTrack!.videoId);
    
    if (_shuffle) {
      // Random track
      final randomIndex = (currentIndex + 1 + 
          (DateTime.now().millisecondsSinceEpoch % (_queue.length - 1))) % _queue.length;
      await playTrack(_queue[randomIndex]);
    } else {
      // Next track
      final nextIndex = currentIndex + 1;
      if (nextIndex < _queue.length) {
        await playTrack(_queue[nextIndex]);
      } else if (_repeat) {
        // Loop back to start
        await playTrack(_queue[0]);
      }
    }
  }

  // Previous track
  Future<void> previous() async {
    if (_queue.isEmpty || _currentTrack == null) return;

    // If more than 3 seconds into track, restart it
    if (_position.inSeconds > 3) {
      await seek(Duration.zero);
      return;
    }

    final currentIndex = _queue.indexWhere((t) => t.videoId == _currentTrack!.videoId);
    final prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      await playTrack(_queue[prevIndex]);
    } else if (_repeat) {
      // Loop to end
      await playTrack(_queue.last);
    }
  }

  // Seek
  Future<void> seek(Duration position) async {
    await _audioService.seek(position);
  }

  // Seek forward
  Future<void> seekForward() async {
    await _audioService.seekForward(const Duration(seconds: 10));
  }

  // Seek backward
  Future<void> seekBackward() async {
    await _audioService.seekBackward(const Duration(seconds: 10));
  }

  // Set volume
  Future<void> setVolume(double volume) async {
    _volume = volume.clamp(0.0, 1.0);
    await _audioService.setVolume(_volume);
    await _storage.saveVolume(_volume);
    notifyListeners();
  }

  // Toggle shuffle
  Future<void> toggleShuffle() async {
    _shuffle = !_shuffle;
    await _audioService.setShuffleModeEnabled(_shuffle);
    await _storage.saveShuffle(_shuffle);
    notifyListeners();
  }

  // Toggle repeat
  Future<void> toggleRepeat() async {
    _repeat = !_repeat;
    await _audioService.setLoopMode(_repeat ? LoopMode.all : LoopMode.off);
    await _storage.saveRepeat(_repeat);
    notifyListeners();
  }

  // Add to queue
  void addToQueue(Track track) {
    if (!_queue.any((t) => t.videoId == track.videoId)) {
      _queue.add(track);
      _storage.saveQueue(_queue);
      notifyListeners();
    }
  }

  // Remove from queue
  void removeFromQueue(int index) {
    if (index >= 0 && index < _queue.length) {
      _queue.removeAt(index);
      _storage.saveQueue(_queue);
      notifyListeners();
    }
  }

  // Clear queue
  void clearQueue() {
    _queue.clear();
    _storage.saveQueue(_queue);
    notifyListeners();
  }

  // Play from queue
  Future<void> playFromQueue(int index) async {
    if (index >= 0 && index < _queue.length) {
      await playTrack(_queue[index]);
    }
  }

  // Handle track completion
  void _handleTrackCompleted() {
    if (_repeat) {
      // Replay current track
      if (_currentTrack != null) {
        playTrack(_currentTrack!);
      }
    } else {
      // Play next track
      next();
    }
  }

  // Format duration
  String formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  void dispose() {
    _audioService.dispose();
    super.dispose();
  }
}
