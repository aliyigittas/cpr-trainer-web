package com.lpsoft.cpr_trainer_backend;

public class User {
    private int id;

    private String firstname;

    private String surname;

    private String username;

    private String email;

    private String password;

    private String khasID;

    private String role;

    private String createdAt;

    private int status;
 
    // Constructor

    public User() {}
 
    // Full Constructor

    public User(int id, String firstname, String surname, String username, String email, String password, String khasID, String role, String createdAt, int status) {

        this.id = id;

        this.firstname = firstname;

        this.surname = surname;

        this.username = username;

        this.email = email;

        this.password = password;

        this.khasID = khasID;

        this.role = role;

        this.createdAt = createdAt;

        this.status = status;

    }
 
    // Getters and Setters

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }
 
    public String getFirstname() { return firstname; }

    public void setFirstname(String firstname) { this.firstname = firstname; }
 
    public String getSurname() { return surname; }

    public void setSurname(String surname) { this.surname = surname; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }
 
    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }
 
    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }
 
    public String getKhasID() { return khasID; }

    public void setKhasID(String khasID) { this.khasID = khasID; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getCreatedAt() { return createdAt; }

    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public int getStatus() {return status;}

    public void setStatus(int status) {this.status = status;}
}

 