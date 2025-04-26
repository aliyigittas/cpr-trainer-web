package com.lpsoft.cpr_trainer_backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "performanceDetails")
public class PerformanceDetails {

    @Id
    private int id; // You need a primary key! I'll explain below.

    @Column(name = "performanceId")
    private int performanceId;

    @Column(name = "detailType")
    private String detailType;

    @Column(name = "val")
    private Double val;

    // Constructors
    public PerformanceDetails() {
    }

    public PerformanceDetails(int id, int performanceId, String detailType, Double val) {
        this.id = id;
        this.performanceId = performanceId;
        this.detailType = detailType;
        this.val = val;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPerformanceId() {
        return performanceId;
    }

    public void setPerformanceId(int performanceId) {
        this.performanceId = performanceId;
    }

    public String getDetailType() {
        return detailType;
    }

    public void setDetailType(String detailType) {
        this.detailType = detailType;
    }

    public Double getVal() {
        return val;
    }

    public void setVal(Double val) {
        this.val = val;
    }
}
