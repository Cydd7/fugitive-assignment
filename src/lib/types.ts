export interface ICity {
    id: number;
    name: string;
    distance: number;
}

export interface IVehicle {
    id: number;
    kind: string;
    range: number;
    max_count: number;
}

export interface ICop {
    id: number;
    name: string;
    image: string;
}

export interface IGameSession {
    id: string;
    fugitiveCityId: number;
    createdAt: Date;
}

export interface ISelection {
    id?: string;
    copId: number;
    cityId: number;
    vehicleId?: number | null;
    gameSessionId: string;
}
