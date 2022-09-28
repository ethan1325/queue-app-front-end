export interface Queue {
    id: number;
    table?: number;
    status: "waiting" | "assigned" | "served";
}