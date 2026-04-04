import 'package:flutter/foundation.dart';
import 'package:logx/src/core/log_entry.dart';
import 'package:logx/src/core/log_level.dart';
import 'package:logx/src/outputs/log_output.dart';

class ConsoleOutput extends LogOutput {
  @override
  Future<void> write(LogEntry entry) async {
    if (kReleaseMode) {
      debugPrint('${entry.level.label}: ${entry.message}');
    } else {
      final color = _getColorForLevel(entry.level);
      final reset = '\x1B[0m';
      debugPrint('$color${entry.toString()}$reset');
    }
  }

  String _getColorForLevel(LogLevel level) {
    switch (level) {
      case LogLevel.debug:
        return '\x1B[90m';
      case LogLevel.info:
        return '\x1B[32m';
      case LogLevel.warning:
        return '\x1B[33m';
      case LogLevel.error:
        return '\x1B[31m';
    }
  }

  @override
  Future<void> close() async {}
}