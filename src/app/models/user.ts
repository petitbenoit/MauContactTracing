export interface User {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userPhoto?: string;
    createdAt: number;
    updatedAt?: number;
    symptoms?: Symptoms;
    testResult?: TestResult;
}

export interface Symptoms {
    updatedAt?: string;
    temp: number; // degree Celsius
    cough: number; // yes or no (1 or 0)
    fever: number; // yes or no (1 or 0)
    DiffToBreath: number; // yes or no (1 or 0)
    soreThroat: number;
    headache: number;
    remarks: string; // Other important details
    private: number; // let officials see symptoms
}

export interface TestResult {
    positive: boolean; // 1 or 0
    date?: number;
    createdAt: number;
    updatedAt?: number;
}

export interface BluetoothInfo {
    name?: string;
    deviceUUID: string; // user device uuid sending the information to determine the phone thats sends the data
    location: Array<string>;
    time: number;
    transmissionPower : number;
    payload: string;
}
