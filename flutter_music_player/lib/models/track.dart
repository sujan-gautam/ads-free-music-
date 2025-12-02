class Track {
  final String videoId;
  final String title;
  final String uploader;
  final String thumbnail;
  final int duration;
  final String url;
  final DateTime? playedAt;

  Track({
    required this.videoId,
    required this.title,
    required this.uploader,
    required this.thumbnail,
    required this.duration,
    required this.url,
    this.playedAt,
  });

  factory Track.fromJson(Map<String, dynamic> json) {
    return Track(
      videoId: json['videoId'] ?? '',
      title: json['title'] ?? 'Unknown Title',
      uploader: json['uploader'] ?? 'Unknown Artist',
      thumbnail: json['thumbnail'] ?? '',
      duration: json['duration'] ?? 0,
      url: json['url'] ?? '',
      playedAt: json['playedAt'] != null 
          ? DateTime.parse(json['playedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'videoId': videoId,
      'title': title,
      'uploader': uploader,
      'thumbnail': thumbnail,
      'duration': duration,
      'url': url,
      if (playedAt != null) 'playedAt': playedAt!.toIso8601String(),
    };
  }

  Track copyWith({
    String? videoId,
    String? title,
    String? uploader,
    String? thumbnail,
    int? duration,
    String? url,
    DateTime? playedAt,
  }) {
    return Track(
      videoId: videoId ?? this.videoId,
      title: title ?? this.title,
      uploader: uploader ?? this.uploader,
      thumbnail: thumbnail ?? this.thumbnail,
      duration: duration ?? this.duration,
      url: url ?? this.url,
      playedAt: playedAt ?? this.playedAt,
    );
  }

  String get formattedDuration {
    final minutes = duration ~/ 60;
    final seconds = duration % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Track &&
          runtimeType == other.runtimeType &&
          videoId == other.videoId;

  @override
  int get hashCode => videoId.hashCode;
}
