enum LogLevel {
  debug(0, 'DEBUG'),
  info(1, 'INFO'),
  warning(2, 'WARN'),
  error(3, 'ERROR');

  final int priority;
  final String label;

  const LogLevel(this.priority, this.label);

  bool operator >=(LogLevel other) => priority >= other.priority;
  
  static LogLevel fromString(String level) {
    return LogLevel.values.firstWhere(
      (e) => e.label == level.toUpperCase(),
      orElse: () => LogLevel.info,
    );
  }
}