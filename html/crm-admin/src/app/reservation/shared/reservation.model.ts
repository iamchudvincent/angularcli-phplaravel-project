export class RoomsAndBedsModel {
    bedId: Number;
    gender: Number;
    roomType: String;
    dormitoryRoomName: String;
    bed: String;
}

export class EventsModel extends RoomsAndBedsModel {
    reservationDate: ReservationDateModel[];
}

export class ReservationDateModel {
    id: number;
    bedId: number;
    dateFrom: string;
    dateTo: string;
    reservationStatusId: number;
    memo: string;
    nationalityId: number;
    warning: string = null;
    lastUpdated: string;
    lastUpdatedBy: string;
    created: string;
    createdBy: string;
}

export class ListBedsModel {
    lastUpdated: String;
    lastUpdatedBy: String;
    beds: EventsModel[];
}

export class StatusIconModel {
    id: Number;
    src: String;
}


export class FilterModel {
    arrival: string;
    buildingId: number;
    gender: number;
    roomTypeId: number;
    status: number;
    dateFrom: string;
    dateTo: string;
    nationalityId: number;
    stayPlanId: number
}

export class OtherReservationDateModel {
    id: number;
    accommodationId: number;
    dateFrom: string;
    dateTo: string;
    reservationStatusId: number;
    hotelStatusId: number;
    memo: string;
    nationalityId: number;
    lastUpdated: string;
    lastUpdatedBy: string;
    created: string;
    createdBy: string;
}

export class AccommodationsModel {
    accommodationId: Number;
    name: String;
    otherReservationDate: Array<OtherReservationDateModel>;
    days: any;
}

export class ListAccommodationsModel {
    lastUpdated: String;
    lastUpdatedBy: String;
    accommodations: Array<AccommodationsModel>;
}
