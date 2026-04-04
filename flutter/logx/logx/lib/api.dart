/// LogX Public API
/// Import this file once in your main.dart and use 'log' everywhere else

library logx;

// Core exports
export 'src/config/logger_config.dart';
export 'src/core/log_entry.dart';
export 'src/core/log_level.dart';
export 'src/core/logger.dart' show Logger;
export 'src/outputs/log_output.dart';
export 'src/outputs/console_output.dart';
export 'src/outputs/memory_output.dart';
export 'src/outputs/file_output.dart';
export 'src/inspector/log_inspector_server.dart' show LogInspectorServer;

// Core imports for implementation
import 'src/core/logger.dart';
import 'src/config/logger_config.dart';
import 'src/core/log_level.dart';

/// Simplified initialization API
class LogX {
  /// Initialize with custom config
  static Future<void> initialize(LoggerConfig config) async {
    await Logger.init(config);
  }
  
  /// Initialize with development config (default)
  static Future<void> initializeDev() async {
    await Logger.init(LoggerConfig.development());
  }
  
  /// Initialize with production config
  static Future<void> initializeProd() async {
    await Logger.init(LoggerConfig.production());
  }
  
  /// Initialize with custom settings
  static Future<void> initializeWithSettings({
    LogLevel minLevel = LogLevel.debug,
    bool enableCallerTracing = true,
    bool enableWebInspector = false,
    int inspectorPort = 8080,
    bool enableFileOutput = false,
    String? logDirectory,
  }) async {
    final config = LoggerConfig(
      minLevel: minLevel,
      enableCallerTracing: enableCallerTracing,
      enableWebInspector: enableWebInspector,
      inspectorPort: inspectorPort,
      enableFileOutput: enableFileOutput,
      logDirectory: logDirectory,
    );
    await Logger.init(config);
  }
  
  /// Check if logger is ready
  static bool get isReady => Logger.isInitialized;
  
  /// Get the underlying logger
  static Logger get logger => Logger.instance;
  
  /// Dispose logger
  static Future<void> dispose() async {
    await Logger.instance.dispose();
  }
  
  /// Clear all memory logs (only works if memory output is enabled)
  static Future<void> clearMemoryLogs() async {
    final memoryOutput = Logger.instance.memoryOutput;
    if (memoryOutput != null) {
      await memoryOutput.clear();
    }
  }
  
  /// Get current memory logs (only works if memory output is enabled)
  static Future<List<LogEntry>> getMemoryLogs() async {
    final memoryOutput = Logger.instance.memoryOutput;
    if (memoryOutput != null) {
      return await memoryOutput.getLogs();
    }
    return [];
  }
  
  /// Get filtered memory logs
  static Future<List<LogEntry>> getFilteredLogs({
    LogLevel? minLevel,
    String? file,
    String? searchTerm,
  }) async {
    final memoryOutput = Logger.instance.memoryOutput;
    if (memoryOutput != null) {
      return await memoryOutput.getFilteredLogs(
        minLevel: minLevel,
        file: file,
        searchTerm: searchTerm,
      );
    }
    return [];
  }
}

/// Global log instance - available everywhere after initialization
/// Use: log.info('message') from any file without import
Logger get log => Logger.instance;

/// Extension methods for easy logging on any object
extension LoggingExtension on Object {
  /// Get logger instance
  Logger get log => Logger.instance;
  
  /// Quick debug log
  void logDebug(String message, {Map<String, dynamic>? metadata}) {
    Logger.instance.debug(message, metadata: metadata);
  }
  
  /// Quick info log
  void logInfo(String message, {Map<String, dynamic>? metadata}) {
    Logger.instance.info(message, metadata: metadata);
  }
  
  /// Quick warning log
  void logWarning(String message, {Map<String, dynamic>? metadata}) {
    Logger.instance.warning(message, metadata: metadata);
  }
  
  /// Quick error log
  void logError(String message, {Map<String, dynamic>? metadata}) {
    Logger.instance.error(message, metadata: metadata);
  }
}

/// Extension for async operations to add automatic logging
extension FutureLoggingExtension<T> on Future<T> {
  /// Log when future completes successfully or with error
  Future<T> withLogging(String operation, {Map<String, dynamic>? metadata}) {
    return this.then((value) {
      Logger.instance.debug('$operation completed successfully', metadata: metadata);
      return value;
    }).catchError((error, stack) {
      Logger.instance.error('$operation failed', metadata: {
        ...?metadata,
        'error': error.toString(),
        'stackTrace': stack.toString(),
      });
      throw error;
    });
  }
  
  /// Log only on error
  Future<T> logError(String operation, {Map<String, dynamic>? metadata}) {
    return this.catchError((error, stack) {
      Logger.instance.error('$operation failed', metadata: {
        ...?metadata,
        'error': error.toString(),
        'stackTrace': stack.toString(),
      });
      throw error;
    });
  }
}

/// Extension for Stream to add automatic logging
extension StreamLoggingExtension<T> on Stream<T> {
  /// Log stream events
  Stream<T> withLogging(String name, {Map<String, dynamic>? metadata}) {
    return this.transform(StreamTransformer.fromHandlers(
      handleData: (data, sink) {
        Logger.instance.debug('$name emitted data', metadata: metadata);
        sink.add(data);
      },
      handleError: (error, stack, sink) {
        Logger.instance.error('$name error', metadata: {
          ...?metadata,
          'error': error.toString(),
          'stackTrace': stack.toString(),
        });
        sink.addError(error, stack);
      },
      handleDone: (sink) {
        Logger.instance.debug('$name completed', metadata: metadata);
        sink.close();
      },
    ));
  }
}