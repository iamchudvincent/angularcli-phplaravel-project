<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DormitoryReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "bedId" => "required|exists:beds,id",
            "dateFrom" => "required|date_format:Y-m-d",
            "dateTo" => "required|date_format:Y-m-d",
            "reservationStatusId" => "required|exists:reservation_statuses,id",
            "memo" => "sometimes|max:1000",
            "nationalityId" => "required_if:reservationStatusId,2|required_if:reservationStatusId,3|required_if:reservationStatusId,4|exists:nationalities,id"
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.dormitory_reservation');
        return [
            "bedId.required" => $errorCodes['bed_id_required']['key'],
            "bedId.exists" => $errorCodes['bed_id_invalid']['key'],
            "dateFrom.required" => $errorCodes['date_from_required']['key'],
            "dateFrom.date_format" => $errorCodes['date_from_invalid']['key'],
            "dateTo.required" => $errorCodes['date_to_required']['key'],
            "dateTo.date_format" => $errorCodes['date_to_invalid']['key'],
            "reservationStatusId.required" => $errorCodes['reservation_status_id_required']['key'],
            "reservationStatusId.exists" => $errorCodes['reservation_status_id_invalid']['key'],
            "memo.present" => $errorCodes['memo_required']['key'],
            "memo.max" => $errorCodes['memo_more_1000']['key'],
            "nationalityId.required" => $errorCodes['nationality_id_required']['key'],
            "nationalityId.exists" => $errorCodes['nationality_id_invalid']['key']
        ];
    }
}
