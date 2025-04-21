package com.lpsoft.cpr_trainer_backend;

public class User {

    private int id;

    private String firstname;

    private String surname;

    private String email;

    private String password;

    private String khasID;
 
    // Constructor

    public User() {}
 
    // Full Constructor

    public User(int id, String firstname, String surname, String email, String password, String khasID) {

        this.id = id;

        this.firstname = firstname;

        this.surname = surname;

        this.email = email;

        this.password = password;

        this.khasID = khasID;

    }
 
    // Getters and Setters

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }
 
    public String getFirstname() { return firstname; }

    public void setFirstname(String firstname) { this.firstname = firstname; }
 
    public String getSurname() { return surname; }

    public void setSurname(String surname) { this.surname = surname; }
 
    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }
 
    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }
 
    public String getKhasID() { return khasID; }

    public void setKhasID(String khasID) { this.khasID = khasID; }

}

 