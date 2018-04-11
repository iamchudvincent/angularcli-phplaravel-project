<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculateTotalRequest extends FormRequest
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
            'term' => 'required',
            'subTotal' => 'required',
            'checkIn' => 'required|date_format:Y-m-d',
            'entrance' => 'required|date_format:Y-m-d',
            'graduation' => 'required|date_format:Y-m-d',
            'optionsList' => 'present|array',
            'applicationRoute' => 'required|in:agent,individual',
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.simulation');
        return [
            'planId.required' => $errorcodes['plan_id_required']['key'],
            'planId.exists' => $errorcodes['plan_id_invalid']['key'],
            'term.required' => $errorcodes['term_required']['key'],
            'subTotal.required' => $errorcodes['sub_total_required']['key'],
            'checkIn.required' => $errorcodes['check_in_required']['key'],
            'checkIn.date_format' => $errorcodes['check_in_invalid']['key'],
            'entrance.required' => $errorcodes['entrance_required']['key'],
            'entrance.date_format' => $errorcodes['entrance_invalid']['key'],
            'graduation.required' => $errorcodes['graduation_required']['key'],
            'graduation.date_format' => $errorcodes['graduation_invalid']['key'],
            'optionsList.present' => $errorcodes['options_list_required']['key'],
            'optionsList.array' => $errorcodes['options_list_invalid']['key'],
            'applicationRoute.required' => $errorcodes['application_route_required']['key'],
            'applicationRoute.in' => $errorcodes['application_route_invalid']['key'],
        ];
    }
}
