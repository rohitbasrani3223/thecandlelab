package com.thecandlelab.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UUID adminId;
    private String fullName;
    private String email;
    private String role;
    private String avatar;
    private LocalDateTime expiresAt;
}
