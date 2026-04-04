// NO IMPORT NEEDED! log is globally available

class AuthService {
  Future<bool> login(String email, String password) async {
    log.info('Login attempt', metadata: {'email': email});
    
    if (email.isEmpty || password.isEmpty) {
      log.warning('Login failed: empty credentials');
      return false;
    }
    
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));
    
    log.info('Login successful', metadata: {'email': email});
    return true;
  }
  
  void logout() {
    log.debug('User logged out');
  }
}