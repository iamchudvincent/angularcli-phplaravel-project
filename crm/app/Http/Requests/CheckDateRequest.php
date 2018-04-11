<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckDateRequest extends FormRequest
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
            "reservationId" => "required",
            "date" => "required|date_format:Y-m-d",
            "bedId" => "required|exists:beds,id"
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.dormitory_reservation');
        return [
            "reservationId.required" => $errorCodes['building_id_required']['key'],
            "dateTo.required" => $errorCodes['date_to_required']['key'],
            "dateTo.date_format" => $errorCodes['date_to_invalid']['key'],
            "bedId.required" => $errorCodes['bed_id_required']['key'],
            "bedId.exists" => $errorCodes['bed_id_invalid']['key']
        ];
    }
}
