import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:logx/src/outputs/memory_output.dart';
import 'package:logx/src/core/log_entry.dart';
import 'package:logx/src/core/log_level.dart';
import 'package:logx/src/inspector/web_ui.dart';

class LogInspectorServer {
  final MemoryOutput _memoryOutput;
  final int _port;
  HttpServer? _httpServer;
  final List<WebSocketChannel> _clients = [];

  LogInspectorServer({
    required MemoryOutput memoryOutput,
    required int port,
  }) : _memoryOutput = memoryOutput, _port = port;

  Future<void> start() async {
    final handler = const Pipeline()
        .addMiddleware(logRequests())
        .addMiddleware(_webSocketHandler())
        .addHandler(_requestHandler);

    _httpServer = await shelf_io.serve(handler, InternetAddress.anyIPv4, _port);
    
    _memoryOutput.stream.listen((entry) {
      _broadcastLog(entry);
    });

    // ignore: avoid_print
    print('📊 LogX Inspector running at http://localhost:$_port');
  }

  Middleware _webSocketHandler() {
    return webSocketHandler((WebSocketChannel channel, String? protocol) {
      _clients.add(channel);
      channel.sink.done.then((_) {
        _clients.remove(channel);
      });
    });
  }

  Future<Response> _requestHandler(Request request) async {
    final path = request.url.path;

    if (path == '/logs' && request.method == 'GET') {
      final queryParams = request.url.queryParameters;
      final minLevel = queryParams['level'];
      final file = queryParams['file'];
      final search = queryParams['search'];

      final logs = await _memoryOutput.getFilteredLogs(
        minLevel: minLevel != null ? LogLevel.fromString(minLevel) : null,
        file: file,
        searchTerm: search,
      );

      return Response.ok(
        jsonEncode(logs.map((e) => e.toJson()).toList()),
        headers: {'Content-Type': 'application/json'},
      );
    }

    if (path == '/' || path == '/index.html') {
      return Response.ok(
        WebUI.html,
        headers: {'Content-Type': 'text/html'},
      );
    }

    return Response.notFound('Not found');
  }

  void _broadcastLog(LogEntry entry) {
    final message = jsonEncode(entry.toJson());
    for (final client in _clients) {
      client.sink.add(message);
    }
  }

  Future<void> stop() async {
    for (final client in _clients) {
      await client.sink.close();
    }
    await _httpServer?.close(force: true);
  }
}