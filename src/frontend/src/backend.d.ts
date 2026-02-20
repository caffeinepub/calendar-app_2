import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Event {
    id: string;
    title: string;
    reminder: boolean;
    date: string;
    createdAt: Time;
    time: string;
    description: string;
}
export type Time = bigint;
export interface backendInterface {
    createEvent(id: string, title: string, description: string, date: string, time: string, reminder: boolean): Promise<void>;
    deleteEvent(id: string): Promise<void>;
    getAllEvents(): Promise<Array<Event>>;
    getEvent(id: string): Promise<Event>;
    updateEvent(id: string, title: string, description: string, date: string, time: string, reminder: boolean): Promise<void>;
}
