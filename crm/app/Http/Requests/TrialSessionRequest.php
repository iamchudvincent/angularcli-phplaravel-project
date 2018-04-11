<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrialSessionRequest extends FormRequest
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
            'name' => 'required|max:100',
            'email' => 'required|email',
            'kana' => 'required|regex:/^[ぁ-ん　 ー・]+$/u|max:100',
            'phone' => 'required',
            'placeOf' => 'required',
            'firstChosenDate' => 'required|max:100'
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.trial-session');
        return [
            'name.required' => $errorCodes['name_required']['key'],
            'name.max' => $errorCodes['name_more_100']['key'],
            'email.required' => $errorCodes['email_required']['key'],
            'email.email' => $errorCodes['email_invalid']['key'],
            'kana.required' => $errorCodes['kana_required']['key'],
            'kana.regex' => $errorCodes['kana_invalid']['key'],
            'kana.max' => $errorCodes['kana_more_100']['key'],
            'phone.required' => $errorCodes['phone_required']['key'],
            'placeOf.required' => $errorCodes['place_of_required']['key'],
            'firstChosenDate.required' => $errorCodes['first_chosen_date_required']['key'],
            'firstChosenDate.max' => $errorCodes['first_chosen_date_more_100']['key'],
        ];
    }
}
