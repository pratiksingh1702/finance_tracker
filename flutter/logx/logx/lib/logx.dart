/// LogX - Production-grade logging for Flutter
/// 
/// Import this file once in your main.dart:
/// ```dart
/// import 'package:logx/logx.dart';
/// 
/// void main() async {
///   await LogX.initializeDev();
///   runApp(MyApp());
/// }
/// ```
/// 
/// Then use 'log' anywhere in your app without any imports:
/// ```dart
/// log.info('Hello world');
/// log.debug('Debug message');
/// log.error('Error occurred');
/// ```

export 'api.dart';