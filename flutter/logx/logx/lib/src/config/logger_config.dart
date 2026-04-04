import 'package:logx/src/core/log_level.dart';
import 'package:logx/src/outputs/log_output.dart';

import '../../api.dart';

class LoggerConfig {
  final LogLevel minLevel;
  final bool enableCallerTracing;
  final List<LogOutput> outputs;
  final bool enableWebInspector;
  final int? inspectorPort;
  final bool enableFileOutput;
  final String? logDirectory;

  const LoggerConfig({
    this.minLevel = LogLevel.debug,
    this.enableCallerTracing = true,
    this.outputs = const [],
    this.enableWebInspector = false,
    this.inspectorPort = 8080,
    this.enableFileOutput = false,
    this.logDirectory,
  });

  factory LoggerConfig.production() => const LoggerConfig(
    minLevel: LogLevel.info,
    enableCallerTracing: false,
    enableWebInspector: false,
    enableFileOutput: true,
    logDirectory: './logs',
  );

  factory LoggerConfig.development() => const LoggerConfig(
    minLevel: LogLevel.debug,
    enableCallerTracing: true,
    enableWebInspector: true,
    enableFileOutput: false,
  );
}