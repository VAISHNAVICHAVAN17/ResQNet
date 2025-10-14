package com.relief.disasterrelief.config;

import com.relief.disasterrelief.security.JwtRequestFilter;
import com.relief.disasterrelief.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    private final CustomUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    @Autowired
    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtRequestFilter jwtRequestFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
            		// Allow ALL authenticated users to GET volunteer/donation data
            		.requestMatchers(HttpMethod.GET, "/api/volunteers/all", "/api/donations/unassigned")
            		    .authenticated()
            		// Only admin/ngo can assign (POST)
            		.requestMatchers(HttpMethod.POST, "/api/donations/*/assign")
            		    .hasAnyRole("Admin", "NGO")

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/ocr/**").permitAll()
                .requestMatchers("/api/verify/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/ngo/all").authenticated()
                // Allow ADMIN, NGO, or VOLUNTEER for provider assignment endpoints
                .requestMatchers("/api/ngo/**").hasAnyRole("NGO", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("Admin")
                .requestMatchers("/api/volunteers/**").hasAnyRole("Admin", "Provider", "Volunteer")
                .requestMatchers("/api/requester/**").hasRole("Requester")
                .requestMatchers("/api/admin/**").hasRole("Admin")
                .requestMatchers("/api/users/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Autowired
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
        // Password encoder configuration as before
    }
}
