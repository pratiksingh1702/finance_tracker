import 'package:flutter_test/flutter_test.dart';
import 'package:logx/logx.dart';

void main() {
  setUp(() async {
    await LogX.initializeDev();
  });

  tearDown(() async {
    await LogX.dispose();
  });

  test('Global log access works without import', () {
    expect(() => log.info('test'), returnsNormally);
    expect(LogX.isReady, true);
  });

  test('Log entries are captured', () async {
    const testMessage = 'Test message';
    
    await log.info(testMessage);
    
    final logs = await log.memoryOutput?.getLogs();
    expect(logs, isNotNull);
    expect(logs!.any((e) => e.message == testMessage), true);
  });

  test('Caller detection works', () async {
    await log.debug('Test caller detection');
    
    final logs = await log.memoryOutput?.getLogs();
    final lastLog = logs?.last;
    
    expect(lastLog?.file, contains('logger_test.dart'));
    expect(lastLog?.line, greaterThan(0));
  });

  test('Log levels work correctly', () async {
    await log.debug('Debug message');
    await log.info('Info message');
    await log.warning('Warning message');
    await log.error('Error message');
    
    final logs = await log.memoryOutput?.getLogs();
    final levels = logs?.map((e) => e.level).toSet();
    
    expect(levels?.contains(LogLevel.debug), true);
    expect(levels?.contains(LogLevel.info), true);
    expect(levels?.contains(LogLevel.warning), true);
    expect(levels?.contains(LogLevel.error), true);
  });

  test('Metadata is preserved', () async {
    const testMetadata = {'key': 'value', 'number': 123};
    
    await log.info('With metadata', metadata: testMetadata);
    
    final logs = await log.memoryOutput?.getLogs();
    final lastLog = logs?.last;
    
    expect(lastLog?.metadata, isNotNull);
    expect(lastLog?.metadata?['key'], 'value');
    expect(lastLog?.metadata?['number'], 123);
  });
}