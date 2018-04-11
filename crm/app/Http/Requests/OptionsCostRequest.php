<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OptionsCostRequest extends FormRequest
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
            'checkIn' => 'required|date_format:Y-m-d'
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.simulation');
        return [
            'planId.required' => $errorcodes['plan_id_required']['key'],
            'planId.exists' => $errorcodes['plan_id_invalid']['key'],
            'checkIn.required' => $errorcodes['check_in_required']['key'],
            'checkIn.date_format' => $errorcodes['check_in_invalid']['key']
        ];
    }
}
