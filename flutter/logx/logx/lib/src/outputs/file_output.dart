import 'dart:convert';
import 'dart:io';
import 'package:logx/src/core/log_entry.dart';
import 'package:logx/src/outputs/log_output.dart';
import 'package:path_provider/path_provider.dart';
import 'package:synchronized/synchronized.dart';

class FileOutput extends LogOutput {
  final String directory;
  final Lock _lock = Lock();
  File? _currentFile;
  IOSink? _sink;
  DateTime? _currentDate;

  FileOutput({required this.directory});

  Future<void> _ensureInitialized() async {
    if (_sink != null) return;

    await _lock.synchronized(() async {
      if (_sink != null) return;

      final dir = Directory(directory);
      if (!await dir.exists()) {
        await dir.create(recursive: true);
      }

      _currentDate = DateTime.now();
      final fileName = 'log_${_formatDate(_currentDate!)}.log';
      _currentFile = File('${dir.path}/$fileName');
      _sink = _currentFile!.openWrite(mode: FileMode.append);
    });
  }

  @override
  Future<void> write(LogEntry entry) async {
    await _ensureInitialized();
    
    final now = DateTime.now();
    if (_currentDate!.day != now.day) {
      await _rotateFile(now);
    }

    await _lock.synchronized(() async {
      _sink?.writeln(jsonEncode(entry.toJson()));
      await _sink?.flush();
    });
  }

  Future<void> _rotateFile(DateTime newDate) async {
    await _lock.synchronized(() async {
      await _sink?.close();
      _currentDate = newDate;
      final fileName = 'log_${_formatDate(newDate)}.log';
      final dir = Directory(directory);
      _currentFile = File('${dir.path}/$fileName');
      _sink = _currentFile!.openWrite(mode: FileMode.append);
    });
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  @override
  Future<void> close() async {
    await _lock.synchronized(() async {
      await _sink?.close();
    });
  }
}