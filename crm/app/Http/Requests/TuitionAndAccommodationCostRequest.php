<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TuitionAndAccommodationCostRequest extends FormRequest
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
            'numOf' => 'required|in:1,2',
            'gender' => 'required|in:1,2',
            'buildingId' => 'required|exists:buildings,id',
            'term' => 'required',
            'checkIn' => 'required|date_format:Y-m-d',
            'checkOut' => 'required|date_format:Y-m-d',
            'entrance' => 'required|date_format:Y-m-d',
            'graduation' => 'required|date_format:Y-m-d',
            'applicationRoute' => 'required|in:agent,individual',
            'agentName' => 'required_if:applicationRoute,agent|max:100',
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.simulation');
        return [
            'planId.required' => $errorcodes['plan_id_required']['key'],
            'planId.exists' => $errorcodes['plan_id_invalid']['key'],
            'numOf.required' => $errorcodes['num_of_required']['key'],
            'numOf.in' => $errorcodes['num_of_invalid']['key'],
            'gender.required' => $errorcodes['gender_required']['key'],
            'gender.in' => $errorcodes['gender_invalid']['key'],
            'buildingId.required' => $errorcodes['building_id_required']['key'],
            'buildingId.exists' => $errorcodes['building_id_invalid']['key'],
            'term.required' => $errorcodes['term_required']['key'],
            'checkIn.required' => $errorcodes['check_in_required']['key'],
            'checkIn.date_format' => $errorcodes['check_in_invalid']['key'],
            'checkOut.required' => $errorcodes['check_out_required']['key'],
            'checkOut.date_format' => $errorcodes['check_out_invalid']['key'],
            'graduation.required' => $errorcodes['graduation_required']['key'],
            'graduation.date_format' => $errorcodes['graduation_invalid']['key'],
            'entrance.required' => $errorcodes['entrance_required']['key'],
            'entrance.date_format' => $errorcodes['entrance_invalid']['key'],
            'applicationRoute.required' => $errorcodes['application_route_required']['key'],
            'applicationRoute.in' => $errorcodes['application_route_invalid']['key'],
            'agentName.required_if' => $errorcodes['agent_name_required']['key'],
            'agentName.max' => $errorcodes['agent_name_more_100']['key'],
        ];
    }
}
