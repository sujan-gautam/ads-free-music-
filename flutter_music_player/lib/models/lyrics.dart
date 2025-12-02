class LyricLine {
  final double startTime;
  final String text;

  LyricLine({
    required this.startTime,
    required this.text,
  });

  factory LyricLine.fromJson(Map<String, dynamic> json) {
    return LyricLine(
      startTime: (json['startTime'] ?? 0).toDouble(),
      text: json['text'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'startTime': startTime,
      'text': text,
    };
  }
}

class Lyrics {
  final String videoId;
  final String title;
  final String artist;
  final List<LyricLine> lines;
  final String source;
  final bool isSynced;

  Lyrics({
    required this.videoId,
    required this.title,
    required this.artist,
    required this.lines,
    required this.source,
    this.isSynced = false,
  });

  factory Lyrics.fromJson(Map<String, dynamic> json) {
    return Lyrics(
      videoId: json['videoId'] ?? '',
      title: json['title'] ?? '',
      artist: json['artist'] ?? '',
      lines: (json['lines'] as List<dynamic>?)
              ?.map((l) => LyricLine.fromJson(l as Map<String, dynamic>))
              .toList() ??
          [],
      source: json['source'] ?? 'unknown',
      isSynced: json['isSynced'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'videoId': videoId,
      'title': title,
      'artist': artist,
      'lines': lines.map((l) => l.toJson()).toList(),
      'source': source,
      'isSynced': isSynced,
    };
  }

  String get plainText => lines.map((l) => l.text).join('\n');

  LyricLine? getCurrentLine(double currentTime) {
    if (lines.isEmpty) return null;

    for (int i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].startTime) {
        return lines[i];
      }
    }
    return lines.first;
  }

  int? getCurrentLineIndex(double currentTime) {
    if (lines.isEmpty) return null;

    for (int i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].startTime) {
        return i;
      }
    }
    return 0;
  }
}
