package com.thecandlelab.backend.service;

import com.thecandlelab.backend.dto.request.LoginRequest;
import com.thecandlelab.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String token);
}
