import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) return true;
      else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return sessionStorage.getItem('id');
  }

  login(idToken) {
    sessionStorage.setItem('id', idToken);

    window.location.assign('/');
  }

  logout() {
    sessionStorage.removeItem('id');

    window.location.assign('/');
  }
}

export default new AuthService();
