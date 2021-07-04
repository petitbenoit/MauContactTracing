export interface Data {
  farm: string;
}

export interface House {
    id: string; // CR-2006-1
    houseNo: number;
    deadInBoxes: string;
    livingSpaceM2: string;
    stockAtStart: string;
    farmWorker: string;
}

export interface HouseData {
  id?: string;
  uid: string;
  date: string;
  status: number;
  age: number;
  culls: number;
  dead: number;
  stockOfBirdsAtEndOfDay: number;
  totalMortality: number;
}

export interface Farm {
  id: string; // CR
  farmName: string;
  flockNo: string; // CR-2006
  supervisor: string; // uid
}
