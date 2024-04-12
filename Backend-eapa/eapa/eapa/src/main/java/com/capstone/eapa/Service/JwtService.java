package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;


@Service
public class JwtService {
    //a 256-bit secret key
    private final String SECRET_KEY = "cf5d3d81870ce64c796b9ba15856edbd31d9b8097519ca938d479bf377d78f59";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    //method to check if token is valid via username and token expiration time
    public boolean isValid(String token, UserDetails user){
        String username = extractUsername(token);
        return (username.equals(user.getUsername())) && !isTokenExpired(token) ;
    }

    //method to check if token is expired
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    //extracting specific claim
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    //method to extract all the claims eg. subject(), issuedAt(), expiration(), etc.
    private Claims extractAllClaims(String token){
        return Jwts
                .parser()
                .verifyWith(getLoginKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //method to generate token
    public String generateToken(UserEntity user){
        String token = Jwts
                .builder()
                .subject(user.getUsername())
                .claim("role", user.getRole())
                .claim("workID", user.getWorkID())
                .claim("userID", user.getUserID())
                .claim("workEmail", user.getWorkEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 8 * 60 * 60 * 1000))
                .signWith(getLoginKey())
                .compact();

        return token;
    }

    //method to get the login key
    private SecretKey getLoginKey(){
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
