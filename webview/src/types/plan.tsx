export interface Annotation {
    Name: string;
    Params: string;
    Returns: string;
    Description: string;
  }
  
  export interface Plan {
    ClassName: string;
    Annotations: Annotation[];
  }
  
  export interface PlanData {
    Plans: Plan[];
    Language: string;
  }