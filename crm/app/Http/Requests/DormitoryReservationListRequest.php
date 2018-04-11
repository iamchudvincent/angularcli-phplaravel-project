<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DormitoryReservationListRequest extends FormRequest
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
            "arrival" => "required|date_format:Y-m-d",
            "buildingId" => "required|exists:buildings,id",
            "gender" => "required|in:null,-1,1,2",
            "roomTypeId" => "required|in:-1,1,2,3,4,5",
            "dateFrom" => "sometimes|date_format:Y-m-d",
            "dateTo" => "sometimes|date_format:Y-m-d",
            "status" => "sometimes|in:-1,1,2,3,4,5,6",
            "nationalityId" => "sometimes|exists:nationalities,id"
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.dormitory_reservation');
        return [
            "arrival.required" => $errorCodes['arrival_required']['key'],
            "arrival.date_format" => $errorCodes['arrival_invalid']['key'],
            "buildingId.required" => $errorCodes['building_id_required']['key'],
            "buildingId.exists" => $errorCodes['building_id_invalid']['key'],
            "gender.required" => $errorCodes['gender_required']['key'],
            "gender.in" => $errorCodes['gender_invalid']['key'],
            "roomTypeId.required" => $errorCodes['room_type_id_required']['key'],
            "roomTypeId.in" => $errorCodes['room_type_id_invalid']['key'],
            "dateFrom.date_format" => $errorCodes['date_from_invalid']['key'],
            "dateTo.date_format" => $errorCodes['date_to_invalid']['key'],
            "status.in" => $errorCodes['status_invalid']['key'],
            "nationalityId.exists" => $errorCodes['nationality_id_invalid']
        ];
    }
}
