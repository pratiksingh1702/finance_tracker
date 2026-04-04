// ONLY ONE IMPORT - in the entire app!
import 'package:logx/logx.dart';

// No need to import logx anywhere else in any file!

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // ONE-TIME INITIALIZATION
  await LogX.initializeDev();  // Development mode with web inspector
  // await LogX.initializeProd(); // Production mode
  
  log.info('App starting', metadata: {'version': '1.0.0'});
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LogX Demo',
      theme: ThemeData.dark(),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Global log access - NO IMPORT NEEDED!
    log.info('HomeScreen initialized');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LogX Demo'),
        backgroundColor: Colors.teal,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Open browser to http://localhost:8080\nfor live log inspector',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _addDebugLog(),
              child: const Text('Add Debug Log'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => _addInfoLog(),
              child: const Text('Add Info Log'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => _addWarningLog(),
              child: const Text('Add Warning Log'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => _addErrorLog(),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              child: const Text('Add Error Log'),
            ),
            const SizedBox(height: 30),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[900],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Column(
                children: [
                  Text('✓ No import needed in this file'),
                  Text('✓ log.info() works globally'),
                  Text('✓ this.logDebug() extension available'),
                  Text('✓ Automatic caller detection active'),
                ],
                style: TextStyle(fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _addDebugLog() {
    log.debug('Debug button clicked at ${DateTime.now()}');
    _showSnackBar('Debug log added');
  }

  void _addInfoLog() {
    log.info('User performed info action');
    _showSnackBar('Info log added');
  }

  void _addWarningLog() {
    log.warning('Warning: Something unusual happened');
    _showSnackBar('Warning log added');
  }

  void _addErrorLog() {
    log.error('Error occurred!', metadata: {
      'timestamp': DateTime.now().toIso8601String(),
      'userAction': 'button_click',
    });
    _showSnackBar('Error log added');
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }
}