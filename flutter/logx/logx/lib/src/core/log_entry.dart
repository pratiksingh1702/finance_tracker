import 'package:logx/src/core/log_level.dart';

class LogEntry {
  final String message;
  final LogLevel level;
  final DateTime timestamp;
  final String file;
  final int line;
  final String function;
  final Map<String, dynamic>? metadata;

  LogEntry({
    required this.message,
    required this.level,
    required this.timestamp,
    required this.file,
    required this.line,
    required this.function,
    this.metadata,
  });

  Map<String, dynamic> toJson() => {
    'message': message,
    'level': level.label,
    'timestamp': timestamp.toIso8601String(),
    'file': file,
    'line': line,
    'function': function,
    'metadata': metadata,
  };

  factory LogEntry.fromJson(Map<String, dynamic> json) => LogEntry(
    message: json['message'] as String,
    level: LogLevel.fromString(json['level'] as String),
    timestamp: DateTime.parse(json['timestamp'] as String),
    file: json['file'] as String,
    line: json['line'] as int,
    function: json['function'] as String,
    metadata: json['metadata'] as Map<String, dynamic>?,
  );

  @override
  String toString() {
    return '${timestamp.toIso8601String()} [${level.label}] '
        '$file:$line - $function() - $message';
  }
}