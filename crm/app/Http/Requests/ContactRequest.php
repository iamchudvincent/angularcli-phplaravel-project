<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
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
        $contactAbout = config('constants.contact.contact_about');

        return [
            'name' => 'required|max:100',
            'kana' => 'required|regex:/^[ぁ-ん　 ー・]+$/u|max:100',
            'phone' => 'required|max:30',
            'email' => 'required|email',
            'inquiryAbout' => 'required|in:'.$contactAbout['individual']['jp_value'].','.$contactAbout['corporate']['jp_value'],
            'options' => 'required|array',
            'inquiryContent' => 'max:1000',
            'zipCode' => 'max:10',
            'municipality' => 'max:100',
            'houseNumber' => 'max:100'
        ];
    }

    public function messages()
    {
        $errorCodes = config('errorcodes.contact');

        return [
            'name.required' => $errorCodes['name_required']['key'],
            'name.max' => $errorCodes['name_more_100']['key'],
            'kana.required' => $errorCodes['kana_required']['key'],
            'kana.regex' => $errorCodes['kana_invalid']['key'],
            'kana.max' => $errorCodes['kana_more_100']['key'],
            'phone.required' => $errorCodes['phone_required']['key'],
            'phone.max' => $errorCodes['phone_more_30']['key'],
            'email.required' => $errorCodes['email_required']['key'],
            'email.email' => $errorCodes['email_invalid']['key'],
            'inquiryAbout.required' => $errorCodes['inquiry_about_required']['key'],
            'inquiryAbout.in' => $errorCodes['inquiry_about_invalid']['key'],
            'options.required' => $errorCodes['options_required']['key'],
            'options.array' => $errorCodes['options_invalid']['key'],
            'inquiryContent.max' => $errorCodes['inquiry_content_more_1000']['key'],
            'zipCode.max' => $errorCodes['zip_code_more_10'],
            'municipality.max' => $errorCodes['municipality_more_100'],
            'houseNumber.max' => $errorCodes['house_number_more_100']
        ];
    }
}
