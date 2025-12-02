import 'track.dart';

class Playlist {
  final String id;
  final String name;
  final List<Track> tracks;
  final DateTime createdAt;

  Playlist({
    required this.id,
    required this.name,
    required this.tracks,
    required this.createdAt,
  });

  factory Playlist.fromJson(Map<String, dynamic> json) {
    return Playlist(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Untitled Playlist',
      tracks: (json['tracks'] as List<dynamic>?)
              ?.map((t) => Track.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'tracks': tracks.map((t) => t.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Playlist copyWith({
    String? id,
    String? name,
    List<Track>? tracks,
    DateTime? createdAt,
  }) {
    return Playlist(
      id: id ?? this.id,
      name: name ?? this.name,
      tracks: tracks ?? this.tracks,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  int get trackCount => tracks.length;

  int get totalDuration => tracks.fold(0, (sum, track) => sum + track.duration);

  String get formattedDuration {
    final minutes = totalDuration ~/ 60;
    final hours = minutes ~/ 60;
    if (hours > 0) {
      return '$hours hr ${minutes % 60} min';
    }
    return '$minutes min';
  }
}

class YoutubePlaylist {
  final String id;
  final String name;
  final String description;
  final int songs;
  final String query;

  YoutubePlaylist({
    required this.id,
    required this.name,
    required this.description,
    required this.songs,
    required this.query,
  });

  factory YoutubePlaylist.fromJson(Map<String, dynamic> json) {
    return YoutubePlaylist(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Untitled',
      description: json['description'] ?? '',
      songs: json['songs'] ?? 0,
      query: json['query'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'songs': songs,
      'query': query,
    };
  }
}
