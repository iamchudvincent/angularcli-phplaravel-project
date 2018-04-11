<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OtherReservationListRequest extends FormRequest
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
            "buildingId" => "required|exists:buildings,id"
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.other_reservation');
        return [
            'arrival.required' => $errorCodes['arrival_required']['key'],
            'arrival.date_format' => $errorCodes['arrival_invalid']['key'],
            'buildingId.required' => $errorCodes['building_id_required']['key'],
            'buildingId.exists' => $errorCodes['building_id_invalid']['key']
        ];
    }
}
