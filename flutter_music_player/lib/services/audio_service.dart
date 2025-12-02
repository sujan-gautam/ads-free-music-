import 'package:just_audio/just_audio.dart';
import 'package:audio_service/audio_service.dart';
import '../models/track.dart';
import 'api_service.dart';

class AudioPlayerService {
  static final AudioPlayerService _instance = AudioPlayerService._internal();
  factory AudioPlayerService() => _instance;
  AudioPlayerService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();
  final ApiService _apiService = ApiService();

  AudioPlayer get player => _audioPlayer;

  // Initialize audio service
  Future<void> initialize() async {
    try {
      // Set up audio session for iOS
      await _audioPlayer.setAudioSource(
        AudioSource.uri(Uri.parse('')),
        preload: false,
      );
    } catch (e) {
      print('Audio player initialization error: $e');
    }
  }

  // Play track
  Future<void> playTrack(Track track) async {
    try {
      final streamUrl = _apiService.getStreamUrl(track);
      print('Playing: ${track.title}');
      print('Stream URL: $streamUrl');

      await _audioPlayer.setAudioSource(
        AudioSource.uri(
          Uri.parse(streamUrl),
          tag: MediaItem(
            id: track.videoId,
            title: track.title,
            artist: track.uploader,
            artUri: Uri.parse(track.thumbnail),
            duration: Duration(seconds: track.duration),
          ),
        ),
      );

      await _audioPlayer.play();
    } catch (e) {
      print('Play track error: $e');
      rethrow;
    }
  }

  // Play/Pause toggle
  Future<void> togglePlayPause() async {
    if (_audioPlayer.playing) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.play();
    }
  }

  // Play
  Future<void> play() async {
    await _audioPlayer.play();
  }

  // Pause
  Future<void> pause() async {
    await _audioPlayer.pause();
  }

  // Stop
  Future<void> stop() async {
    await _audioPlayer.stop();
  }

  // Seek
  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
  }

  // Set volume (0.0 to 1.0)
  Future<void> setVolume(double volume) async {
    await _audioPlayer.setVolume(volume.clamp(0.0, 1.0));
  }

  // Set speed
  Future<void> setSpeed(double speed) async {
    await _audioPlayer.setSpeed(speed);
  }

  // Set loop mode
  Future<void> setLoopMode(LoopMode loopMode) async {
    await _audioPlayer.setLoopMode(loopMode);
  }

  // Set shuffle mode
  Future<void> setShuffleModeEnabled(bool enabled) async {
    await _audioPlayer.setShuffleModeEnabled(enabled);
  }

  // Seek forward
  Future<void> seekForward(Duration duration) async {
    final newPosition = _audioPlayer.position + duration;
    final maxPosition = _audioPlayer.duration ?? Duration.zero;
    await _audioPlayer.seek(
      newPosition > maxPosition ? maxPosition : newPosition,
    );
  }

  // Seek backward
  Future<void> seekBackward(Duration duration) async {
    final newPosition = _audioPlayer.position - duration;
    await _audioPlayer.seek(
      newPosition < Duration.zero ? Duration.zero : newPosition,
    );
  }

  // Get current position
  Duration get position => _audioPlayer.position;

  // Get duration
  Duration? get duration => _audioPlayer.duration;

  // Get playing state
  bool get isPlaying => _audioPlayer.playing;

  // Get buffered position
  Duration get bufferedPosition => _audioPlayer.bufferedPosition;

  // Get volume
  double get volume => _audioPlayer.volume;

  // Get speed
  double get speed => _audioPlayer.speed;

  // Get loop mode
  LoopMode get loopMode => _audioPlayer.loopMode;

  // Get shuffle mode
  bool get shuffleModeEnabled => _audioPlayer.shuffleModeEnabled;

  // Stream: Position
  Stream<Duration> get positionStream => _audioPlayer.positionStream;

  // Stream: Duration
  Stream<Duration?> get durationStream => _audioPlayer.durationStream;

  // Stream: Playing state
  Stream<bool> get playingStream => _audioPlayer.playingStream;

  // Stream: Buffered position
  Stream<Duration> get bufferedPositionStream => _audioPlayer.bufferedPositionStream;

  // Stream: Player state
  Stream<PlayerState> get playerStateStream => _audioPlayer.playerStateStream;

  // Stream: Sequence state (for queue management)
  Stream<SequenceState?> get sequenceStateStream => _audioPlayer.sequenceStateStream;

  // Stream: Volume
  Stream<double> get volumeStream => _audioPlayer.volumeStream;

  // Stream: Speed
  Stream<double> get speedStream => _audioPlayer.speedStream;

  // Stream: Loop mode
  Stream<LoopMode> get loopModeStream => _audioPlayer.loopModeStream;

  // Stream: Shuffle mode
  Stream<bool> get shuffleModeEnabledStream => _audioPlayer.shuffleModeEnabledStream;

  // Dispose
  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }
}

// Custom audio handler for background playback
class CustomAudioHandler extends BaseAudioHandler {
  final AudioPlayerService _audioService = AudioPlayerService();

  CustomAudioHandler() {
    _init();
  }

  void _init() {
    // Listen to player state changes
    _audioService.playerStateStream.listen((state) {
      playbackState.add(playbackState.value.copyWith(
        playing: state.playing,
        processingState: _getProcessingState(state.processingState),
      ));
    });

    // Listen to position changes
    _audioService.positionStream.listen((position) {
      playbackState.add(playbackState.value.copyWith(
        updatePosition: position,
      ));
    });
  }

  AudioProcessingState _getProcessingState(ProcessingState state) {
    switch (state) {
      case ProcessingState.idle:
        return AudioProcessingState.idle;
      case ProcessingState.loading:
        return AudioProcessingState.loading;
      case ProcessingState.buffering:
        return AudioProcessingState.buffering;
      case ProcessingState.ready:
        return AudioProcessingState.ready;
      case ProcessingState.completed:
        return AudioProcessingState.completed;
    }
  }

  @override
  Future<void> play() => _audioService.play();

  @override
  Future<void> pause() => _audioService.pause();

  @override
  Future<void> stop() => _audioService.stop();

  @override
  Future<void> seek(Duration position) => _audioService.seek(position);

  @override
  Future<void> setSpeed(double speed) => _audioService.setSpeed(speed);

  @override
  Future<void> setRepeatMode(AudioServiceRepeatMode repeatMode) async {
    switch (repeatMode) {
      case AudioServiceRepeatMode.none:
        await _audioService.setLoopMode(LoopMode.off);
        break;
      case AudioServiceRepeatMode.one:
        await _audioService.setLoopMode(LoopMode.one);
        break;
      case AudioServiceRepeatMode.all:
        await _audioService.setLoopMode(LoopMode.all);
        break;
      case AudioServiceRepeatMode.group:
        await _audioService.setLoopMode(LoopMode.all);
        break;
    }
  }

  @override
  Future<void> setShuffleMode(AudioServiceShuffleMode shuffleMode) async {
    await _audioService.setShuffleModeEnabled(
      shuffleMode == AudioServiceShuffleMode.all,
    );
  }

  @override
  Future<void> fastForward() => _audioService.seekForward(const Duration(seconds: 10));

  @override
  Future<void> rewind() => _audioService.seekBackward(const Duration(seconds: 10));
}
