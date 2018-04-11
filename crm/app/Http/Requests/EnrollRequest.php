<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrollRequest extends FormRequest
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
        $sex = config('constants.sex');

        return [
            'consultation' => 'max:1000',
            'name' => 'required|max:100',
            'passportName' => 'required|max:100',
            'birthday' => 'required|date_format:Y-m-d',
            'sex' => 'required|in:'.$sex['male']['jp_key'].','.$sex['female']['jp_key'],
            'nationality' => 'required|max:100',
            'address' => 'required',
            'phone' => 'required',
            'email' => 'required|email',
            'job' => 'required|max:100',
            'planId' => 'required|exists:plans,id',
            'buildingId' => 'required|exists:buildings,id',
            'numOf' => 'required|in:1,2',
            'term' => 'required',
            'checkIn' => 'required|date_format:Y-m-d',
            'checkOut' => 'required|date_format:Y-m-d',
            'entrance' => 'required|date_format:Y-m-d',
            'graduation' => 'required|date_format:Y-m-d',
            'accommodationId1' => 'required',
            'roomId1' => 'required_unless:accommodationId1,-1|exists:rooms,id',
            'accommodationId2' => 'exists:accommodations,id',
            'roomId2' => 'required_with:accommodationId2|exists:rooms,id',
            'optionsList' => 'present|array',
            'applicationRoute' => 'required|in:agent,individual',
            'agentName' => 'required_if:applicationRoute,agent|max:100',
            'agentEmail' => 'required_if:applicationRoute,agent|email',
        ];
    }

    public function messages()
    {
        $errorcodes = config('errorcodes.enroll');
        return [
            'consultation.max' => $errorcodes['consultation_more_1000']['key'],
            'name.required' => $errorcodes['name_required']['key'],
            'name.max' => $errorcodes['name_more_100']['key'],
            'passportName.required' => $errorcodes['passport_name_required']['key'],
            'passportName.regex' => $errorcodes['passport_name_invalid']['key'],
            'passportName.max' => $errorcodes['passport_name_more_100']['key'],
            'birthday.required' => $errorcodes['birthday_required']['key'],
            'birthday.date_format' => $errorcodes['birthday_invalid']['key'],
            'sex.required' => $errorcodes['sex_required']['key'],
            'sex.in' => $errorcodes['sex_invalid']['key'],
            'numOf.required' => $errorcodes['num_of_required']['key'],
            'numOf.in' => $errorcodes['num_of_invalid']['key'],
            'nationality.required' => $errorcodes['nationality_required']['key'],
            'nationality.max' => $errorcodes['nationality_more_100']['key'],
            'address.required' => $errorcodes['address_required']['key'],
            'phone.required' => $errorcodes['phone_required']['key'],
            'email.required' => $errorcodes['email_required']['key'],
            'email.email' => $errorcodes['email_invalid']['key'],
            'job.required' => $errorcodes['job_required']['key'],
            'job.max' => $errorcodes['job_more_100']['key'],
            'planId.required' => $errorcodes['plan_id_required']['key'],
            'planId.exists' => $errorcodes['plan_id_invalid']['key'],
            'buildingId.required' => $errorcodes['building_id_required']['key'],
            'buildingId.exists' => $errorcodes['building_id_invalid']['key'],
            'term.required' => $errorcodes['term_required']['key'],
            'checkIn.required' => $errorcodes['check_in_required']['key'],
            'checkIn_date_format' => $errorcodes['check_in_invalid']['key'],
            'checkOut.required' => $errorcodes['check_out_required']['key'],
            'checkOut.date_format' => $errorcodes['check_out_invalid']['key'],
            'entrance.required' => $errorcodes['entrance_required']['key'],
            'entrance.date_format' => $errorcodes['entrance_invalid']['key'],
            'graduation.required' => $errorcodes['graduation_required']['key'],
            'graduation.date_format' => $errorcodes['graduation_invalid']['key'],
            'accommodationId1.required' => $errorcodes['accommodationId1_required']['key'],
            'roomId1.exists' => $errorcodes['roomId1_invalid']['key'],
            'roomId1.required_unless' => $errorcodes['roomId1_required']['key'],
            'accommodationId2.exists' => $errorcodes['accommodationId2_invalid']['key'],
            'roomId2.required_with' => $errorcodes['roomId2_required']['key'],
            'roomId2.exists' => $errorcodes['roomId2_invalid']['key'],
            'optionsList.array' => $errorcodes['options_list_invalid']['key'],
            'optionsList.present' => $errorcodes['options_list_required']['key'],
            'applicationRoute.required' => $errorcodes['application_route_required']['key'],
            'applicationRoute.in' => $errorcodes['application_route_invalid']['key'],
            'agentName.required_if' => $errorcodes['agent_name_required']['key'],
            'agentName.max' => $errorcodes['agent_name_more_100']['key'],
            'agentEmail.required_if' => $errorcodes['agent_email_required']['key'],
            'agentEmail.email' => $errorcodes['agent_email_invalid']['key']
        ];
    }
}
