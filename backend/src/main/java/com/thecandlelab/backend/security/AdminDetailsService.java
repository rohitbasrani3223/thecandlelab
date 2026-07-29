package com.thecandlelab.backend.security;

import com.thecandlelab.backend.entity.Admin;
import com.thecandlelab.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + email));

        return User.builder()
            .username(admin.getEmail())
            .password(admin.getPasswordHash())
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole())))
            .accountExpired(false)
            .accountLocked(admin.getStatus().equals("SUSPENDED"))
            .credentialsExpired(false)
            .disabled(admin.getStatus().equals("INACTIVE"))
            .build();
    }
}
