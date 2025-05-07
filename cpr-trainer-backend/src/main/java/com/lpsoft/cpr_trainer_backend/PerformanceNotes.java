package com.lpsoft.cpr_trainer_backend;

public class PerformanceNotes {
    private int id;
    private int performanceid;
    private String notetype;

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
