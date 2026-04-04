class StackFrameInfo {
  final String file;
  final int line;
  final String function;

  StackFrameInfo({
    required this.file,
    required this.line,
    required this.function,
  });
}

class FrameParser {
  static final RegExp _dartFrameRegex = RegExp(
    r'^(?:package:)?([^/\s]+\.(?:dart|dart\?[\w-]+))\s+(\d+):\d+\s+(\w+)',
  );

  static final RegExp _flutterReleaseRegex = RegExp(
    r'#\d+\s+(\w+)\s+\(([^)]+):(\d+)\)',
  );

  static final RegExp _minifiedRegex = RegExp(r'^_\$\w+__\w+$');

  static StackFrameInfo? parse(String frameLine) {
    var match = _dartFrameRegex.firstMatch(frameLine);
    if (match != null) {
      return StackFrameInfo(
        file: _extractFileName(match.group(1)!),
        line: int.parse(match.group(2)!),
        function: _cleanFunctionName(match.group(3)!),
      );
    }

    match = _flutterReleaseRegex.firstMatch(frameLine);
    if (match != null) {
      return StackFrameInfo(
        file: _extractFileName(match.group(2)!),
        line: int.parse(match.group(3)!),
        function: _cleanFunctionName(match.group(1)!),
      );
    }

    final fileMatch = RegExp(r'([\w/]+\.dart):(\d+)').firstMatch(frameLine);
    if (fileMatch != null) {
      return StackFrameInfo(
        file: _extractFileName(fileMatch.group(1)!),
        line: int.parse(fileMatch.group(2)!),
        function: 'unknown',
      );
    }

    return null;
  }

  static String _extractFileName(String path) {
    final parts = path.split('/');
    return parts.last.split('?').first;
  }

  static String _cleanFunctionName(String name) {
    if (_minifiedRegex.hasMatch(name)) {
      return '<minified>';
    }
    return name.split('.').last;
  }
}