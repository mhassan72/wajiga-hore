
export interface Profile {
    id: string
    avatar? :  string;
    created_at? :  string
    displayName? : string
    email? : string
    phone_number? : string
    role? : string
    address? : Array<Address>[]
    verified? : any
}

export interface Address {
    building_type: string
    dagmada?: string
    direction? : string
}