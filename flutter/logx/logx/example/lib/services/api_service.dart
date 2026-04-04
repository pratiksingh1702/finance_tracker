// NO IMPORT NEEDED! log is globally available

class ApiService {
  Future<Map<String, dynamic>> fetchData(String endpoint) async {
    log.debug('Fetching from endpoint: $endpoint');
    
    try {
      // Simulate network request
      await Future.delayed(const Duration(milliseconds: 300));
      
      if (endpoint.isEmpty) {
        throw Exception('Invalid endpoint');
      }
      
      final data = {'status': 'success', 'data': 'Sample data'};
      log.info('Data fetched successfully', metadata: {'endpoint': endpoint});
      return data;
      
    } catch (e) {
      log.error('API call failed', metadata: {
        'endpoint': endpoint,
        'error': e.toString(),
      });
      rethrow;
    }
  }
}