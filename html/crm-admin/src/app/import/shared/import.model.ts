export class ImportDataErrorModel {
    constructor() { }

    public bed_id: number;
    public date_from: string;
    public date_to: string;
    public reservation_status_id: number;
    public memo: string;
    public nationality_id: number
}

export class ImportDataLineErrorModel {
    constructor() { }

    public row: number;
    public errors: Array<string>;
}

export class ImportDataFullErrorModel {
    constructor() { 
        this.data = [];
        this.errors = [];
    }

    public data: Array<ImportDataErrorModel>;
    public errors: Array<ImportDataLineErrorModel>;
}