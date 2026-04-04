import 'package:logx/src/core/log_entry.dart';

abstract class LogOutput {
  Future<void> write(LogEntry entry);
  Future<void> close();
}