import 'package:logx/src/parsers/frame_parser.dart';

class StackTraceParser {
  static const List<String> _internalLoggerFrames = [
    'log.debug',
    'log.info',
    'log.warning',
    'log.error',
    'Logger._log',
    'Logger.log',
    'StackTraceParser._',
    'LogEntry._',
    '_log',
    'debug',
    'info',
    'warning',
    'error',
  ];

  static StackFrameInfo? parse(StackTrace stackTrace, {bool enabled = true}) {
    if (!enabled) return null;

    try {
      final frames = stackTrace.toString().split('\n');
      
      for (final frame in frames) {
        if (frame.trim().isEmpty) continue;
        
        final parsed = FrameParser.parse(frame);
        if (parsed == null) continue;
        
        if (!_isInternalLoggerFrame(parsed.function)) {
          return parsed;
        }
      }
      
      return null;
    } catch (e) {
      return StackFrameInfo(
        file: 'unknown',
        line: 0,
        function: 'unknown',
      );
    }
  }

  static bool _isInternalLoggerFrame(String function) {
    final lowerFunction = function.toLowerCase();
    return _internalLoggerFrames.any((pattern) => 
      lowerFunction.contains(pattern.toLowerCase()));
  }
}