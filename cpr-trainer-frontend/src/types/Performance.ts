import PerformanceNote from "./PerformanceNote";

type Performance = {
    id: number;
    uid: number;
    feedbackType: string;
    meanDepth: number;
    meanFreq: number;
    stdDepth: number;
    stdFreq: number;
    highDepthCount: number;
    highFreqCount: number;
    lowDepthCount: number;
    lowFreqCount: number;
    totalCompression: number;
    score: number;
    trainingTime: number;
    performanceDate: string;
    depthArray: [];
    freqArray: [];
    positionArray: [];
    notesArray : PerformanceNote[],
    status: number;
};

export default Performance;
