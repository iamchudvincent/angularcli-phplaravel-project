<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyRequest extends FormRequest
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
//        $sex = config('constants.sex');

        return [
            'passportName' => 'max:100',
//            'checkIn' => 'date_format:Y-m-d',
//            'checkOut' => 'date_format:Y-m-d',
        ];
    }

    public function messages()
    {
//        $errorcodes = config('errorcodes.enroll');
        return [
//            'agentEmail.email' => $errorcodes['agent_email_invalid']['key']
        ];
    }
}
