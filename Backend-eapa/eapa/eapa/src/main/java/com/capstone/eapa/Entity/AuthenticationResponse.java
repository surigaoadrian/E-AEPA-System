package com.capstone.eapa.Entity;

public class AuthenticationResponse {
    private String token;
    private int userID;
    

    public AuthenticationResponse(String token, int userID) {
        this.token = token;
        this.userID = userID;
    }


    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }
}
