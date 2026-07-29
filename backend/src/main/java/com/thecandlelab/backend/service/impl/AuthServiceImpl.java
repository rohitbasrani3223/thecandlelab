package com.thecandlelab.backend.service.impl;

import com.thecandlelab.backend.dto.request.LoginRequest;
import com.thecandlelab.backend.dto.response.AuthResponse;
import com.thecandlelab.backend.entity.Admin;
import com.thecandlelab.backend.exception.BadRequestException;
import com.thecandlelab.backend.exception.ResourceNotFoundException;
import com.thecandlelab.backend.repository.AdminRepository;
import com.thecandlelab.backend.security.JwtUtil;
import com.thecandlelab.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BadRequestException("Invalid email or password");
        }

        Admin admin = adminRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("Admin", "email", request.getEmail()));

        if (!admin.getStatus().equals("ACTIVE")) {
            throw new BadRequestException("Your account has been " + admin.getStatus().toLowerCase() + ". Please contact Super Admin.");
        }

        // Update last login
        admin.setLastLogin(LocalDateTime.now());
        admin.setLoginCount(admin.getLoginCount() == null ? 1 : admin.getLoginCount() + 1);
        adminRepository.save(admin);

        String accessToken = jwtUtil.generateAccessToken(admin.getEmail(), admin.getId(), admin.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getEmail());

        log.info("Admin logged in: {}", admin.getEmail());

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .adminId(admin.getId())
            .fullName(admin.getFullName())
            .email(admin.getEmail())
            .role(admin.getRole())
            .avatar(admin.getAvatar())
            .expiresAt(LocalDateTime.now().plusDays(1))
            .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new BadRequestException("Refresh token has expired. Please login again.");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        Admin admin = adminRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(() -> new ResourceNotFoundException("Admin", "email", email));

        String newAccessToken = jwtUtil.generateAccessToken(admin.getEmail(), admin.getId(), admin.getRole());
        String newRefreshToken = jwtUtil.generateRefreshToken(admin.getEmail());

        return AuthResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .tokenType("Bearer")
            .adminId(admin.getId())
            .fullName(admin.getFullName())
            .email(admin.getEmail())
            .role(admin.getRole())
            .avatar(admin.getAvatar())
            .expiresAt(LocalDateTime.now().plusDays(1))
            .build();
    }

    @Override
    public void logout(String token) {
        // Token invalidation is handled client-side
        // For production: implement token blacklisting in Redis
        log.info("Admin logged out, token invalidated client-side");
    }
}
