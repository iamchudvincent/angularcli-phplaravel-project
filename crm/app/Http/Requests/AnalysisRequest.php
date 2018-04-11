<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalysisRequest extends FormRequest
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
            'type' => 'required|in:1,2',
            'buildingId' => 'required|exists:buildings,id',
            'dateFrom' => 'required|date_format:Y-m-d',
            'dateTo' => 'required|date_format:Y-m-d'
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.analysis');
        return [
            'type.required' => $errorCodes['type_required']['key'],
            'type.in' => $errorCodes['type_invalid']['key'],
            'buildingId.required' => $errorCodes['building_id_required']['key'],
            'buildingId.exists' => $errorCodes['building_id_invalid']['key'],
            'dateFrom.required' => $errorCodes['date_from_required']['key'],
            'dateFrom.date_format' => $errorCodes['date_from_invalid']['key'],
            'dateTo.required' => $errorCodes['date_to_required']['key'],
            'dateTo.date_format' => $errorCodes['date_to_invalid']['key'],
        ];
    }
}
