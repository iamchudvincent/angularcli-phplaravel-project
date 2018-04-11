<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccommodationWithRoomForEnrollRequest extends FormRequest
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
            'planId' => 'required|exists:plans,id',
            'buildingId' => 'required|exists:buildings,id',
            'checkIn' => 'required|date_format:Y-m-d',
            'checkOut' => 'required|date_format:Y-m-d',
            'numOf' => 'required|in:1,2',
            'gender' => 'required|in:1,2',
            'term' => 'required'
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.accommodation');
        return [
            'planId.required' => $errorcodes['plan_id_required']['key'],
            'planId.exists' => $errorcodes['plan_id_invalid']['key'],
            'buildingId.required' => $errorcodes['building_id_required']['key'],
            'buildingId.exists' => $errorcodes['building_id_invalid']['key'],
            'checkIn.required' => $errorcodes['check_in_required']['key'],
            'checkIn_date_format' => $errorcodes['check_in_invalid']['key'],
            'checkOut.required' => $errorcodes['check_out_required']['key'],
            'checkOut.date_format' => $errorcodes['check_out_invalid']['key'],
            'numOf.required' => $errorcodes['num_of_required']['key'],
            'numOf.in' => $errorcodes['num_of_invalid']['key'],
            'gender.required' => $errorcodes['gender_required']['key'],
            'gender.in' => $errorcodes['gender_invalid']['key'],
            'term.required' => $errorcodes['term_required']['key']
        ];
    }
}
