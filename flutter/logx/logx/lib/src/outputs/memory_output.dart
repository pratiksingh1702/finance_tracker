import 'dart:async';
import 'package:logx/src/core/log_entry.dart';
import 'package:logx/src/core/log_level.dart';
import 'package:logx/src/outputs/log_output.dart';
import 'package:synchronized/synchronized.dart';

class MemoryOutput extends LogOutput {
  final List<LogEntry> _logs = [];
  final Lock _lock = Lock();
  final StreamController<LogEntry> _controller = StreamController<LogEntry>.broadcast();

  Stream<LogEntry> get stream => _controller.stream;

  Future<List<LogEntry>> getLogs() async {
    return await _lock.synchronized(() => List.unmodifiable(_logs));
  }

  Future<List<LogEntry>> getFilteredLogs({
    LogLevel? minLevel,
    String? file,
    String? searchTerm,
  }) async {
    final logs = await getLogs();
    
    return logs.where((log) {
      if (minLevel != null && log.level.priority < minLevel.priority) {
        return false;
      }
      if (file != null && !log.file.contains(file)) {
        return false;
      }
      if (searchTerm != null && 
          !log.message.toLowerCase().contains(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    }).toList();
  }

  Future<void> clear() async {
    await _lock.synchronized(() {
      _logs.clear();
    });
  }

  @override
  Future<void> write(LogEntry entry) async {
    await _lock.synchronized(() {
      _logs.add(entry);
      _controller.add(entry);
    });
  }

  @override
  Future<void> close() async {
    await _controller.close();
  }
}