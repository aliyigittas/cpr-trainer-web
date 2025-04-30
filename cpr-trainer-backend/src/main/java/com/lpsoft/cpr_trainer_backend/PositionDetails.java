package com.lpsoft.cpr_trainer_backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "positiondetails")
public class PositionDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int performanceId;

    private int compressionId;

    private Double val;

    // Getter and Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter and Setter for positionId
    public int getPositionId() {
        return performanceId;
    }

    public void setPositionId(int performanceId) {
        this.performanceId = performanceId;
    }

    // Getter and Setter for compressionId
    public int getCompressionId() {
        return compressionId;
    }

    public void setCompressionId(int compressionId) {
        this.compressionId = compressionId;
    }

    // Getter and Setter for val
    public Double getVal() {
        return val;
    }

    public void setVal(Double val) {
        this.val = val;
    }
}

