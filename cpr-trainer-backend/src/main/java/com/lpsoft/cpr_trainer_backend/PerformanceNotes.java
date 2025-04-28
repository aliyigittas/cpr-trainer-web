package com.lpsoft.cpr_trainer_backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "performancenotes")
public class PerformanceNotes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int performanceid;
    private String notetype;

    @Column(columnDefinition = "TEXT")
    private String note;

    // Constructors
    public PerformanceNotes() {
    }

    public PerformanceNotes(int id, int performanceid, String notetype, String note) {
        this.id = id;
        this.performanceid = performanceid;
        this.notetype = notetype;
        this.note = note;
    }

    // Getters and Setters
    public int getid() {
        return id;
    }

    public void setid(int id) {
        this.id = id;
    }

    public int getPerformanceid() {
        return performanceid;
    }

    public void setPerformanceid(int performanceid) {
        this.performanceid = performanceid;
    }

    public String getNotetype() {
        return notetype;
    }

    public void setNotetype(String notetype) {
        this.notetype = notetype;
    }

    public String getnote() {
        return note;
    }

    public void setnote(String note) {
        this.note = note;
    }
}
