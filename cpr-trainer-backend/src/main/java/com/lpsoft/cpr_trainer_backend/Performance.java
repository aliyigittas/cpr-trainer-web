package com.lpsoft.cpr_trainer_backend;

import java.util.List;

public class Performance {

    private int id;

    private int uid;

    private String feedbackType;

    private double meanDepth;

    private double meanFreq;

    private double stdDepth;

    private double stdFreq;

    private int highDepthCount;

    private int highFreqCount;

    private int lowDepthCount;

    private int lowFreqCount;

    private int totalCompression;

    private double trainingTime;

    private String performanceDate;

    private double score;

    private List<Double> DepthArray;

    private List<Double> FreqArray;

    private List<Double> positionArray;

    private List<PerformanceNotes> performanceNotes;

    private int status;
 
    // Constructor

    public Performance() {}
 
    // Full Constructor

    public Performance(int id, int uid, String feedbackType, double meanDepth, double meanFreq,

                       double stdDepth, double stdFreq, int highDepthCount, int highFreqCount,

                       int lowDepthCount, int lowFreqCount, int totalCompression,

                       double trainingTime, String performanceDate, double score, List<Double> DepthArray,
                       
                       List<Double> FreqArray, List<Double> positionArray, int status, List<PerformanceNotes> performanceNotes) {

        this.id = id;

        this.uid = uid;

        this.feedbackType = feedbackType;

        this.meanDepth = meanDepth;

        this.meanFreq = meanFreq;

        this.stdDepth = stdDepth;

        this.stdFreq = stdFreq;

        this.highDepthCount = highDepthCount;

        this.highFreqCount = highFreqCount;

        this.lowDepthCount = lowDepthCount;

        this.lowFreqCount = lowFreqCount;

        this.totalCompression = totalCompression;

        this.trainingTime = trainingTime;

        this.performanceDate = performanceDate;

        this.score = score;

        this.DepthArray = DepthArray;
        
        this.FreqArray = FreqArray;

        this.positionArray = positionArray;

        this.status = status;

        this.performanceNotes = performanceNotes;
    }
 
    // Getters and Setters

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }
 
    public int getUid() { return uid; }

    public void setUid(int uid) { this.uid = uid; }
 
    public String getFeedbackType() { return feedbackType; }

    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }
 
    public double getMeanDepth() { return meanDepth; }

    public void setMeanDepth(double meanDepth) { this.meanDepth = meanDepth; }
 
    public double getMeanFreq() { return meanFreq; }

    public void setMeanFreq(double meanFreq) { this.meanFreq = meanFreq; }
 
    public double getStdDepth() { return stdDepth; }

    public void setStdDepth(double stdDepth) { this.stdDepth = stdDepth; }
 
    public double getStdFreq() { return stdFreq; }

    public void setStdFreq(double stdFreq) { this.stdFreq = stdFreq; }
 
    public int getHighDepthCount() { return highDepthCount; }

    public void setHighDepthCount(int highDepthCount) { this.highDepthCount = highDepthCount; }
 
    public int getHighFreqCount() { return highFreqCount; }

    public void setHighFreqCount(int highFreqCount) { this.highFreqCount = highFreqCount; }
 
    public int getLowDepthCount() { return lowDepthCount; }

    public void setLowDepthCount(int lowDepthCount) { this.lowDepthCount = lowDepthCount; }
 
    public int getLowFreqCount() { return lowFreqCount; }

    public void setLowFreqCount(int lowFreqCount) { this.lowFreqCount = lowFreqCount; }
 
    public int getTotalCompression() { return totalCompression; }

    public void setTotalCompression(int totalCompression) { this.totalCompression = totalCompression; }
 
    public double getTrainingTime() { return trainingTime; }

    public void setTrainingTime(double trainingTime) { this.trainingTime = trainingTime; }
 
    public String getPerformanceDate() { return performanceDate; }

    public void setPerformanceDate(String performanceDate) { this.performanceDate = performanceDate; }

    public double getScore() { return score; }

    public void setScore(double score) { this.score = score; }

    public List<Double> getDepthArray() {return DepthArray;  }

    public void setDepthArray(List<Double> DepthArray) {this.DepthArray = DepthArray;}

    public List<Double> getFreqArray() {return FreqArray;  }

    public void setFreqArray(List<Double> FreqArray) {this.FreqArray = FreqArray;}

    public List<Double> getPositionArray() {return positionArray;  }

    public void setPositionArray(List<Double> positionArray) {this.positionArray = positionArray;}

    public int getStatus() {return status;}

    public void setStatus(int status) {this.status = status;}

    public List<PerformanceNotes> getPerformanceNotes() {return performanceNotes;  }

    public void setPerformanceNotes(List<PerformanceNotes> performanceNotes) {this.performanceNotes = performanceNotes;}
}

 