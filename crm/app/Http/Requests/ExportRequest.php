<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportRequest extends FormRequest
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
            'dateFrom' => 'required|date_format:Y-m-d',
            'dateTo' => 'required|date_format:Y-m-d',
            'buildingId' => 'required|exists:buildings,id',
            'stayType' => 'required|in:dormitory,other',
            'gender' => 'in:-1,1,2,null',
            'roomType' => 'sometimes|in:-1,1,2,3,4,5'
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.import_export');
        return [
            'dateFrom.required' => $errorCodes['date_from_required']['key'],
            'dateFrom.date_format' => $errorCodes['date_from_invalid']['key'],
            'dateTo.required' => $errorCodes['date_to_required']['key'],
            'dateTo.date_format' => $errorCodes['date_to_invalid']['key'],
            'buildingId.required' => $errorCodes['building_id_required']['key'],
            'buildingId.exists' => $errorCodes['building_id_invalid']['key'],
            'stayType.required' => $errorCodes['stay_type_required']['key'],
            'stayType.in' => $errorCodes['stay_type_invalid']['key'],
            'gender.in' => $errorCodes['gender_invalid']['key'],
            'roomType.in' => $errorCodes['room_type_invalid']['key']
        ];
    }
}
