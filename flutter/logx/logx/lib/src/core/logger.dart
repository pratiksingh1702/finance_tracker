import 'dart:async';
import 'package:logx/src/config/logger_config.dart';
import 'package:logx/src/core/log_entry.dart';
import 'package:logx/src/core/log_level.dart';
import 'package:logx/src/parsers/stack_trace_parser.dart';
import 'package:logx/src/outputs/log_output.dart';
import 'package:logx/src/outputs/console_output.dart';
import 'package:logx/src/outputs/memory_output.dart';
import 'package:logx/src/outputs/file_output.dart';
import 'package:logx/src/inspector/log_inspector_server.dart';

Logger? _globalLogger;
bool _isInitialized = false;

class Logger {
  static Logger? _instance;
  final LoggerConfig _config;
  final List<LogOutput> _outputs = [];
  MemoryOutput? _memoryOutput;
  LogInspectorServer? _inspectorServer;

  Logger._(this._config) {
    _initializeOutputs();
    if (_config.enableWebInspector) {
      _startInspector();
    }
  }

  static Logger get instance {
    if (_instance == null) {
      throw StateError(
        'Logger not initialized. Call LogX.initialize() in main.dart first.'
      );
    }
    return _instance!;
  }
  
  static bool get isInitialized => _isInitialized;

  static Future<void> init(LoggerConfig config) async {
    if (_isInitialized) {
      return;
    }
    
    _instance = Logger._(config);
    _isInitialized = true;
    _globalLogger = _instance;
    
    await _instance?._log(LogLevel.info, 'Logger initialized', 
        metadata: {
          'minLevel': config.minLevel.label,
          'callerTracing': config.enableCallerTracing,
          'webInspector': config.enableWebInspector,
        });
  }

  void _initializeOutputs() {
    if (_config.outputs.isNotEmpty) {
      _outputs.addAll(_config.outputs);
    } else {
      _outputs.add(ConsoleOutput());
      
      if (_config.enableFileOutput) {
        final fileOutput = FileOutput(
          directory: _config.logDirectory ?? './logs',
        );
        _outputs.add(fileOutput);
      }
    }

    if (_config.enableWebInspector) {
      _memoryOutput = MemoryOutput();
      _outputs.add(_memoryOutput!);
    }
  }

  void _startInspector() {
    if (_memoryOutput == null) return;
    
    _inspectorServer = LogInspectorServer(
      memoryOutput: _memoryOutput!,
      port: _config.inspectorPort ?? 8080,
    );
    _inspectorServer?.start();
  }

  Future<void> debug(String message, {Map<String, dynamic>? metadata}) async {
    await _log(LogLevel.debug, message, metadata: metadata);
  }

  Future<void> info(String message, {Map<String, dynamic>? metadata}) async {
    await _log(LogLevel.info, message, metadata: metadata);
  }

  Future<void> warning(String message, {Map<String, dynamic>? metadata}) async {
    await _log(LogLevel.warning, message, metadata: metadata);
  }

  Future<void> error(String message, {Map<String, dynamic>? metadata}) async {
    await _log(LogLevel.error, message, metadata: metadata);
  }

  Future<void> _log(LogLevel level, String message, {Map<String, dynamic>? metadata}) async {
    if (level.priority < _config.minLevel.priority) return;

    final frameInfo = StackTraceParser.parse(
      StackTrace.current,
      enabled: _config.enableCallerTracing,
    );

    final entry = LogEntry(
      message: message,
      level: level,
      timestamp: DateTime.now(),
      file: frameInfo?.file ?? 'unknown',
      line: frameInfo?.line ?? 0,
      function: frameInfo?.function ?? 'unknown',
      metadata: metadata,
    );

    await Future.wait(_outputs.map((output) => output.write(entry)));
  }

  Future<void> dispose() async {
    await _inspectorServer?.stop();
    await Future.wait(_outputs.map((output) => output.close()));
    _isInitialized = false;
    _instance = null;
    _globalLogger = null;
  }
  
  MemoryOutput? get memoryOutput => _memoryOutput;
  List<LogOutput> get outputs => List.unmodifiable(_outputs);
}