export interface Table {
    id: number;
    queue_id?: number;
    teller?: string;
    time?: number;
    status: "available" | "booked" | "unavailable";
}